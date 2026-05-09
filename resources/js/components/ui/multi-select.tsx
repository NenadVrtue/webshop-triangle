import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
        if (open) {
            setTimeout(() => searchInputRef.current?.focus(), 0);
        } else {
            setSearchQuery("");
        }
    }, [open]);

    const handleToggle = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value];
        onChange(newSelected);
    };

    const handleRemove = (value: string, e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(selected.filter((item) => item !== value));
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedLabels = selected
        .map((value) => options.find((opt) => opt.value === value)?.label)
        .filter(Boolean) as string[];

    return (
        <div ref={containerRef} className="relative">
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
                onClick={() => setOpen((prev) => !prev)}
            >
                <div className="flex flex-wrap gap-1 flex-1 text-left">
                    {selected.length === 0 ? (
                        <span>{placeholder}</span>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {selectedLabels.slice(0, 3).map((label, index) => (
                                <Badge key={selected[index]} variant="secondary" className="mr-1">
                                    {label}
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        className="ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-ring"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => handleRemove(selected[index], e)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") handleRemove(selected[index], e);
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </span>
                                </Badge>
                            ))}
                            {selected.length > 3 && (
                                <Badge variant="secondary">+{selected.length - 3} više</Badge>
                            )}
                        </div>
                    )}
                </div>
                <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>

            {open && (
                <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
                    <div className="p-2 border-b">
                        <Input
                            ref={searchInputRef}
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
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
                                            <div className={cn(
                                                "h-4 w-4 shrink-0 border rounded-sm flex items-center justify-center",
                                                isSelected ? "bg-primary border-primary" : "border-input"
                                            )}>
                                                {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium leading-none">{option.label}</div>
                                                {option.description && (
                                                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                                                )}
                                            </div>
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
                                onClick={() => onChange([])}
                            >
                                Obriši sve ({selected.length})
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
