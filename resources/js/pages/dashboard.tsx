import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/table/data-table';
import { DataTableColumnHeader } from '@/components/table/column-header';
import { ContactFormDialog } from '@/components/contact-form-dialog';
import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency } from '@/lib/utils';
import { useCartContext } from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { ShoppingCart, MessageCircle } from 'lucide-react';

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
    discount_percentage?: number;
    discounted_price?: number;
    kolicina_na_stanju: number;
    sezona?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    kategorija?: string;
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

// Expandable cell component for naziv
export function ExpandableImeCell({ naziv }: { naziv: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Add null/undefined check
    if (!naziv) {
        return <div>-</div>;
    }

    return (
        <div
            className={`cursor-pointer transition-all duration-200 ${isExpanded
                ? "max-w-none whitespace-normal break-words"
                : "max-w-34 h-auto md:max-w-none truncate"
                }`}
            title={naziv}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {naziv}
            {!isExpanded && naziv.length > 20 && (
                <span className="ml-1 text-xs text-muted-foreground md:hidden">
                    👆
                </span>
            )}
        </div>
    );
}

const createUserTireColumns = (
    onAddToCart: (tire: Tire) => void
): ColumnDef<Tire>[] => [

        {
            accessorKey: "ime",
            header: "Naziv",
            enableHiding: false,
            meta: {
                className: "max-w-34 h-auto md:max-w-56 wrap"
            },
            cell: ({ row }) => (

                <ExpandableImeCell naziv={row.getValue("ime") as string} />
            ),
        },
        {
            accessorKey: "kolicina_na_stanju",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Količina na stanju" />
            ),
            cell: ({ row }) => {
                const quantity = row.getValue("kolicina_na_stanju") as number;
                return (
                    <div className={quantity === 0 ? "text-red-600 font-medium" : ""}>

                        {quantity === 0 ? (
                            <Badge variant="destructive" className="ml-2 text-xs">
                                Nema na stanju
                            </Badge>
                        ) : quantity < 4 ? (
                            <Badge variant="pending" className="ml-2 text-xs">
                                Dostupno 4 ili manje
                            </Badge>
                        ) : (
                            <Badge variant="delivered" className="ml-2 text-xs">
                                Dostupno
                            </Badge>
                        )}
                    </div>
                );
            },

        },
        {
            accessorKey: "veleprodajna_cijena",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="VP Cijena" />
            ),
            cell: ({ row }) => {
                const price = row.getValue("veleprodajna_cijena") as number;
                const discountPercentage = row.original.discount_percentage || 0;
                const discountedPrice = row.original.discounted_price || price;

                if (!price) return <span className="text-muted-foreground">Trenutno Nedostupna</span>;

                return (
                    <div>
                        {discountPercentage > 0 ? (
                            <div>
                                <div className="text-sm line-through text-muted-foreground">
                                    {price.toFixed(2)} KM
                                </div>
                                <div className="font-bold text-green-600">
                                    {discountedPrice.toFixed(2)} KM
                                </div>
                                <Badge variant="secondary" className="text-xs mt-1">
                                    -{discountPercentage}%
                                </Badge>
                            </div>
                        ) : (
                            <div className="font-medium">
                                {price.toFixed(2)} KM
                            </div>
                        )}
                    </div>
                );
            },

        },
        {
            accessorKey: "maloprodajna_cijena",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="MP Cijena" />
            ),
            cell: ({ row }) => {
                const price = row.getValue("maloprodajna_cijena") as number;
                if (!price) return <span className="text-muted-foreground">Trenutno Nedostupna</span>;
                return (
                    <div className="font-medium">
                        {price} KM
                    </div>
                );
            },

        },

        {
            accessorKey: "sirina",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Širina" />
            ),
            cell: ({ row }) => (
                <div>{row.getValue("sirina")}</div>
            ),

        },
        {
            accessorKey: "visina",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Visina" />
            ),
            cell: ({ row }) => (
                <div>{row.getValue("visina")}</div>
            ),

        },
        {
            accessorKey: "dimenzije",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Prečnik" />
            ),
            cell: ({ row }) => (
                <div>{row.getValue("dimenzije")}</div>
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
            accessorKey: "kategorija",
            header: "Kategorija",
            cell: ({ row }) => (
                <div>{row.getValue("kategorija")}</div>
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
            id: "actions",
            header: "Akcije",
            cell: ({ row }) => {
                const tire = row.original;
                const isActive = tire.is_active;
                const canAddToCart = tire.is_active && tire.kolicina_na_stanju > 0;

                return (
                    <>
                        {canAddToCart ? (
                            <Button
                                onClick={() => onAddToCart(tire)}
                                size="sm"
                                variant={isActive ? "default" : "secondary"}
                                className="h-8 flex items-center gap-2"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span className='hidden md:block'>Dodaj u korpu</span>
                            </Button>
                        ) : (
                            <ContactFormDialog tire={tire}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 flex items-center gap-2"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    <span className='hidden md:block'>Pošalji upit</span>
                                </Button>
                            </ContactFormDialog>
                        )}
                    </>
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
        <div className="container mx-auto p-6 px-1 md:px-2 lg:px-4 space-y-8">
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
                <CardContent className='px-1 md:px-2 lg:px-4'>
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
