import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, ImageOff, Search, X } from 'lucide-react';

interface Tire {
    id: number;
    sifra: string;
    ime: string;
    dimenzije?: string;
    sirina?: string;
    visina?: string;
    eprel_code?: string;
    image_url?: string;
    vp_cijena?: number;
    mp_cijena?: number;
    kolicina_na_stanju: number;
    sezona?: string;
    kategorija?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedTires {
    data: Tire[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    tires: PaginatedTires;
    kategorije: string[];
    sezone: string[];
    filters: {
        search?: string;
        kategorija?: string;
        sezona?: string;
    };
}

function TireImageDialog({ tire }: { tire: Tire }) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const imageUrl = tire.image_url || `https://www.triangle-gume.com/wp-content/uploads/tires/${tire.sifra}.jpg`;

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="h-10 w-10 p-0 hover:bg-accent">
                {!imageError ? (
                    <img src={imageUrl} alt={tire.ime} className="h-10 w-10 object-cover rounded" onError={() => setImageError(true)} />
                ) : (
                    <ImageOff className="h-5 w-5 text-muted-foreground" />
                )}
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader><DialogTitle>{tire.ime}</DialogTitle></DialogHeader>
                    <div className="flex items-center justify-center p-4">
                        {!imageError ? (
                            <img src={imageUrl} alt={tire.ime} className="max-w-full h-auto max-h-[400px] object-contain rounded-lg" onError={() => setImageError(true)} />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                                <ImageOff className="h-16 w-16 mb-4" />
                                <p className="text-sm">Slika nije dostupna</p>
                                <p className="text-xs mt-2">Šifra: {tire.sifra}</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function AdminTires({ tires, kategorije, sezone, filters = {} }: Props) {
    const [updatingTire, setUpdatingTire] = useState<number | null>(null);
    const [localFilters, setLocalFilters] = useState({
        search: filters.search || '',
        kategorija: filters.kategorija || 'all',
        sezona: filters.sezona || 'all',
    });

    const handleToggleActive = (tireId: number, currentStatus: boolean) => {
        setUpdatingTire(tireId);
        router.patch(`/admin/tires/${tireId}`, { is_active: !currentStatus }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => toast.success(currentStatus ? 'Guma je uspešno deaktivirana' : 'Guma je uspešno aktivirana'),
            onError: () => toast.error('Greška pri ažuriranju statusa gume'),
            onFinish: () => setUpdatingTire(null),
        });
    };

    const applyFilters = () => {
        const params: Record<string, string> = {};
        if (localFilters.search) params.search = localFilters.search;
        if (localFilters.kategorija && localFilters.kategorija !== 'all') params.kategorija = localFilters.kategorija;
        if (localFilters.sezona && localFilters.sezona !== 'all') params.sezona = localFilters.sezona;
        router.get('/admin/tires', params, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setLocalFilters({ search: '', kategorija: 'all', sezona: 'all' });
        router.get('/admin/tires');
    };

    const goToPage = (page: number) => {
        const params: Record<string, string> = { page: String(page) };
        if (localFilters.search) params.search = localFilters.search;
        if (localFilters.kategorija && localFilters.kategorija !== 'all') params.kategorija = localFilters.kategorija;
        if (localFilters.sezona && localFilters.sezona !== 'all') params.sezona = localFilters.sezona;
        router.get('/admin/tires', params, { preserveState: true, preserveScroll: true });
    };

    const hasActiveFilters = localFilters.search || (localFilters.kategorija && localFilters.kategorija !== 'all') || (localFilters.sezona && localFilters.sezona !== 'all');

    return (
        <AppLayout>
            <Head title="Gume — Admin" />

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm">
                        ← Admin
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <h1 className="text-2xl font-bold tracking-tight">Gume</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Upravljanje gumama</CardTitle>
                        <CardDescription>Pregled i upravljanje statusom guma</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex gap-2 flex-1 min-w-[200px]">
                                <Input
                                    placeholder="Pretraži po šifri ili nazivu..."
                                    value={localFilters.search}
                                    onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    className="max-w-sm"
                                />
                            </div>
                            <Select value={localFilters.kategorija} onValueChange={(v) => setLocalFilters(prev => ({ ...prev, kategorija: v }))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Kategorija" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Sve kategorije</SelectItem>
                                    {kategorije.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={localFilters.sezona} onValueChange={(v) => setLocalFilters(prev => ({ ...prev, sezona: v }))}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Sezona" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Sve sezone</SelectItem>
                                    {sezone.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button onClick={applyFilters} className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Pretraži
                            </Button>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                                    <X className="h-4 w-4" />
                                    Resetuj
                                </Button>
                            )}
                        </div>

                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Slika</TableHead>
                                        <TableHead>Šifra</TableHead>
                                        <TableHead>Naziv</TableHead>
                                        <TableHead>Kategorija</TableHead>
                                        <TableHead>Sezona</TableHead>
                                        <TableHead>Širina</TableHead>
                                        <TableHead>Visina</TableHead>
                                        <TableHead>Prečnik</TableHead>
                                        <TableHead>Količina</TableHead>
                                        <TableHead>VP Cijena</TableHead>
                                        <TableHead>MP Cijena</TableHead>
                                        <TableHead>Eprel</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tires.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                                                Nema guma za prikazivanje
                                            </TableCell>
                                        </TableRow>
                                    ) : tires.data.map((tire) => (
                                        <TableRow key={tire.id}>
                                            <TableCell><TireImageDialog tire={tire} /></TableCell>
                                            <TableCell className="font-medium">{tire.sifra}</TableCell>
                                            <TableCell className="max-w-48">
                                                <div className="truncate" title={tire.ime}>{tire.ime}</div>
                                            </TableCell>
                                            <TableCell>{tire.kategorija}</TableCell>
                                            <TableCell>{tire.sezona}</TableCell>
                                            <TableCell>{tire.sirina}</TableCell>
                                            <TableCell>{tire.visina}</TableCell>
                                            <TableCell>{tire.dimenzije}</TableCell>
                                            <TableCell>
                                                <span className={tire.kolicina_na_stanju === 0 ? 'text-red-600 font-medium' : ''}>
                                                    {tire.kolicina_na_stanju}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {tire.vp_cijena ? `${tire.vp_cijena} KM` : <span className="text-muted-foreground text-xs">Nedostupna</span>}
                                            </TableCell>
                                            <TableCell>
                                                {tire.mp_cijena ? `${tire.mp_cijena} KM` : <span className="text-muted-foreground text-xs">Nedostupna</span>}
                                            </TableCell>
                                            <TableCell>
                                                {tire.eprel_code && (
                                                    <a href={tire.eprel_code} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline truncate block max-w-24">
                                                        Link
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={tire.is_active}
                                                        disabled={updatingTire === tire.id}
                                                        onCheckedChange={() => handleToggleActive(tire.id, tire.is_active)}
                                                    />
                                                    <Badge variant={tire.is_active ? 'default' : 'secondary'}>
                                                        {tire.is_active ? 'Aktivna' : 'Neaktivna'}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {tires.from}–{tires.to} od {tires.total} guma
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => goToPage(tires.current_page - 1)} disabled={tires.current_page === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">Strana {tires.current_page} od {tires.last_page}</span>
                                <Button variant="outline" size="sm" onClick={() => goToPage(tires.current_page + 1)} disabled={tires.current_page === tires.last_page}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
