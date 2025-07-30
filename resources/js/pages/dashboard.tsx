import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
import { useState, useEffect } from 'react';

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
    is_active: boolean;
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

    // Function to fetch tires using fetch API
    const fetchTires = async (search = '') => {
        setLoading(true);
        try {
            const url = search
                ? `/api/tires?sifra=${encodeURIComponent(search)}`
                : '/api/tires';

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
        } catch (error) {
            console.error('Error fetching tires:', error);
        } finally {
            setLoading(false);
        }
    };

    // Search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTires(searchTerm);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <button onClick={logout} className="text-red-500">Odjavi se</button>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">


                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pretraži gume po šifri..."
                        className="px-3 py-2 border rounded-md flex-1"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Pretraživanje...' : 'Pretraži'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm('');
                            fetchTires();
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Resetuj
                    </button>
                </form>

                {/* Tires List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-4 py-3 border-b">
                        <h3 className="text-lg font-semibold">Gume ({tires.length})</h3>
                    </div>
                    <div className="divide-y">
                        {loading ? (
                            <div className="p-4 text-center">Učitavanje...</div>
                        ) : tires.length > 0 ? (
                            tires.map((tire) => (
                                <div key={tire.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium">{tire.naziv}</h4>
                                            <p className="text-sm text-gray-600">Šifra: {tire.sifra}</p>
                                        </div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded-full ${tire.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {tire.is_active ? 'Aktivna' : 'Neaktivna'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                Nema pronađenih guma
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </AppLayout>
    );
}
