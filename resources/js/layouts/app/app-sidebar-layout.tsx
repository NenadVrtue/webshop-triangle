import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, createContext, useContext } from 'react';
import { useCart } from '@/hooks/useCart';

// Cart context colocated with the layout to avoid creating a new file
type CartContextValue = ReturnType<typeof useCart>;
const CartContext = createContext<CartContextValue | undefined>(undefined);
export function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCartContext must be used within AppSidebarLayout');
    return ctx;
}

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const cartApi = useCart();

    return (
        <CartContext.Provider value={cartApi}>
            <AppShell variant="sidebar">
                <AppSidebar />
                <AppContent variant="sidebar" className="overflow-x-hidden">
                    <AppSidebarHeader
                        breadcrumbs={breadcrumbs}
                        cart={cartApi.cart}
                        itemCount={cartApi.itemCount}
                        totalQuantity={cartApi.totalQuantity}
                        isLoaded={cartApi.isLoaded}
                        updateQuantity={cartApi.updateQuantity}
                        removeFromCart={cartApi.removeFromCart}
                        clearCart={cartApi.clearCart}
                    />
                    {children}
                </AppContent>
            </AppShell>
        </CartContext.Provider>
    );
}
