import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PopoverDialog, PopoverDialogContent, PopoverDialogTrigger } from "@/components/ui/popoverDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export interface MultiSelectOption {
    value: string;
    label: string;
    description?: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    emptyText?: string;
    searchPlaceholder?: string;
    className?: string;
    disabled?: boolean;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select items...",
    emptyText = "No items found.",
    searchPlaceholder = "Search...",
    className,
    disabled = false,
}: MultiSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // Focus search input when popover opens
    React.useEffect(() => {
        if (open && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 0);
        }
    }, [open]);

    const handleToggle = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const handleRemove = (value: string) => {
        onChange(selected.filter((item) => item !== value));
    };

    const handleClearAll = () => {
        onChange([]);
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedLabels = selected
        .map((value) => options.find((opt) => opt.value === value)?.label)
        .filter(Boolean);

    return (
        <PopoverDialog open={open} onOpenChange={setOpen}>
            <PopoverDialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between min-h-10 h-auto",
                        !selected.length && "text-muted-foreground",
                        className
                    )}
                    disabled={disabled}
                >
                    <div className="flex flex-wrap gap-1 flex-1">
                        {selected.length === 0 ? (
                            <span>{placeholder}</span>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {selectedLabels.slice(0, 3).map((label, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="mr-1"
                                    >
                                        {label}
                                        <button
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const value = selected[index];
                                                    if (value) handleRemove(value);
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const value = selected[index];
                                                if (value) handleRemove(value);
                                            }}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </Badge>
                                ))}
                                {selected.length > 3 && (
                                    <Badge variant="secondary" className="mr-1">
                                        +{selected.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverDialogTrigger>
            <PopoverDialogContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
                sideOffset={4}
            >
                <div className="p-2 border-b">
                    <Input
                        ref={searchInputRef}
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9"
                        autoFocus
                    />
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            {emptyText}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filteredOptions.map((option) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        className={cn(
                                            "flex items-center space-x-2 rounded-md px-2 py-2 hover:bg-accent cursor-pointer",
                                            isSelected && "bg-accent"
                                        )}
                                        onClick={() => handleToggle(option.value)}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleToggle(option.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium leading-none">
                                                {option.label}
                                            </div>
                                            {option.description && (
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    {option.description}
                                                </div>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {selected.length > 0 && (
                    <div className="border-t p-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-center text-xs"
                            onClick={handleClearAll}
                        >
                            Clear all ({selected.length})
                        </Button>
                    </div>
                )}
            </PopoverDialogContent>
        </PopoverDialog>
    );
}
