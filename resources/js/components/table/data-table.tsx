"use client"
import { useState, useMemo, useEffect } from "react"
import * as React from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { rankItem } from '@tanstack/match-sorter-utils'
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
} from "@tanstack/react-table"
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

    // Advanced filters toggle
    const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false)

    // Filter states
    const [selectedBrand, setSelectedBrand] = useState<string>("")
    const [selectedType, setSelectedType] = useState<string>("")
    const [selectedStatus, setSelectedStatus] = useState<string>("")
    const [selectedWidth, setSelectedWidth] = useState<string>("")
    const [selectedHeight, setSelectedHeight] = useState<string>("")

    // Compute filteredData from inputs (strict, fuzzy, advanced)
    const filteredData = React.useMemo(() => {
        let out: any[] = [...(data as any[])];

        // Strict (exact-ish) filter across fields
        if (globalFilter?.trim()) {
            const g = globalFilter.trim().toLowerCase();
            out = out.filter((item: any) => {
                const t = [
                    item.sifra,
                    item.naziv,
                    item.tip,
                    item.dimenzije,
                    item.sirina?.toString(),
                    item.visina?.toString(),
                    item.brend,
                    item.dobavljac,
                    item.naziv_dobavljaca,
                    item.precnik?.toString(),
                    item.bar_kod,
                    item.kataloski_brojevi,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return t.includes(g);
            });
        }

        // Fuzzy filter across same fields
        if (fuzzySearchValue?.trim()) {
            const v = fuzzySearchValue.trim();
            out = out.filter((item: any) => {
                const searchableFields = [
                    item.sifra,
                    item.naziv,
                    item.tip,
                    item.dimenzije,
                    item.sirina?.toString(),
                    item.visina?.toString(),
                    item.brend,
                    item.dobavljac,
                    item.naziv_dobavljaca,
                    item.precnik?.toString(),
                    item.bar_kod,
                    item.kataloski_brojevi,
                ]
                    .filter(Boolean)
                    .join(' ');
                return rankItem(searchableFields, v).passed;
            });
        }

        // Advanced filters (only when toggled)
        if (showAdvancedFilters) {
            if (selectedBrand) out = out.filter((x: any) => (x.brend ?? '').toString() === selectedBrand);
            if (selectedType) out = out.filter((x: any) => (x.tip ?? '').toString() === selectedType);
            if (selectedStatus) {
                if (selectedStatus === 'active') out = out.filter((x: any) => (x.is_active === true) || (x.is_active === 1) || (x.is_active === '1'));
                if (selectedStatus === 'inactive') out = out.filter((x: any) => (x.is_active === false) || (x.is_active === 0) || (x.is_active === '0') || (x.is_active == null));
            }
            if (selectedWidth) out = out.filter((x: any) => (x.sirina ?? '').toString() === selectedWidth);
            if (selectedHeight) out = out.filter((x: any) => (x.visina ?? '').toString() === selectedHeight);
        }

        return out as TData[];
    }, [
        data,
        globalFilter,
        fuzzySearchValue,
        showAdvancedFilters,
        selectedBrand,
        selectedType,
        selectedStatus,
        selectedWidth,
        selectedHeight,
    ]);

    // Force default client-side pagination so filtering + fuzzy search paginate correctly
    const isServerSide = false;

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

    // Get available heights for each width
    const widthHeightsMap = React.useMemo(() => {
        const map = new Map<string, Set<string>>();

        (data as any[]).forEach(item => {
            if (item.sirina && item.visina) {
                const width = item.sirina.toString();
                const height = item.visina.toString();

                if (!map.has(width)) {
                    map.set(width, new Set());
                }
                map.get(width)?.add(height);
            }
        });

        return map;
    }, [data]);

    // Get available heights based on selected width
    const availableHeights = React.useMemo(() => {
        if (!selectedWidth) return [];
        const heights = widthHeightsMap.get(selectedWidth) || new Set();
        return Array.from(heights).sort((a, b) => parseFloat(a) - parseFloat(b));
    }, [selectedWidth, widthHeightsMap]);

    // Reset height if current selection is not available with selected width
    React.useEffect(() => {
        if (selectedWidth && selectedHeight && !availableHeights.includes(selectedHeight)) {
            setSelectedHeight("");
        }
    }, [selectedWidth, selectedHeight, availableHeights]);

    // Get count of available heights for each width
    const getAvailableHeightsCount = (width: string) => {
        return widthHeightsMap.get(width)?.size || 0;
    };

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnPinningChange: setColumnPinning,

        // Client-side pagination configuration
        manualPagination: false,
        state: {
            sorting,
            columnVisibility,
            columnPinning,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

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
        ...(showAdvancedFilters ? [selectedBrand, selectedType, selectedStatus, selectedWidth, selectedHeight] : [])
    ].filter(Boolean).length;

    // Reset to first page whenever any filter changes to avoid empty pages
    React.useEffect(() => {
        table.setPageIndex(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalFilter, fuzzySearchValue, showAdvancedFilters, selectedBrand, selectedType, selectedStatus, selectedWidth, selectedHeight]);

    return (
        <div className="space-y-4">
            {/* Simplified Search Interface */}
            <div className="bg-card/50 border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Pretraživanje</h3>
                        {activeFiltersCount > 0 && (
                            <div className="flex items-center gap-1">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-muted-foreground">
                                    {filteredData.length} rezultata
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="h-8 px-3 text-xs"
                        >
                            Napredna pretraga
                            <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                        </Button>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strict Filter Card */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="strict-filter" className="text-xs font-medium text-muted-foreground">
                                Filtriranje
                            </Label>
                            {globalFilter && (
                                <div className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    Aktivno
                                </div>
                            )}
                        </div>
                        <Input
                            id="strict-filter"
                            placeholder="Pretraži po svim poljima..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>

                    {/* Fuzzy Search Card */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="fuzzy-search" className="text-xs font-medium text-muted-foreground">
                                Napredna pretraga
                            </Label>
                            {fuzzySearchValue && (
                                <div className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                    Fuzzy
                                </div>
                            )}
                        </div>
                        <Input
                            id="fuzzy-search"
                            placeholder="Tolerantna na greške u kucanju..."
                            value={fuzzySearchValue}
                            onChange={(e) => setFuzzySearchValue(e.target.value)}
                            className="h-8 text-xs"
                        />
                    </div>
                </div>

                {/* Collapsible Advanced Filters Section */}
                {showAdvancedFilters && (
                    <div className="space-y-3 pt-2 border-t animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <h4 className="text-sm font-medium">Napredni filteri</h4>
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
                            <div className="space-y-1 relative">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Širina
                                </label>
                                <select
                                    value={selectedWidth}
                                    onChange={(e) => setSelectedWidth(e.target.value)}
                                    className="w-full h-8 px-2 text-xs border rounded-md bg-background appearance-none"
                                >
                                    <option value="">Sve širine</option>
                                    {uniqueWidths.map(width => (
                                        <option
                                            key={width}
                                            value={width}
                                        >
                                            {width} {getAvailableHeightsCount(width) > 0 && `(${getAvailableHeightsCount(width)} visina)`}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-7 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            </div>

                            {/* Height Filter */}
                            <div className="space-y-1 relative">
                                <label className="text-xs font-medium text-muted-foreground">
                                    Visina
                                    {selectedWidth && (
                                        <span className="ml-1 text-xs text-muted-foreground/70">
                                            ({availableHeights.length} dostupno)
                                        </span>
                                    )}
                                </label>
                                <select
                                    value={selectedHeight}
                                    onChange={(e) => setSelectedHeight(e.target.value)}
                                    className="w-full h-8 px-2 text-xs border rounded-md bg-background appearance-none"
                                    disabled={!selectedWidth}
                                >
                                    <option value="">
                                        {selectedWidth ? 'Sve dostupne visine' : 'Prvo izaberite širinu'}
                                    </option>
                                    {uniqueHeights.map(height => {
                                        const isAvailable = !selectedWidth || availableHeights.includes(height);
                                        return (
                                            <option
                                                key={height}
                                                value={height}
                                                disabled={!isAvailable}
                                                className={!isAvailable ? 'text-muted-foreground/50 bg-muted/30' : ''}
                                                title={!isAvailable ? 'Ova visina nije dostupna za odabranu širinu' : ''}
                                            >
                                                {height}
                                                {!isAvailable && ' (nema na stanju)'}
                                            </option>
                                        );
                                    })}
                                </select>
                                <ChevronDown className="absolute right-2 top-7 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">Aktivni filteri:</span>
                        {globalFilter && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
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
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs">
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
                        {showAdvancedFilters && selectedBrand && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs">
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
                        {showAdvancedFilters && selectedType && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs">
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
                        {showAdvancedFilters && selectedStatus && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs">
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
                        {showAdvancedFilters && selectedWidth && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs">
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
                        {showAdvancedFilters && selectedHeight && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full text-xs">
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
                    Prikazano {table.getRowModel().rows.length} od {filteredData.length} rezultata (ukupno {data.length} stavki)
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
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
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
                                    .map((header) => (
                                        <TableHead key={header.id} >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}

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
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
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