"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "./column-header"
import { useState } from "react"

import { ArrowUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

interface Tire {
    id: number;
    sifra?: string;
    ime?: string;

    brend?: string;
    tip?: string;
    dimenzije?: string;
    sirina?: string;
    visina?: string;
    precnik?: string;
    eprel_code?: string;
    is_active: boolean;
    // Only show customer-facing prices
    maloprodajna_cijena?: number;
    veleprodajna_cijena?: number;
    // Technical specifications
    load_speedindex?: string;
    dot?: string;
    pr?: string;
    m_s?: string;
    xl?: string;
    // Legacy fields for backward compatibility
    quantity?: number;
    created_at?: string;
    updated_at?: string;
    vp_cijena?: number;
}

// Expandable cell component for naziv
export function ExpandableNazivCell({ naziv }: { naziv: string }) {
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
export function createColumns(onAddToCart: (tire: Tire) => void): ColumnDef<Tire>[] {
    return [
        {
            accessorKey: "sifra",
            header: () => <div className="text-left">Šifra</div>,
            enableHiding: false,
        },
        {
            accessorKey: "ime",
            header: "Naziv",
            enableHiding: false,
            meta: {
                className: "max-w-34 h-auto md:max-w-none wrap"
            },
            cell: ({ row }) => {
                const naziv = row.getValue("ime") as string;
                return (
                    <ExpandableNazivCell naziv={naziv} />
                );
            },
        },
        {
            accessorKey: "dimenzije",
            header: "Dimenzije",
            enableHiding: false,
        },
        {
            accessorKey: "sirina",
            header: "Širina",
            enableHiding: false,
        },
        {
            accessorKey: "visina",
            header: "Visina",
            enableHiding: false,
        },
        {
            accessorKey: "eprel_code",
            header: "Eprel Code",
            enableHiding: false,
        },
        {
            accessorKey: "kolicina_na_stanju",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Količina na stanju" />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "vp_cijena",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Cijena" />
            ),
            cell: ({ row }) => {
                const price = row.getValue("vp_cijena") as number;
                if (!price) return <span className="text-muted-foreground">Trenutno Nedostupna</span>;
                return (
                    <div className="font-medium">
                        {price} KM
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            accessorKey: "sezona",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Kategorija" />
            ),
        },
        {
            accessorKey: "is_active",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean;
                const kolicina = row.getValue("kolicina_na_stanju") as number;
                const isOutOfStock = kolicina === 0;

                return (
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isActive && !isOutOfStock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {isActive && !isOutOfStock ? 'Aktivna' : 'Neaktivna'}
                        </span>
                        {isOutOfStock && (
                            <span className="text-xs text-orange-600 font-medium">
                                (Nema na stanju)
                            </span>
                        )}
                    </div>
                );
            },
            enableHiding: false,
        },
        {
            id: "actions",
            header: "AKCIJE",
            enableHiding: false,
            cell: ({ row }) => {
                const tire = row.original;
                return (
                    <Button
                        onClick={() => onAddToCart(tire)}
                        size="sm"
                        variant="outline"
                        className="h-8"
                        disabled={!tire.is_active}
                    >
                        Dodaj u korpu
                    </Button>
                );
            },
        },
    ];
}