"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
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
    sifra: string;
    naziv: string;
    tip: string;
    is_active: boolean;
    quantity: number;
    dimenzije: string;
    sirina: string;
    visina: string;
}

// Expandable cell component for naziv
function ExpandableNazivCell({ naziv }: { naziv: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`cursor-pointer transition-all duration-200 ${isExpanded
                ? "max-w-none whitespace-normal break-words"
                : "max-w-40 h-auto md:max-w-none truncate"
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
            accessorKey: "naziv",
            header: "Naziv",
            enableHiding: false,
            meta: {
                className: "max-w-40 h-auto md:max-w-none wrap"
            },

            cell: ({ row }) => {
                const naziv = row.getValue("naziv") as string;
                return (
                    <ExpandableNazivCell naziv={naziv} />
                );
            },
        },

        {
            accessorKey: "dimenzije",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Dimenzije" />
            ),
        },
        {
            accessorKey: "sirina",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Širina" />
            ),
        },
        {
            accessorKey: "visina",

            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Visina" />
            ),
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("is_active") as boolean;
                return (
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {isActive ? 'Aktivna' : 'Neaktivna'}
                    </span>
                );
            },
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
                        disabled={!tire.is_active}
                        className="max-w-fit "
                    >
                        Dodaj u korpu
                    </Button>
                );
            },
        },
    ];
}