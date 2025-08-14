"use client"
import { useState } from "react"
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

    return (
        <div className="space-y-4">
            {/* Global Search Input */}


            <div className="flex pt-4 flex-row gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Pretraga..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(String(event.target.value))}
                            className="pl-8"
                        />
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
                        {table.getRowModel().rows?.length ? (
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