import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock, DollarSign, Percent, ShoppingCart, Truck, Users } from 'lucide-react';

interface Stats {
    total_users: number;
    active_users: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
}

interface Props {
    stats: Stats;
}

export default function AdminDashboard({ stats }: Props) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="container mx-auto space-y-8 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Upravljanje platformom</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ukupno korisnika</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">{stats.active_users} aktivnih</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ukupno narudžbi</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_orders}</div>
                            <p className="text-xs text-muted-foreground">{stats.pending_orders} na čekanju</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ukupni prihod</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Na čekanju</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_orders}</div>
                            <p className="text-xs text-muted-foreground">narudžbi za obradu</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation tiles */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/admin/orders">
                        <Card className="cursor-pointer transition-colors hover:bg-accent hover:ring-1 hover:ring-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Narudžbe</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Pregled i upravljanje narudžbama</p>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/tires">
                        <Card className="cursor-pointer transition-colors hover:bg-accent hover:ring-1 hover:ring-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Gume</CardTitle>
                                <Truck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Upravljanje katalogom guma</p>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/users">
                        <Card className="cursor-pointer transition-colors hover:bg-accent hover:ring-1 hover:ring-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Korisnici</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Upravljanje korisnicima</p>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/discounts">
                        <Card className="cursor-pointer transition-colors hover:bg-accent hover:ring-1 hover:ring-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Popusti</CardTitle>
                                <Percent className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">Popusti i promo kodovi</p>
                                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
