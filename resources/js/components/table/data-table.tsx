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

    // Filter states
    const [selectedBrand, setSelectedBrand] = useState<string>("")
    const [selectedType, setSelectedType] = useState<string>("")
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [selectedWidth, setSelectedWidth] = useState<string>("")
    const [selectedHeight, setSelectedHeight] = useState<string>("")

    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        right: ['actions']
    })
    // Determine if we're using server-side or client-side pagination
    const isServerSide = !!pagination;

    // Extract unique values for filter dropdowns
    const uniqueBrands = React.useMemo(() => {
        const brands = data.map((item: any) => item.brend).filter(Boolean);
        return [...new Set(brands)].sort();
    }, [data]);

    const uniqueTypes = React.useMemo(() => {
        const types = data.map((item: any) => item.tip).filter(Boolean);
        return [...new Set(types)].sort();
    }, [data]);

    const uniqueWidths = React.useMemo(() => {
        const widths = data.map((item: any) => item.sirina).filter(Boolean);
        return [...new Set(widths)].sort();
    }, [data]);

    const uniqueHeights = React.useMemo(() => {
        const heights = data.map((item: any) => item.visina).filter(Boolean);
        return [...new Set(heights)].sort();
    }, [data]);

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

    // Apply all filters manually
    const displayRows = React.useMemo(() => {
        let rows = table.getFilteredRowModel().rows;

        // Apply fuzzy filter if there's a fuzzy search value
        if (fuzzySearchValue && fuzzySearchValue.trim() !== '') {
            rows = rows.filter(row => {
                return fuzzyFilterFn(row, '', fuzzySearchValue, () => { });
            });
        }

        // Apply brand filter
        if (selectedBrand) {
            rows = rows.filter(row => row.original.brend === selectedBrand);
        }

        // Apply type filter
        if (selectedType) {
            rows = rows.filter(row => row.original.tip === selectedType);
        }

        // Apply status filter
        if (selectedStatus) {
            if (selectedStatus === 'active') {
                rows = rows.filter(row => row.original.is_active === true);
            } else if (selectedStatus === 'inactive') {
                rows = rows.filter(row => row.original.is_active === false);
            }
        }

        // Apply width filter
        if (selectedWidth) {
            rows = rows.filter(row => row.original.sirina === selectedWidth);
        }

        // Apply height filter
        if (selectedHeight) {
            rows = rows.filter(row => row.original.visina === selectedHeight);
        }

        return rows;
    }, [table.getFilteredRowModel().rows, fuzzySearchValue, selectedBrand, selectedType, selectedStatus, selectedWidth, selectedHeight]);

    // Clear all filters function
    const clearAllFilters = () => {
        setGlobalFilter("");
        setFuzzySearchValue("");
        setSelectedBrand("");
        setSelectedType("");
        setSelectedStatus("");
        setSelectedWidth("");
        setSelectedHeight("");
    };

    // Count active filters
    const activeFiltersCount = [
        globalFilter,
        fuzzySearchValue,
        selectedBrand,
        selectedType,
        selectedStatus,
        selectedWidth,
        selectedHeight
    ].filter(Boolean).length;

    return (
        <div className="space-y-4">
            {/* Enhanced Dual Search Interface */}
            <div className="bg-card/50 border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Pretraživanje i filtriranje</h3>
                        {activeFiltersCount > 0 && (
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-muted-foreground">
                                    {displayRows.length} rezultata ({activeFiltersCount} filtera)
                                </span>
                            </div>
                        )}
                    </div>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-8 px-2 text-xs"
                        >
                            Obriši sve ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strict Filter Card */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                            <label className="text-sm font-medium text-foreground">
                                Precizno pretraživanje
                            </label>
                            {globalFilter && (
                                <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                                    Aktivno
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Unesite tačan pojam..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(String(event.target.value))}
                                className="pl-9 h-9"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Traži tačno poklapanje. Osjetljivo na velika/mala slova i razmake.
                        </p>
                    </div>

                    {/* Fuzzy Search Card */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            <label className="text-sm font-medium text-foreground">
                                Pametno pretraživanje
                            </label>
                            {fuzzySearchValue && (
                                <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 rounded-full text-xs text-blue-700 dark:text-blue-300">
                                    Aktivno
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Unesite bilo koji pojam..."
                                value={fuzzySearchValue ?? ""}
                                onChange={(event) => setFuzzySearchValue(String(event.target.value))}
                                className="pl-9 h-9 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Tolerantno na greške u kucanju. Traži slične pojmove.
                        </p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-medium">Filteri</h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {/* Brand Filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Brend</label>
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full h-8 px-2 text-xs border rounded-md bg-background"
                            >
                                <option value="">Svi brendovi</option>
                                {uniqueBrands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Tip</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full h-8 px-2 text-xs border rounded-md bg-background"
                            >
                                <option value="">Svi tipovi</option>
                                {uniqueTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full h-8 px-2 text-xs border rounded-md bg-background"
                            >
                                <option value="">Svi statusi</option>
                                <option value="active">Aktivne</option>
                                <option value="inactive">Neaktivne</option>
                            </select>
                        </div>

                        {/* Width Filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Širina</label>
                            <select
                                value={selectedWidth}
                                onChange={(e) => setSelectedWidth(e.target.value)}
                                className="w-full h-8 px-2 text-xs border rounded-md bg-background"
                            >
                                <option value="">Sve širine</option>
                                {uniqueWidths.map(width => (
                                    <option key={width} value={width}>{width}</option>
                                ))}
                            </select>
                        </div>

                        {/* Height Filter */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Visina</label>
                            <select
                                value={selectedHeight}
                                onChange={(e) => setSelectedHeight(e.target.value)}
                                className="w-full h-8 px-2 text-xs border rounded-md bg-background"
                            >
                                <option value="">Sve visine</option>
                                {uniqueHeights.map(height => (
                                    <option key={height} value={height}>{height}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">Aktivni filteri:</span>
                        {globalFilter && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs">
                                <span className="font-medium">Precizno:</span>
                                <span className="text-muted-foreground">"{globalFilter}"</span>
                                <button
                                    onClick={() => setGlobalFilter("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {fuzzySearchValue && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-md text-xs">
                                <span className="font-medium">Pametno:</span>
                                <span className="text-muted-foreground">"{fuzzySearchValue}"</span>
                                <button
                                    onClick={() => setFuzzySearchValue("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {selectedBrand && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md text-xs">
                                <span className="font-medium">Brend:</span>
                                <span className="text-muted-foreground">{selectedBrand}</span>
                                <button
                                    onClick={() => setSelectedBrand("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {selectedType && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md text-xs">
                                <span className="font-medium">Tip:</span>
                                <span className="text-muted-foreground">{selectedType}</span>
                                <button
                                    onClick={() => setSelectedType("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {selectedStatus && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md text-xs">
                                <span className="font-medium">Status:</span>
                                <span className="text-muted-foreground">
                                    {selectedStatus === 'active' ? 'Aktivne' : 'Neaktivne'}
                                </span>
                                <button
                                    onClick={() => setSelectedStatus("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {selectedWidth && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md text-xs">
                                <span className="font-medium">Širina:</span>
                                <span className="text-muted-foreground">{selectedWidth}</span>
                                <button
                                    onClick={() => setSelectedWidth("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                        {selectedHeight && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-md text-xs">
                                <span className="font-medium">Visina:</span>
                                <span className="text-muted-foreground">{selectedHeight}</span>
                                <button
                                    onClick={() => setSelectedHeight("")}
                                    className="ml-1 hover:text-destructive"
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Column Visibility Controls */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Prikazano {displayRows.length} od {data.length} stavki
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Kolone
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