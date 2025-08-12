import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { CartSheet } from '@/components/cart/cart-sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import type { CartItem } from '@/types';

interface HeaderProps {
    breadcrumbs?: BreadcrumbItemType[];
    cart?: CartItem[];
    itemCount?: number;
    totalQuantity?: number;
    isLoaded?: boolean;
    updateQuantity?: (itemId: string, quantity: number) => void;
    removeFromCart?: (itemId: string) => void;
    clearCart?: () => void;
}

export function AppSidebarHeader({ breadcrumbs = [], cart, itemCount, totalQuantity, isLoaded, updateQuantity, removeFromCart, clearCart }: HeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-2">
                <CartSheet
                    cart={cart}
                    itemCount={itemCount}
                    totalQuantity={totalQuantity}
                    isLoaded={isLoaded}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                >
                    <Button variant="cart" size="lg" className="relative">
                        <ShoppingCart className="h-4 w-4" />
                        Korpa
                        {typeof itemCount === 'number' && (
                            <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground  dark:text-foreground">
                                {itemCount}
                            </span>
                        )}
                    </Button>
                </CartSheet>
            </div>
        </header>
    );
}
