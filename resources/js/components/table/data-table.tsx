"use client"
import { useState, useMemo } from "react"
import * as React from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    PaginationState,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    OnChangeFn,
    ColumnPinningState,
    getFilteredRowModel,
    FilterFn,
} from "@tanstack/react-table"
import { rankItem } from '@tanstack/match-sorter-utils'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { Label } from "../ui/label"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    pagination?: {
        pageIndex: number
        pageSize: number
        pageCount: number
    }
    onPageChange?: OnChangeFn<PaginationState>
}

// Official TanStack fuzzy filter implementation
const fuzzyFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
    // If no search value, show all rows
    if (!value || value.trim() === '') return true;

    // Get all searchable values from the row for global search
    const searchableFields = [
        row.original.sifra,
        row.original.naziv,
        row.original.tip,
        row.original.dimenzije,
        row.original.sirina?.toString(),
        row.original.visina?.toString(),
        row.original.brend,
        row.original.dobavljac,
        row.original.naziv_dobavljaca,
        row.original.precnik?.toString(),
        row.original.bar_kod,
        row.original.kataloski_brojevi,
    ].filter(Boolean).join(' '); // Combine all fields into one searchable string

    // Rank the item using TanStack's match-sorter-utils
    const itemRank = rankItem(searchableFields, value);

    // Store the itemRank info for potential sorting
    addMeta({ itemRank });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

export function DataTable<TData, TValue>({
    columns,
    data,
    pagination,
    onPageChange,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        "tip": false,
        "dimenzije": false,
        "visina": false,
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<string>("")
    const [fuzzySearchValue, setFuzzySearchValue] = useState<string>("")
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        right: ['actions']
    })
    // Determine if we're using server-side or client-side pagination
    const isServerSide = !!pagination;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,

        // Configure filter functions
        filterFns: {
            fuzzy: fuzzyFilterFn,
        },
        // Use default global filter (strict matching)
        globalFilterFn: 'auto',

        // Server-side pagination configuration
        ...(isServerSide && {
            manualPagination: true,
            pageCount: pagination.pageCount,
            onPaginationChange: onPageChange,
            state: {
                sorting,
                columnVisibility,
                globalFilter,
                pagination: {
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                }
            },
        }),

        // Client-side pagination configuration
        ...(!isServerSide && {
            manualPagination: false,
            state: {
                sorting,
                columnVisibility,
                globalFilter,
                columnPinning,
            },
            initialState: {
                pagination: {
                    pageSize: 10,
                },
            },
        }),
    })

    // Apply fuzzy filter manually if fuzzy search has value
    const displayRows = useMemo(() => {
        let rows = table.getFilteredRowModel().rows;

        // Apply fuzzy filter if there's a fuzzy search value
        if (fuzzySearchValue && fuzzySearchValue.trim() !== '') {
            rows = rows.filter(row => {
                return fuzzyFilterFn(row, '', fuzzySearchValue, () => { });
            });
        }

        return rows;
    }, [table.getFilteredRowModel().rows, fuzzySearchValue]);

    return (
        <div className="space-y-4">
            {/* Dual Search Inputs */}
            <div className="flex pt-4 flex-row gap-4 justify-between">
                <div className="flex mb-6 items-center gap-4 flex-1">
                    {/* Default Strict Filter */}

                    <div className="flex-1  max-w-sm">

                        <div className="relative">

                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Filtriranje..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(String(event.target.value))}
                                className="pl-8"
                            />

                            <div className="text-xs absolute -bottom-6 text-muted-foreground mt-1">
                                Striktno pretraživanje. Osjetljivo na razmake, velika i mala slova, itd
                            </div>

                        </div>
                    </div>


                    {/* Fuzzy Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Napredna pretraga..."
                            value={fuzzySearchValue ?? ""}
                            onChange={(event) => setFuzzySearchValue(String(event.target.value))}
                            className="pl-8 border-blue-200 focus:border-blue-400"
                        />
                        {fuzzySearchValue && (
                            <div className="text-xs absolute -bottom-6 text-muted-foreground mt-1">
                                Manje osjetljivo, ali i manje tačno pretraživanje.
                            </div>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Dodatne Kolone <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table className="relative">
                    <TableHeader className="bg-background-alt">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {/* Left pinned headers */}
                                {headerGroup.headers
                                    .filter((header) => header.column.getIsPinned() === 'left')
                                    .map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="sticky left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r z-10"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}

                                {/* Center (unpinned) headers */}
                                {headerGroup.headers
                                    .filter((header) => !header.column.getIsPinned())
                                    .map((header) => {

                                        return (
                                            <TableHead key={header.id} >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}

                                {/* Right pinned headers */}
                                {headerGroup.headers
                                    .filter((header) => header.column.getIsPinned() === 'right')
                                    .map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="sticky  right-0 lg:flex lg:justify-center items-center bg-background lg:bg-none supports-[backdrop-filter]:bg-background-alt/95 lg:supports-[backdrop-filter]:bg-background-alt border-l lg:border-l-0 "
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {displayRows?.length ? (
                            displayRows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {/* Left pinned cells */}
                                    {row.getLeftVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="sticky left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r z-10"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}

                                    {/* Center (unpinned) cells */}
                                    {row.getCenterVisibleCells().map((cell) => {
                                        const metaClassName = cell.column.columnDef.meta?.className || '';
                                        return (
                                            <TableCell key={cell.id} className={metaClassName}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    })}

                                    {/* Right pinned cells */}
                                    {row.getRightVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="sticky  right-0 lg:flex lg:justify-center items-center bg-background/95 lg:bg-none backdrop-blur lg:backdrop-blur-none supports-[backdrop-filter]:bg-background/60 lg:supports-[backdrop-filter]:background-transparent border-l lg:border-l-0 z-10"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Nema rezultata.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            </div>
            <DataTablePagination table={table} />
        </div>
    )
}