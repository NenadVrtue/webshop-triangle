import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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

interface Tire {
    id: number;
    sifra: string;
    naziv: string;
    tip: string;
    is_active: boolean;
    quantity: number;
    dimenzije: string;
    sirina: string;
    visina: string;
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
    const [tires, setTires] = useState(initialTires?.data || []);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [pagination, setPagination] = useState({
        pageIndex: (initialTires?.meta?.current_page || 1) - 1, // Convert to 0-based index
        pageSize: initialTires?.meta?.per_page || 10,
    });
    const [pageCount, setPageCount] = useState(
        initialTires?.meta?.last_page || 1
    );

    // Initialize cart hook
    const { addToCart, itemCount, isInCart, isLoaded, cart, totalQuantity, updateQuantity, removeFromCart, clearCart } = useCart();

    // Debug cart state
    useEffect(() => {
        console.log('Dashboard: Cart itemCount changed:', itemCount);
    }, [itemCount]);

    useEffect(() => {
        console.log('Dashboard: Cart loaded:', isLoaded);
    }, [isLoaded]);

    // Function to fetch tires using fetch API with pagination
    const fetchTires = async (search = '', page = 1, perPage = 10) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: perPage.toString(),
            });

            if (search) {
                params.append('sifra', search);
            }

            const url = `/api/tires?${params.toString()}`;

            const response = await fetch(url, {
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
            setPageCount(data.meta?.last_page || 1);

            // Update pagination state to match server response
            setPagination({
                pageIndex: (data.meta?.current_page || 1) - 1,
                pageSize: data.meta?.per_page || 10,
            });

        } catch (error) {
            console.error('Error fetching tires:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination changes
    const handlePaginationChange = (updaterOrValue: ((prevState: { pageIndex: number; pageSize: number; }) => { pageIndex: number; pageSize: number; }) | { pageIndex: number; pageSize: number; }) => {
        const newPagination = typeof updaterOrValue === 'function'
            ? updaterOrValue(pagination)
            : updaterOrValue;

        setPagination(newPagination);

        // Fetch new data when pagination changes
        fetchTires(
            searchTerm,
            newPagination.pageIndex + 1, // Convert back to 1-based for API
            newPagination.pageSize
        );
    };

    // Search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Reset to first page when searching
        const newPagination = { ...pagination, pageIndex: 0 };
        setPagination(newPagination);
        fetchTires(searchTerm, 1, pagination.pageSize);
    };

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


                <DataTable
                    columns={tableColumns}
                    data={tires}
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        pageCount: pageCount,
                    }}
                    onPageChange={handlePaginationChange}
                />

            </div>
        </AppLayout>
    );
}
