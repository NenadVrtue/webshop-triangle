import React from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    Users,
    ShoppingCart,
    DollarSign,
    Clock,
    Mail,
    Phone,
    Building,
    MapPin,
    Eye
} from 'lucide-react';

interface User {
    id: number;
    full_name: string;
    email: string;
    company_name?: string;
    phone?: string;
    jib?: string;
    role: string;
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
    stats: Stats;
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

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: 'BAM'
    }).format(amount);
};

export default function AdminDashboard({ users, orders, stats }: Props) {
    return (
        <>
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
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Korisnici
                        </CardTitle>
                        <CardDescription>
                            Pregled svih registrovanih korisnika
                        </CardDescription>
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
                                                <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>
                                                    {user.role}
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            Narudžbe
                        </CardTitle>
                        <CardDescription>
                            Pregled svih narudžbi u sistemu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                                    {getStatusLabel(order.status)}
                                                </Badge>
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
        </>
    );
}
