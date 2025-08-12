import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Mail, Phone, MapPin } from 'lucide-react';

interface OrderItem {
    id: number;
    tire_id: number;
    tire: {
        id: number;
        sifra: string;
        naziv: string;
        tip: string;
        dimenzije: string;
        brend?: string;
        veleprodajna_cijena?: number;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    id: number;
    status: string;
    order_date: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    company_name?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    notes?: string;
    subtotal: number;
    discount_amount: number;
    total: number;
    items?: OrderItem[];
}

interface SuccessProps {
    order: Order;
}

export default function Success({ order }: SuccessProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('sr-Latn-BA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const orderItems = order.items || [];

    return (
        <>
            <Head title={`Narudžba #${order.id} - Uspješno kreirana`} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-green-600 mb-2">
                            Narudžba je uspješno kreirana!
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Broj narudžbe: <span className="font-semibold">#{order.id}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Kreirana: {formatDate(order.order_date)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Details */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Detalji narudžbe
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {orderItems.length > 0 ? (
                                        <div className="space-y-4">
                                            {orderItems.map((item) => (
                                                <div key={item.id} className="flex justify-between items-start p-3 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{item.tire?.naziv || 'N/A'}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.tire?.sifra || 'N/A'} • {item.tire?.dimenzije || 'N/A'}
                                                        </p>
                                                        {item.tire?.brend && (
                                                            <p className="text-sm text-muted-foreground">
                                                                Brend: {item.tire.brend}
                                                            </p>
                                                        )}
                                                        <p className="text-sm">
                                                            {(item.unit_price || 0).toFixed(2)} KM × {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">
                                                            {(item.total_price || 0).toFixed(2)} KM
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>Nema dostupnih stavki narudžbe</p>
                                        </div>
                                    )}

                                    <Separator className="my-4" />

                                    {/* Order Totals */}
                                    <div className="space-y-2">
                                        {(order.discount_amount || 0) > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Popust:</span>
                                                <span>-{(order.discount_amount || 0).toFixed(2)} KM</span>
                                            </div>
                                        )}

                                        {(order.discount_amount || 0) > 0 && <Separator />}

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Ukupno:</span>
                                            <span>{(order.total || 0).toFixed(2)} KM</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Customer Information */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Informacije o kupcu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="font-medium">{order.customer_name}</p>
                                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                                    </div>

                                    {order.customer_phone && (
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{order.customer_phone}</span>
                                        </div>
                                    )}

                                    {order.company_name && (
                                        <div>
                                            <p className="text-sm">
                                                <span className="font-medium">Firma:</span> {order.company_name}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Delivery Address */}
                            {(order.address || order.city || order.postal_code) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Adresa dostave
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {order.address && (
                                            <p className="text-sm">{order.address}</p>
                                        )}
                                        <div className="flex gap-2 text-sm">
                                            {order.postal_code && <span>{order.postal_code}</span>}
                                            {order.city && <span>{order.city}</span>}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Notes */}
                            {order.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Napomene</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{order.notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Next Steps */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sljedeći koraci</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                            1
                                        </div>
                                        <div>
                                            <p className="font-medium">Potvrda narudžbe</p>
                                            <p className="text-sm text-muted-foreground">
                                                Poslali smo email potvrdu na {order.customer_email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                            2
                                        </div>
                                        <div>
                                            <p className="font-medium">Obrada narudžbe</p>
                                            <p className="text-sm text-muted-foreground">
                                                Naš tim će uskoro kontaktirati vas radi potvrde
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                                            3
                                        </div>
                                        <div>
                                            <p className="font-medium">Dostava</p>
                                            <p className="text-sm text-muted-foreground">
                                                Informacije o dostavi ćete dobiti putem emaila
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            Povratak na dashboard
                        </Button>
                        <Button onClick={() => window.print()}>
                            Ispiši narudžbu
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
