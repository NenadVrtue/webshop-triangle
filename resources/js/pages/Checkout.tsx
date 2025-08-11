import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem, User } from '@/types';

interface CheckoutFormData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    company_name: string;
    address: string;
    city: string;
    postal_code: string;
    notes: string;
    items: Array<{
        tire_id: number;
        quantity: number;
    }>;
    [key: string]: any; // Index signature for Inertia.js compatibility
}

export default function Checkout() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

    // Get authenticated user data from Inertia page props safely
    const page = usePage();
    const auth = (page.props as any).auth;
    const user = auth?.user;

    const { data, setData, post, processing, errors, reset } = useForm<CheckoutFormData>({
        customer_name: user?.name || user?.full_name || '',
        customer_email: user?.email || '',
        customer_phone: '',
        company_name: '',
        address: '',
        city: '',
        postal_code: '',
        notes: '',
        items: [],
    });

    // Update form items when cart changes
    useEffect(() => {
        const formItems = cart.map(item => ({
            tire_id: item.tire.id,
            quantity: item.quantity
        }));
        setData('items', formItems);
    }, [cart]);

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => {
        const price = item.tire.veleprodajna_cijena || 0;
        return sum + (price * item.quantity);
    }, 0);

    const total = subtotal;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Vaša korpa je prazna. Dodajte proizvode prije nastavka.');
            return;
        }

        post('/orders', {
            onSuccess: () => {
                clearCart();
                reset();
            },
            onError: (errors) => {
                console.error('Checkout errors:', errors);
            }
        });
    };

    const handleQuantityChange = (item: CartItem, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(item.id);
        } else {
            updateQuantity(item.id, newQuantity);
        }
    };

    if (cart.length === 0) {
        return (
            <>
                <Head title="Checkout" />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-bold mb-4">Vaša korpa je prazna</h1>
                        <p className="text-muted-foreground mb-6">
                            Dodajte proizvode u korpu prije nastavka na checkout.
                        </p>
                        <Button onClick={() => window.location.href = '/dashboard'}>
                            Povratak na dashboard
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Checkout" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Customer Information */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informacije o kupcu</CardTitle>
                                        {user && (
                                            <p className="text-sm text-muted-foreground">
                                                Podaci su automatski popunjeni na osnovu vašeg naloga
                                            </p>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="customer_name">Ime i prezime *</Label>
                                                <Input
                                                    id="customer_name"
                                                    value={data.customer_name}
                                                    onChange={(e) => setData('customer_name', e.target.value)}
                                                    className={errors.customer_name ? 'border-red-500' : ''}
                                                    placeholder="Unesite ime i prezime"
                                                />
                                                {errors.customer_name && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="customer_email">Email adresa *</Label>
                                                <Input
                                                    id="customer_email"
                                                    type="email"
                                                    value={data.customer_email}
                                                    onChange={(e) => setData('customer_email', e.target.value)}
                                                    className={errors.customer_email ? 'border-red-500' : ''}
                                                    placeholder="email@example.com"
                                                />
                                                {errors.customer_email && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="customer_phone">Telefon *</Label>
                                                <Input
                                                    id="customer_phone"
                                                    value={data.customer_phone}
                                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                                    className={errors.customer_phone ? 'border-red-500' : ''}
                                                    placeholder="+387 XX XXX XXX"
                                                />
                                                {errors.customer_phone && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="company_name">Naziv firme</Label>
                                                <Input
                                                    id="company_name"
                                                    value={data.company_name}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    placeholder="Naziv vaše firme (opcionalno)"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Adresa dostave</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="address">Adresa *</Label>
                                            <Input
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className={errors.address ? 'border-red-500' : ''}
                                                placeholder="Unesite adresu"
                                            />
                                            {errors.address && (
                                                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="city">Grad *</Label>
                                                <Input
                                                    id="city"
                                                    value={data.city}
                                                    onChange={(e) => setData('city', e.target.value)}
                                                    className={errors.city ? 'border-red-500' : ''}
                                                    placeholder="Unesite grad"
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="postal_code">Poštanski broj *</Label>
                                                <Input
                                                    id="postal_code"
                                                    value={data.postal_code}
                                                    onChange={(e) => setData('postal_code', e.target.value)}
                                                    className={errors.postal_code ? 'border-red-500' : ''}
                                                    placeholder="Unesite poštanski broj"
                                                />
                                                {errors.postal_code && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="notes">Napomene</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                className={errors.notes ? 'border-red-500' : ''}
                                                placeholder="Dodatne napomene za narudžbu..."
                                                rows={3}
                                            />

                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pregled narudžbe</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">{item.tire.naziv}</h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.tire.sifra} • {item.tire.dimenzije}
                                                        </p>
                                                        <p className="text-sm font-medium">
                                                            {(item.tire.veleprodajna_cijena || 0).toFixed(2)} KM
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>

                                                        <Input
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
                                                            className="w-16 text-center"
                                                            min="0"
                                                        />

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="my-4" />

                                        {/* Totals */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>{subtotal.toFixed(2)} KM</span>
                                            </div>

                                            <Separator />

                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Ukupno:</span>
                                                <span>{total.toFixed(2)} KM</span>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full mt-6"
                                            disabled={processing || cart.length === 0}
                                        >
                                            {processing ? 'Obrađuje se...' : 'Potvrdi narudžbu'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
