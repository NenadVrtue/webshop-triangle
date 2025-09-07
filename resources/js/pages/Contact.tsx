import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kontakt',
        href: '/contact',
    },
];

export default function Contact() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kontakt" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Kontaktirajte nas</h1>
                    <p className="text-muted-foreground">
                        Potrebna vam je pomoć? Kontaktirajte naš tim za podršku
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                    {/* Email Contact */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">

                                Podrška i informacije
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Opšta pitanja</p>
                                <a
                                    href="mailto:info@webshop-triangle.com"
                                    className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    info@webshop-triangle.com
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Tehnička podrška</p>
                                <a
                                    href="mailto:support@webshop-triangle.com"
                                    className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    support@webshop-triangle.com
                                </a>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Narudžbe</p>
                                <a
                                    href="mailto:orders@webshop-triangle.com"
                                    className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    orders@webshop-triangle.com
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Info */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-orange-600" />
                            Dodatne informacije
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">Radno vrijeme</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>Ponedjeljak - Petak: 08:00 - 17:00</p>
                                    <p>Subota: 09:00 - 14:00</p>
                                    <p>Nedjelja: Zatvoreno</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Vrijeme odgovora</h3>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    <p>Telefon: Odmah tokom radnog vremena</p>
                                    <p>Email: Do 24 sata</p>
                                    <p>Hitni slučajevi: Pozovite direktno</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
