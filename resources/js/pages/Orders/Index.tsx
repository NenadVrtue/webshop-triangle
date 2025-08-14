import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Package, Eye, ShoppingCart } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Narudžbe',
        href: '/orders',
    },
];

interface Order {
    id: number;
    order_date: string;
    status: string;
    customer_name: string;
    total: number;
    items_count: number;
}

interface OrdersIndexProps {
    orders: Order[];
}

export default function Index({ orders }: OrdersIndexProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('hr-HR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { label: 'Na čekanju', variant: 'secondary' as const },
            confirmed: { label: 'Potvrđeno', variant: 'default' as const },
            processing: { label: 'U obradi', variant: 'default' as const },
            shipped: { label: 'Poslano', variant: 'default' as const },
            delivered: { label: 'Dostavljeno', variant: 'default' as const },
            cancelled: { label: 'Otkazano', variant: 'destructive' as const },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
            label: status,
            variant: 'secondary' as const
        };

        return (
            <Badge variant={config.variant}>
                {config.label}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Početna" />


            <Head title="Moje narudžbe" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Moje narudžbe</h1>
                        <p className="text-muted-foreground">
                            Pregled svih vaših narudžbi
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Nastavi kupovinu
                        </Link>
                    </Button>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Narudžbe ({orders.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {orders.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Broj narudžbe</TableHead>
                                        <TableHead>Datum</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Stavke</TableHead>
                                        <TableHead className="text-right">Ukupno</TableHead>
                                        <TableHead className="text-right">Akcije</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                #{order.id}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(order.order_date)}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(order.status)}
                                            </TableCell>
                                            <TableCell>
                                                {order.items_count} {order.items_count === 1 ? 'stavka' : 'stavki'}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {order.total.toFixed(2)} KM
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/orders/${order.id}/success`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Detalji
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-semibold mb-2">Nema narudžbi</h3>
                                <p className="text-muted-foreground mb-6">
                                    Još niste napravili nijednu narudžbu.
                                </p>
                                <Button asChild>
                                    <Link href="/dashboard">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Počni kupovinu
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

        </AppLayout >
    );
}
