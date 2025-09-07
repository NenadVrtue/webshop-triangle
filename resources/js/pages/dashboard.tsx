import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import { useCartContext } from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { ShoppingCart } from 'lucide-react';

interface Tire {
    id: number;
    sifra: string;
    ime: string;
    dimenzije?: string;
    sirina?: string;
    visina?: string;
    eprel_code?: string;
    veleprodajna_cijena?: number;
    maloprodajna_cijena?: number;
    nabavna_cijena?: number;
    kolicina_na_stanju: number;
    sezona?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface DashboardProps {
    tires: Tire[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna',
        href: '/pocetna',
    },
];

const createUserTireColumns = (
    onAddToCart: (tire: Tire) => void
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
            accessorKey: "veleprodajna_cijena",
            header: "VP Cijena",
            cell: ({ row }) => (
                <div>{formatCurrency(row.getValue("veleprodajna_cijena"))}</div>
            ),
        },
        {
            accessorKey: "dimenzije",
            header: "Dimenzije",
            cell: ({ row }) => (
                <div>{row.getValue("dimenzije")}</div>
            ),
        },
        {
            accessorKey: "sirina",
            header: "Širina",
            cell: ({ row }) => (
                <div>{row.getValue("sirina")}</div>
            ),
        },
        {
            accessorKey: "visina",
            header: "Visina",
            cell: ({ row }) => (
                <div>{row.getValue("visina")}</div>
            ),
        },
        {
            accessorKey: "eprel_code",
            header: "Eprel kod",
            cell: ({ row }) => (
                <a target='_blank' href={row.getValue("eprel_code")}>{row.getValue("eprel_code")}</a>
            ),
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
                console.log('guma je aktivna: ', isActive);
                const quantity = tire.kolicina_na_stanju;

                return (
                    <div className="flex items-center gap-2">
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
        {
            id: "actions",
            header: "Akcije",
            cell: ({ row }) => {
                const tire = row.original;
                const canAddToCart = tire.is_active && tire.kolicina_na_stanju > 0;

                return (
                    <Button
                        onClick={() => onAddToCart(tire)}
                        size="sm"
                        variant="outline"
                        className="h-8 flex items-center gap-2"
                        disabled={!canAddToCart}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Dodaj u korpu
                    </Button>
                );
            },
        },
    ];

// Child component rendered INSIDE AppLayout to safely use context
function DashboardContent({ tires }: { tires: Tire[] }) {
    const { addToCart } = useCartContext();

    const handleAddToCart = (tire: Tire) => {
        if (!tire.is_active) {
            alert('Ova guma nije aktivna i ne može biti dodana u korpu.');
            return;
        }
        if (tire.kolicina_na_stanju === 0) {
            alert('Ova guma nije na stanju i ne može biti dodana u korpu.');
            return;
        }
        console.log('Dashboard: Adding tire to cart:', tire);
        addToCart(tire, 1);
    };

    const userTireColumns = createUserTireColumns(handleAddToCart);

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Pregled dostupnih guma
                    </p>
                </div>
            </div>

            {/* Tires Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Dostupne gume
                    </CardTitle>
                    <CardDescription>
                        Pregled svih dostupnih guma za kupovinu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={userTireColumns}
                        data={tires}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default function Dashboard({ tires }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Početna" />
            <DashboardContent tires={tires} />
        </AppLayout>
    );
}
