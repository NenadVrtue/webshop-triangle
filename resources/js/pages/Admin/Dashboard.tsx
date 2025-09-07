import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { DataTable } from '@/components/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import {
    Users,
    ShoppingCart,
    DollarSign,
    Clock,
    Mail,
    Phone,
    Building,
    MapPin,
    Edit,
    Filter,
    UserPlus,
    Trash2,
    Eye,
    X,
    UserMinus
} from 'lucide-react';

interface User {
    id: number;
    full_name: string;
    email: string;
    company_name?: string;
    phone?: string;
    jib?: string;
    role: number;
    is_active: boolean;
    orders_count: number;
    created_at: string;
}

interface Order {
    id: number;
    order_date: string;
    status: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    company_name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    subtotal: number;
    discount_amount: number;
    total: number;
    items_count: number;
    user?: {
        id: number;
        full_name: string;
        email: string;
    };
    created_at: string;
}

interface Tire {
    id: number;
    sifra: string;
    ime: string;
    veleprodajna_cijena?: number;
    maloprodajna_cijena?: number;
    nabavna_cijena?: number;
    kolicina_na_stanju: number;
    sezona?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Stats {
    total_users: number;
    active_users: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
}

interface Props {
    users: User[];
    orders: Order[];
    tires: Tire[];
    stats: Stats;
    filters?: {
        status?: string;
        date_from?: string;
        date_to?: string;
        customer_search?: string;
    };
}

interface UserFormData {
    full_name: string;
    email: string;
    company_name: string;
    phone: string;
    jib: string;
    password: string;
    role: number;
    is_active: boolean;
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'pending': return 'secondary';
        case 'confirmed': return 'default';
        case 'processing': return 'outline';
        case 'shipped': return 'default';
        case 'delivered': return 'default';
        case 'cancelled': return 'destructive';
        default: return 'secondary';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending': return 'Na čekanju';
        case 'confirmed': return 'Potvrđeno';
        case 'processing': return 'U obradi';
        case 'shipped': return 'Poslano';
        case 'delivered': return 'Dostavljeno';
        case 'cancelled': return 'Otkazano';
        default: return status;
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const createAdminTireColumns = (
    updatingTire: number | null,
    handleToggleActive: (tireId: number, currentStatus: boolean) => void
): ColumnDef<Tire>[] => [
        {
            accessorKey: "sifra",
            header: "Šifra",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("sifra")}</div>
            ),
        },
        {
            accessorKey: "ime",
            header: "Naziv",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate">{row.getValue("ime")}</div>
            ),
        },
        {
            accessorKey: "veleprodajna_cijena",
            header: "VP Cijena",
            cell: ({ row }) => (
                <div>{formatCurrency(row.getValue("veleprodajna_cijena"))}</div>
            ),
        },
        {
            accessorKey: "maloprodajna_cijena",
            header: "MP Cijena",
            cell: ({ row }) => (
                <div>{formatCurrency(row.getValue("maloprodajna_cijena"))}</div>
            ),
        },
        {
            accessorKey: "kolicina_na_stanju",
            header: "Stanje",
            cell: ({ row }) => {
                const quantity = row.getValue("kolicina_na_stanju") as number;
                return (
                    <div className={quantity === 0 ? "text-red-600 font-medium" : ""}>
                        {quantity}
                        {quantity === 0 && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                                Nema na stanju
                            </Badge>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "sezona",
            header: "Sezona",
            cell: ({ row }) => (
                <div>{row.getValue("sezona")}</div>
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const tire = row.original;
                const isActive = tire.is_active;
                const quantity = tire.kolicina_na_stanju;

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isActive}
                            disabled={updatingTire === tire.id}
                            onCheckedChange={() => handleToggleActive(tire.id, isActive)}
                        />
                        <Badge variant={isActive ? "default" : "secondary"}>
                            {isActive ? "Aktivna" : "Neaktivna"}
                        </Badge>
                        {quantity === 0 && (
                            <Badge variant="destructive" className="text-xs">
                                Nema na stanju
                            </Badge>
                        )}
                    </div>
                );
            },
        },
    ];

export default function AdminDashboard({ users, orders, tires = [], stats, filters = {} }: Props) {
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [updatingTire, setUpdatingTire] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || 'all',
        date_from: filters?.date_from || '',
        date_to: filters?.date_to || '',
        customer_search: filters?.customer_search || '',
    });

    // User management state
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userFormData, setUserFormData] = useState<UserFormData>({
        full_name: '',
        email: '',
        company_name: '',
        phone: '',
        jib: '',
        password: '',
        role: 0,
        is_active: true,
    });

    const roleOptions = [
        { value: 0, label: 'Korisnik' },
        { value: 1, label: 'Administrator' },
        { value: 2, label: 'Prodaja' },
    ];

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        setUpdatingStatus(orderId);

        try {
            await router.patch(`/admin/orders/${orderId}/status`, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleToggleActive = async (tireId: number, currentStatus: boolean) => {
        setUpdatingTire(tireId);

        try {
            await router.patch(`/api/tires/${tireId}/toggle-active`, {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        currentStatus
                            ? 'Guma je uspešno deaktivirana'
                            : 'Guma je uspešno aktivirana'
                    );
                },
                onError: (errors) => {
                    console.error('Toggle active error:', errors);
                    toast.error('Greška pri ažuriranju statusa gume');
                },
                onFinish: () => {
                    setUpdatingTire(null);
                }
            });
        } catch (error) {
            console.error('Toggle active error:', error);
            toast.error('Greška pri ažuriranju statusa gume');
            setUpdatingTire(null);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();

        Object.entries(localFilters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.append(key, value);
            }
        });

        router.get('/admin', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            status: 'all',
            date_from: '',
            date_to: '',
            customer_search: '',
        });
        router.get('/admin');
    };

    // User management functions
    const openCreateUserModal = () => {
        setEditingUser(null);
        setUserFormData({
            full_name: '',
            email: '',
            company_name: '',
            phone: '',
            jib: '',
            password: '',
            role: 0,
            is_active: true,
        });
        setShowUserModal(true);
    };

    const openEditUserModal = (user: User) => {
        setEditingUser(user);
        setUserFormData({
            full_name: user.full_name,
            email: user.email,
            company_name: user.company_name || '',
            phone: user.phone || '',
            jib: user.jib || '',
            password: '', // Don't populate password for editing
            role: user.role,
            is_active: user.is_active,
        });
        setShowUserModal(true);
    };

    const handleUserFormChange = (field: keyof UserFormData, value: string | boolean | number) => {
        setUserFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = { ...userFormData };

            // Remove empty password for updates
            if (editingUser && !submitData.password) {
                delete (submitData as any).password;
            }

            // Remove empty optional fields
            if (!submitData.phone) delete (submitData as any).phone;
            if (!submitData.jib) delete (submitData as any).jib;

            if (editingUser) {
                router.patch(`/users/${editingUser.id}`, submitData, {
                    onSuccess: () => {
                        toast.success('Korisnik je uspešno ažuriran');
                        setShowUserModal(false);
                    },
                    onError: (errors) => {
                        console.error('Validation errors:', errors);
                        // Show specific validation errors
                        Object.entries(errors).forEach(([field, messages]) => {
                            if (Array.isArray(messages)) {
                                messages.forEach(message => toast.error(`${field}: ${message}`));
                            } else {
                                toast.error(`${field}: ${messages}`);
                            }
                        });
                    }
                });
            } else {
                router.post('/users', submitData, {
                    onSuccess: () => {
                        toast.success('Korisnik je uspešno kreiran');
                        setShowUserModal(false);
                    },
                    onError: (errors) => {
                        console.error('Validation errors:', errors);
                        // Show specific validation errors
                        Object.entries(errors).forEach(([field, messages]) => {
                            if (Array.isArray(messages)) {
                                messages.forEach(message => toast.error(`${field}: ${message}`));
                            } else {
                                toast.error(`${field}: ${messages}`);
                            }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error submitting user:', error);
            toast.error('Došlo je do greške');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowDeleteDialog(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await router.delete(`/users/${userToDelete.id}`, {
                onSuccess: () => {
                    toast.success('Korisnik je uspešno obrisan');
                    setShowDeleteDialog(false);
                    setUserToDelete(null);
                },
                onError: (error) => {
                    console.error('Delete error:', error);
                    toast.error('Greška pri brisanju korisnika');
                }
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Došlo je do greške');
        }
    };

    const handleSoftDeleteUser = async (user: User) => {
        try {
            await router.patch(`/users/${user.id}`, {
                is_active: false
            }, {
                onSuccess: () => {
                    toast.success('Korisnik je uspešno deaktiviran');
                },
                onError: (error) => {
                    console.error('Error deactivating user:', error);
                    toast.error('Greška pri deaktiviranju korisnika');
                }
            });
        } catch (error) {
            console.error('Error deactivating user:', error);
            toast.error('Došlo je do greške');
        }
    };

    const statusOptions = [
        { value: 'all', label: 'Svi statusi' },
        { value: 'pending', label: 'Na čekanju' },
        { value: 'confirmed', label: 'Potvrđeno' },
        { value: 'processing', label: 'U obradi' },
        { value: 'shipped', label: 'Poslano' },
        { value: 'delivered', label: 'Dostavljeno' },
        { value: 'cancelled', label: 'Otkazano' },
    ];

    const adminTireColumns = createAdminTireColumns(updatingTire, handleToggleActive);

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="container mx-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Upravljanje korisnicima i narudžbama
                        </p>
                    </div>

                </div>


                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ukupno korisnika
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.active_users} aktivnih
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ukupno narudžbi
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pending_orders} na čekanju
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ukupni prihod
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.total_revenue)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Na čekanju
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_orders}</div>
                            <p className="text-xs text-muted-foreground">
                                narudžbi za obradu
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Korisnici
                                </CardTitle>
                                <CardDescription>
                                    Pregled svih registrovanih korisnika
                                </CardDescription>
                            </div>
                            <Button onClick={openCreateUserModal} className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Dodaj korisnika
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ime</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Kompanija</TableHead>
                                        <TableHead>Telefon</TableHead>
                                        <TableHead>JIB</TableHead>
                                        <TableHead>Uloga</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Narudžbe</TableHead>
                                        <TableHead>Registrovan</TableHead>
                                        <TableHead>Akcije</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.full_name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.company_name && (
                                                    <div className="flex items-center gap-1">
                                                        <Building className="h-3 w-3 text-muted-foreground" />
                                                        {user.company_name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{user.jib}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 1 ? 'default' : 'secondary'}>
                                                    {roleOptions.find(r => r.value === user.role)?.label || user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                                    {user.is_active ? 'Aktivan' : 'Neaktivan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {user.orders_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(user.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openEditUserModal(user)}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Tire Management Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upravljanje gumama</CardTitle>
                        <CardDescription>
                            Pregled i upravljanje statusom guma
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={adminTireColumns}
                            data={tires}
                        />
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>

                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Narudžbe
                            <Badge variant="outline" className="ml-2">
                                {orders.length} rezultata
                            </Badge>

                        </CardTitle>
                        <CardDescription>
                            Pregled svih narudžbi u sistemu
                        </CardDescription>

                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filteri
                        </Button>

                        {/* Filters Panel */}
                        {showFilters && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Filter className="h-5 w-5" />
                                        Filteri narudžbi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select
                                                value={localFilters.status}
                                                onValueChange={(value) => handleFilterChange('status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {statusOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_from">Od datuma</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.date_from}
                                                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_to">Do datuma</Label>
                                            <Input
                                                type="date"
                                                value={localFilters.date_to}
                                                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="customer_search">Pretraga kupca</Label>
                                            <Input
                                                placeholder="Ime, email ili kompanija..."
                                                value={localFilters.customer_search}
                                                onChange={(e) => handleFilterChange('customer_search', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button onClick={applyFilters}>
                                            Primeni filtere
                                        </Button>
                                        <Button variant="outline" onClick={clearFilters}>
                                            <X className="h-4 w-4 mr-1" />
                                            Obriši filtere
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <div className="rounded-md border">

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Kupac</TableHead>
                                        <TableHead>Kontakt</TableHead>
                                        <TableHead>Adresa</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Stavke</TableHead>
                                        <TableHead>Ukupno</TableHead>
                                        <TableHead>Datum</TableHead>
                                        <TableHead>Akcije</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">{order.customer_name}</div>
                                                    {order.company_name && (
                                                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                            <Building className="h-3 w-3" />
                                                            {order.company_name}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm flex items-center gap-1">
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                        {order.customer_email}
                                                    </div>
                                                    {order.customer_phone && (
                                                        <div className="text-sm flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                                            {order.customer_phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {(order.address || order.city) && (
                                                    <div className="text-sm flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        <div>
                                                            {order.address && <div>{order.address}</div>}
                                                            {order.city && (
                                                                <div>
                                                                    {order.postal_code && `${order.postal_code} `}
                                                                    {order.city}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={getStatusBadgeVariant(order.status)}>
                                                        {getStatusLabel(order.status)}
                                                    </Badge>
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                                        disabled={updatingStatus === order.id}
                                                    >
                                                        <SelectTrigger className="w-[140px] h-8">
                                                            <Edit className="h-3 w-3 mr-1" />
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statusOptions.slice(1).map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {order.items_count} stavki
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div className="space-y-1">
                                                    <div>{formatCurrency(order.total)}</div>
                                                    {order.discount_amount > 0 && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Popust: {formatCurrency(order.discount_amount)}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(order.order_date)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(`/orders/${order.id}/success`, '_blank')}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Detalji
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Create/Edit Modal */}
            <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Uredi korisnika' : 'Dodaj novog korisnika'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingUser
                                ? 'Ažuriraj informacije o korisniku'
                                : 'Unesite informacije za novog korisnika'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Puno ime *</Label>
                                <Input
                                    id="full_name"
                                    value={userFormData.full_name}
                                    onChange={(e) => handleUserFormChange('full_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={userFormData.email}
                                    onChange={(e) => handleUserFormChange('email', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Kompanija *</Label>
                                <Input
                                    id="company_name"
                                    value={userFormData.company_name}
                                    onChange={(e) => handleUserFormChange('company_name', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input
                                    id="phone"
                                    value={userFormData.phone}
                                    onChange={(e) => handleUserFormChange('phone', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jib">JIB</Label>
                                <Input
                                    id="jib"
                                    value={userFormData.jib}
                                    onChange={(e) => handleUserFormChange('jib', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Uloga *</Label>
                                <Select
                                    value={userFormData.role.toString()}
                                    onValueChange={(value) => handleUserFormChange('role', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Izaberite ulogu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value.toString()}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {editingUser ? 'Nova šifra (ostavite prazno da zadržite postojeću)' : 'Šifra *'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={userFormData.password}
                                onChange={(e) => handleUserFormChange('password', e.target.value)}
                                required={!editingUser}
                                minLength={8}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_active"
                                checked={userFormData.is_active}
                                onCheckedChange={(checked: boolean) => handleUserFormChange('is_active', checked)}
                            />
                            <Label htmlFor="is_active">Aktivan korisnik</Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowUserModal(false)}
                                disabled={isSubmitting}
                            >
                                Otkaži
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Čuva se...' : (editingUser ? 'Ažuriraj' : 'Kreiraj')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potvrda brisanja</DialogTitle>
                        <DialogDescription>
                            Da li ste sigurni da želite da obrišete korisnika{' '}
                            <strong>{userToDelete?.full_name}</strong>?
                            Ova akcija se ne može poništiti.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setShowDeleteDialog(false);
                                setUserToDelete(null);
                            }}
                        >
                            Otkaži
                        </Button>
                        {userToDelete?.is_active ? (
                            <Button
                                type="button"
                                onClick={() => {
                                    if (userToDelete) {
                                        handleSoftDeleteUser(userToDelete);
                                        setShowDeleteDialog(false);
                                        setUserToDelete(null);
                                    }
                                }}
                                className="bg-orange-600 text-white hover:bg-orange-700"
                            >
                                <UserMinus className="h-4 w-4 mr-1" />
                                Deaktiviraj
                            </Button>
                        ) : null}
                        <Button
                            type="button"
                            onClick={confirmDeleteUser}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Obriši
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
