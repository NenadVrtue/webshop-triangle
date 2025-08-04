import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Tire } from '@/types';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/data-table';
import { createColumns } from '@/components/table/columns';
import { useCart } from '@/hooks/useCart';
import { CartSheet } from '@/components/cart/cart-sheet';
import { ShoppingCart } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

function logout() {
    router.post('/logout')
}

interface DashboardProps {
    tires?: {
        data: Tire[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

export default function Dashboard({ tires: initialTires }: DashboardProps) {
    console.log("Dashboard komponenta se renderuje!");
    const [tires, setTires] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize cart hook
    const { addToCart, itemCount, isInCart, isLoaded, cart, totalQuantity, updateQuantity, removeFromCart, clearCart } = useCart();

    // Debug cart state
    useEffect(() => {
        console.log('Dashboard: Cart itemCount changed:', itemCount);
    }, [itemCount]);

    useEffect(() => {
        console.log('Dashboard: Cart loaded:', isLoaded);
    }, [isLoaded]);

    // Load all tire data for client-side filtering and pagination
    useEffect(() => {
        const fetchAllTires = async () => {
            setLoading(true);
            try {
                // Fetch all tires without pagination (or with a very high per_page limit)
                const response = await fetch('/api/tires?per_page=1000', {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tires');
                }

                const data = await response.json();
                setTires(data.data || []);
            } catch (error) {
                console.error('Error fetching tires:', error);
                // Fallback to initial data if API fails
                setTires(initialTires?.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetchAllTires();
    }, [initialTires]);

    // Handle adding tire to cart
    const handleAddToCart = (tire: Tire) => {
        if (!tire.is_active) {
            alert('Ova guma nije aktivna i ne može biti dodana u korpu.');
            return;
        }

        console.log('Dashboard: Adding tire to cart:', tire);
        addToCart(tire, 1);
        alert(`${tire.naziv} je dodana u korpu!`);
    };

    // Create columns with cart functionality
    const tableColumns = createColumns(handleAddToCart);

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg">Učitavam gume...</div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                {/* Cart Info */}
                <CartSheet
                    cart={cart}
                    itemCount={itemCount}
                    totalQuantity={totalQuantity}
                    isLoaded={isLoaded}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    clearCart={clearCart}
                >
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-blue-800">
                                Korpa ({itemCount} tipova)
                            </h3>
                        </div>
                        <p className="text-sm text-blue-600 mt-1">
                            Kliknite da vidite sadržaj korpe
                        </p>
                    </div>
                </CartSheet>

                {/* Data Table with client-side filtering and pagination */}
                <DataTable
                    columns={tableColumns}
                    data={tires}
                // Remove pagination prop to enable client-side pagination
                />

            </div>
        </AppLayout>
    );
}
