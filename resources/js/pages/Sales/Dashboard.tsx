import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    ShoppingCart,
    Mail,
    Phone,
    Building,
    MapPin,
    Eye,
    Edit,
    Filter,
    X
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

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

interface Props {
    orders: Order[];
    filters: {
        status: string;
        date_from?: string;
        date_to?: string;
        customer_search?: string;
    };
}

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case 'pending': return 'secondary';
        case 'processing': return 'outline';
        case 'done': return 'default';
        case 'cancelled': return 'destructive';
        default: return 'secondary';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending': return 'Na čekanju';
        case 'processing': return 'U procesu';
        case 'done': return 'Završena';
        case 'cancelled': return 'Otkazana';
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

export default function SalesDashboard({ orders, filters }: Props) {
    const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        status: filters.status || 'all',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        customer_search: filters.customer_search || '',
    });

    const handleStatusUpdate = async (orderId: number, newStatus: string) => {
        setUpdatingStatus(orderId);

        try {
            await router.patch(`/sales/orders/${orderId}/status`, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingStatus(null);
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

        router.get('/sales', Object.fromEntries(params), {
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
        router.get('/sales');
    };

    const statusOptions = [
        { value: 'all', label: 'Svi statusi' },
        { value: 'pending', label: 'Na čekanju' },
        { value: 'processing', label: 'U procesu' },
        { value: 'done', label: 'Završena' },
        { value: 'cancelled', label: 'Otkazana' },
    ];

    return (
        <AppLayout>
            <Head title="Prodaja Dashboard" />

            <div className="container mx-auto p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Prodaja</h1>
                        <p className="text-muted-foreground">
                            Upravljanje narudžbama i statusima
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filteri
                    </Button>
                </div>

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
                            Pregled i upravljanje svim narudžbama
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
                                                            {statusOptions.map((option) => (
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
        </AppLayout>
    );
}
