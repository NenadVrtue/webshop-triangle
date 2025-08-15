import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
    alwaysShow?: boolean
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    alwaysShow,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-secondary hover:text-white -ml-3 h-8"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? (
                            <ArrowDown />
                        ) : column.getIsSorted() === "asc" ? (
                            <ArrowUp />
                        ) : (
                            <ChevronsUpDown />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                        <ArrowUp />
                        Rastuća Vrijednost
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                        <ArrowDown />
                        Opadajuća Vrijednost
                    </DropdownMenuItem>
                    {!alwaysShow && <DropdownMenuSeparator />}

                    {!alwaysShow && <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff />
                        Sakrij Kolonu
                    </DropdownMenuItem>}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
