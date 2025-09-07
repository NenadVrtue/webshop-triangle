import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    full_name?: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Tire {
    id: number;
    sifra: string;
    ime: string;
    dimenzije?: string;
    sirina?: string;
    visina?: string;
    eprel_code?: string;
    veleprodajna_cijena?: number;
    maloprodajna_cijena?: number;
    nabavna_cijena?: number;
    kolicina_na_stanju: number;
    sezona?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: string;
    tire: Tire;
    quantity: number;
    addedAt: Date;
}

export interface AuthProps {
    auth: Auth;
}

// Extend TanStack React Table types
declare module '@tanstack/react-table' {
    interface ColumnMeta<TData, TValue> {
        sticky?: 'left' | 'right';
        className?: string;
    }
}
