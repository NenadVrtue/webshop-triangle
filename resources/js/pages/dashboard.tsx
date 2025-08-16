import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Tire } from '@/types';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import { useState, useEffect } from 'react';
import { DataTable } from '@/components/table/data-table';
import { createColumns } from '@/components/table/columns';
import { useCartContext } from '@/layouts/app/app-sidebar-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Početna',
        href: '/pocetna',
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

// Child component rendered INSIDE AppLayout to safely use context
function DashboardContent({ tires }: { tires: Tire[] }) {
    const { addToCart } = useCartContext();

    const handleAddToCart = (tire: Tire) => {
        if (!tire.is_active) {
            alert('Ova guma nije aktivna i ne može biti dodana u korpu.');
            return;
        }
        console.log('Dashboard: Adding tire to cart:', tire);
        addToCart(tire, 1);

    };

    const tableColumns = createColumns(handleAddToCart);

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
            {/* Data Table with client-side filtering and pagination */}
            <DataTable
                columns={tableColumns}
                data={tires}
            />
        </div>
    );
}

export default function Dashboard({ tires: initialTires }: DashboardProps) {
    console.log("Dashboard komponenta se renderuje!");
    const [tires, setTires] = useState<Tire[]>([]);
    const [loading, setLoading] = useState(false);

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

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Početna" />
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
            <Head title="Početna" />
            <DashboardContent tires={tires} />
        </AppLayout>
    );
}
