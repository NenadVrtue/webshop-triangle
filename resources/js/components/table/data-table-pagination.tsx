import { Table } from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
    table: Table<TData>
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    console.log(table.getState())

    // Safety check for pagination state
    const paginationState = table.getState().pagination;
    if (!paginationState) {
        return null; // Don't render if pagination state is not available
    }

    const { pageSize, pageIndex } = paginationState;

    return (
        <div className="flex  justify-between px-2">
            <div className="flex w-full flex-col gap-4 lg:flex-row items-end lg:items-center  lg:space-x-8">
                <div className="flex   items-center gap-2">
                    <p className="text-sm font-medium">Redova po stranici</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 25, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 items-center ">
                    <div className="flex  w-full lg:w-[110px] items-center justify-center text-sm font-medium">
                        Stranica {pageIndex + 1} od{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="flex gap-2 lg:gap-0 items-center lg:space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Idi na prvu stranicu</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Idi na prethodnu stranicu</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Idi na sledeću stranicu</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Idi na zadnju stranicu</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
