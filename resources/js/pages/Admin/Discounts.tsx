import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MultiSelect } from '@/components/ui/multi-select';
import { toast } from 'sonner';
import { Percent, Tag, Edit, Trash2, Plus, Users } from 'lucide-react';

interface Discount {
    id: number;
    scope: 'app_wide' | 'per_user';
    user_id: number | null;
    user: { id: number; full_name: string; company_name?: string } | null;
    tire_kategorija: string;
    percentage: number;
    created_at: string;
}

interface PromoCode {
    id: number;
    code: string;
    discount: number;
    expires_at: string | null;
    is_expired: boolean;
    usage_count: number;
    created_at: string;
}

interface UserOption {
    id: number;
    full_name: string;
    company_name?: string;
}

interface Props {
    discounts: Discount[];
    promoCodes: PromoCode[];
    users: UserOption[];
    kategorije: string[];
}

interface DiscountFormData {
    scope: 'app_wide' | 'per_user';
    user_ids: string[];
    tire_kategorije: string[];
    percentage: string;
}

interface PromoCodeFormData {
    code: string;
    discount: string;
    expires_at: string;
}

export default function AdminDiscounts({ discounts, promoCodes, users, kategorije }: Props) {
    // Discount state
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
    const [showDeleteDiscountDialog, setShowDeleteDiscountDialog] = useState(false);
    const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);
    const [isCreatingDiscounts, setIsCreatingDiscounts] = useState(false);
    const [discountCreationProgress, setDiscountCreationProgress] = useState({ current: 0, total: 0 });
    const [discountFormData, setDiscountFormData] = useState<DiscountFormData>({
        scope: 'per_user', user_ids: [], tire_kategorije: [], percentage: '',
    });

    // PromoCode state
    const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
    const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
    const [promoCodeFormData, setPromoCodeFormData] = useState<PromoCodeFormData>({
        code: '', discount: '', expires_at: '',
    });

    // Discount handlers
    const openCreateDiscountModal = () => {
        setEditingDiscount(null);
        setDiscountFormData({ scope: 'per_user', user_ids: [], tire_kategorije: [], percentage: '' });
        setShowDiscountModal(true);
    };

    const handleEditDiscount = (discount: Discount) => {
        setEditingDiscount(discount);
        setDiscountFormData({
            scope: discount.scope,
            user_ids: discount.user_id ? [discount.user_id.toString()] : [],
            tire_kategorije: [discount.tire_kategorija],
            percentage: discount.percentage.toString(),
        });
        setShowDiscountModal(true);
    };

    const handleDeleteDiscount = (discount: Discount) => { setDiscountToDelete(discount); setShowDeleteDiscountDialog(true); };

    const confirmDeleteDiscount = () => {
        if (!discountToDelete) return;
        router.delete(`/discounts/${discountToDelete.id}`, {
            onSuccess: () => { toast.success('Popust je uspešno obrisan'); setShowDeleteDiscountDialog(false); setDiscountToDelete(null); },
            onError: () => toast.error('Greška pri brisanju popusta'),
        });
    };

    const handleDiscountFormChange = (field: keyof DiscountFormData, value: string | string[]) => {
        setDiscountFormData(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'scope' && value === 'app_wide') updated.user_ids = [];
            return updated;
        });
    };

    const handleDiscountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingDiscount) {
            const submitData = {
                scope: discountFormData.scope,
                user_id: discountFormData.scope === 'per_user' && discountFormData.user_ids.length > 0 ? parseInt(discountFormData.user_ids[0]) : null,
                tire_kategorija: discountFormData.tire_kategorije[0] || '',
                percentage: parseFloat(discountFormData.percentage),
            };
            router.patch(`/discounts/${editingDiscount.id}`, submitData, {
                onSuccess: () => { toast.success('Popust je uspešno ažuriran'); setShowDiscountModal(false); },
                onError: (errors) => Object.values(errors).flat().forEach(m => toast.error(String(m))),
            });
            return;
        }

        // Bulk create combinations
        const combinations: Array<{ user_id: number | null; tire_kategorija: string }> = [];
        if (discountFormData.scope === 'per_user') {
            discountFormData.user_ids.forEach(userId => {
                discountFormData.tire_kategorije.forEach(kategorija => {
                    combinations.push({ user_id: parseInt(userId), tire_kategorija: kategorija });
                });
            });
        } else {
            discountFormData.tire_kategorije.forEach(kategorija => {
                combinations.push({ user_id: null, tire_kategorija: kategorija });
            });
        }

        setIsCreatingDiscounts(true);
        setDiscountCreationProgress({ current: 0, total: combinations.length });
        let successCount = 0;

        for (let i = 0; i < combinations.length; i++) {
            await new Promise<void>((resolve) => {
                router.post('/discounts', {
                    scope: discountFormData.scope,
                    user_id: combinations[i].user_id,
                    tire_kategorija: combinations[i].tire_kategorija,
                    percentage: parseFloat(discountFormData.percentage),
                }, {
                    onSuccess: () => { successCount++; setDiscountCreationProgress({ current: i + 1, total: combinations.length }); resolve(); },
                    onError: () => resolve(),
                    preserveState: true,
                    preserveScroll: true,
                });
            });
        }

        setIsCreatingDiscounts(false);
        setShowDiscountModal(false);
        if (successCount > 0) toast.success(`Uspešno kreirano ${successCount} popusta`);
        else toast.error('Greška pri kreiranju popusta');
    };

    // PromoCode handlers
    const openCreatePromoCodeModal = () => {
        setEditingPromoCode(null);
        setPromoCodeFormData({ code: '', discount: '', expires_at: '' });
        setShowPromoCodeModal(true);
    };

    const handleEditPromoCode = (promoCode: PromoCode) => {
        setEditingPromoCode(promoCode);
        setPromoCodeFormData({ code: promoCode.code, discount: promoCode.discount.toString(), expires_at: promoCode.expires_at || '' });
        setShowPromoCodeModal(true);
    };

    const handleDeletePromoCode = (promoCode: PromoCode) => {
        if (confirm(`Da li ste sigurni da želite da obrišete promo kod ${promoCode.code}?`)) {
            router.delete(`/promocodes/${promoCode.id}`, {
                onSuccess: () => toast.success('Promo kod je uspešno obrisan'),
                onError: () => toast.error('Greška pri brisanju promo koda'),
            });
        }
    };

    const handlePromoCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = { ...promoCodeFormData, discount: parseFloat(promoCodeFormData.discount) };

        if (editingPromoCode) {
            router.patch(`/promocodes/${editingPromoCode.id}`, submitData, {
                onSuccess: () => { toast.success('Promo kod je uspešno ažuriran'); setShowPromoCodeModal(false); },
                onError: (errors) => Object.values(errors).flat().forEach(m => toast.error(String(m))),
            });
        } else {
            router.post('/promocodes', submitData, {
                onSuccess: () => { toast.success('Promo kod je uspešno kreiran'); setShowPromoCodeModal(false); },
                onError: (errors) => Object.values(errors).flat().forEach(m => toast.error(String(m))),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Popusti — Admin" />

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm">
                        ← Admin
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <h1 className="text-2xl font-bold tracking-tight">Popusti i promo kodovi</h1>
                </div>

                {/* Discounts */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Percent className="h-5 w-5" />
                                    Popusti
                                </CardTitle>
                                <CardDescription>Upravljanje popustima po kategorijama guma</CardDescription>
                            </div>
                            <Button onClick={openCreateDiscountModal} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Dodaj popust
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tip</TableHead>
                                        <TableHead>Korisnik</TableHead>
                                        <TableHead>Kategorija</TableHead>
                                        <TableHead>Procenat</TableHead>
                                        <TableHead>Akcije</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {discounts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nema popusta</TableCell>
                                        </TableRow>
                                    ) : discounts.map((discount) => (
                                        <TableRow key={discount.id}>
                                            <TableCell>
                                                <Badge variant={discount.scope === 'app_wide' ? 'default' : 'secondary'}>
                                                    {discount.scope === 'app_wide' ? 'Globalni' : 'Po korisniku'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {discount.user ? (
                                                    <div>
                                                        <div className="font-medium">{discount.user.full_name}</div>
                                                        {discount.user.company_name && <div className="text-sm text-muted-foreground">{discount.user.company_name}</div>}
                                                    </div>
                                                ) : <span className="text-muted-foreground">Svi korisnici</span>}
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{discount.tire_kategorija}</Badge></TableCell>
                                            <TableCell><span className="font-semibold text-green-600">{discount.percentage}%</span></TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEditDiscount(discount)}><Edit className="w-4 h-4" /></Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteDiscount(discount)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Promo Codes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Promo kodovi
                                </CardTitle>
                                <CardDescription>Upravljanje promo kodovima</CardDescription>
                            </div>
                            <Button onClick={openCreatePromoCodeModal} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Dodaj promo kod
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kod</TableHead>
                                        <TableHead>Popust</TableHead>
                                        <TableHead>Ističe</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Upotreba</TableHead>
                                        <TableHead>Kreiran</TableHead>
                                        <TableHead>Akcije</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {promoCodes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nema promo kodova</TableCell>
                                        </TableRow>
                                    ) : promoCodes.map((promoCode) => (
                                        <TableRow key={promoCode.id}>
                                            <TableCell className="font-mono font-semibold">{promoCode.code}</TableCell>
                                            <TableCell>{promoCode.discount}</TableCell>
                                            <TableCell>{promoCode.expires_at || 'Bez isteka'}</TableCell>
                                            <TableCell>
                                                <Badge variant={promoCode.is_expired ? 'destructive' : 'default'}>
                                                    {promoCode.is_expired ? 'Istekao' : 'Aktivan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {promoCode.usage_count}
                                                </div>
                                            </TableCell>
                                            <TableCell>{promoCode.created_at}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEditPromoCode(promoCode)}><Edit className="w-4 h-4" /></Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeletePromoCode(promoCode)}><Trash2 className="w-4 h-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Discount Modal */}
            <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingDiscount ? 'Uredi popust' : 'Dodaj novi popust'}</DialogTitle>
                        <DialogDescription>{editingDiscount ? 'Ažuriraj informacije o popustu' : 'Unesite informacije za novi popust'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleDiscountSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Tip popusta *</Label>
                            <Select value={discountFormData.scope} onValueChange={(v) => handleDiscountFormChange('scope', v)} disabled={editingDiscount !== null}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="app_wide">Globalni (svi korisnici)</SelectItem>
                                    <SelectItem value="per_user">Po korisniku</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {discountFormData.scope === 'per_user' && (
                            <div className="space-y-2">
                                <Label>Korisnici *{!editingDiscount && discountFormData.user_ids.length > 0 && <span className="text-xs text-muted-foreground ml-2">({discountFormData.user_ids.length} izabrano)</span>}</Label>
                                {editingDiscount ? (
                                    <Input value={users.find(u => u.id.toString() === discountFormData.user_ids[0])?.full_name || ''} disabled className="bg-muted" />
                                ) : (
                                    <MultiSelect
                                        options={users.map(u => ({ value: u.id.toString(), label: u.full_name, description: u.company_name }))}
                                        selected={discountFormData.user_ids}
                                        onChange={(selected) => handleDiscountFormChange('user_ids', selected)}
                                        placeholder="Izaberite korisnike..."
                                        searchPlaceholder="Pretraži korisnike..."
                                        emptyText="Nema korisnika."
                                    />
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Kategorija guma *{!editingDiscount && discountFormData.tire_kategorije.length > 0 && <span className="text-xs text-muted-foreground ml-2">({discountFormData.tire_kategorije.length} izabrano)</span>}</Label>
                            {editingDiscount ? (
                                <Input value={discountFormData.tire_kategorije[0] || ''} disabled className="bg-muted" />
                            ) : (
                                <MultiSelect
                                    options={kategorije.map(k => ({ value: k, label: k }))}
                                    selected={discountFormData.tire_kategorije}
                                    onChange={(selected) => handleDiscountFormChange('tire_kategorije', selected)}
                                    placeholder="Izaberite kategorije..."
                                    searchPlaceholder="Pretraži kategorije..."
                                    emptyText="Nema kategorija."
                                />
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Procenat popusta (%) *</Label>
                            <Input type="number" min="0" max="100" step="0.01" value={discountFormData.percentage} onChange={(e) => handleDiscountFormChange('percentage', e.target.value)} required placeholder="npr. 10.5" />
                        </div>

                        {!editingDiscount && discountFormData.user_ids.length > 0 && discountFormData.tire_kategorije.length > 0 && (
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="font-medium mb-1">Broj popusta koji će biti kreirani:</p>
                                <p className="text-muted-foreground">
                                    {discountFormData.scope === 'per_user'
                                        ? `${discountFormData.user_ids.length} × ${discountFormData.tire_kategorije.length} = ${discountFormData.user_ids.length * discountFormData.tire_kategorije.length} popusta`
                                        : `${discountFormData.tire_kategorije.length} popusta`}
                                </p>
                            </div>
                        )}

                        {isCreatingDiscounts && (
                            <div className="rounded-md bg-muted p-3 text-sm">
                                <p className="font-medium">Kreiranje popusta... {discountCreationProgress.current} od {discountCreationProgress.total}</p>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowDiscountModal(false)} disabled={isCreatingDiscounts}>Otkaži</Button>
                            <Button type="submit" disabled={isCreatingDiscounts}>{isCreatingDiscounts ? 'Kreiranje...' : (editingDiscount ? 'Ažuriraj' : 'Kreiraj')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Promo Code Modal */}
            <Dialog open={showPromoCodeModal} onOpenChange={setShowPromoCodeModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingPromoCode ? 'Uredi promo kod' : 'Dodaj novi promo kod'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePromoCodeSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kod *</Label>
                                <Input value={promoCodeFormData.code} onChange={(e) => setPromoCodeFormData(p => ({ ...p, code: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Popust *</Label>
                                <Input type="number" value={promoCodeFormData.discount} onChange={(e) => setPromoCodeFormData(p => ({ ...p, discount: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ističe</Label>
                            <Input type="date" value={promoCodeFormData.expires_at} onChange={(e) => setPromoCodeFormData(p => ({ ...p, expires_at: e.target.value }))} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowPromoCodeModal(false)}>Otkaži</Button>
                            <Button type="submit">{editingPromoCode ? 'Ažuriraj' : 'Kreiraj'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Discount Dialog */}
            <Dialog open={showDeleteDiscountDialog} onOpenChange={setShowDeleteDiscountDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potvrda brisanja</DialogTitle>
                        <DialogDescription>
                            Da li ste sigurni da želite da obrišete ovaj popust?
                        </DialogDescription>
                    </DialogHeader>
                    {discountToDelete && (
                        <div className="p-3 bg-muted rounded-md text-sm space-y-1">
                            <div><strong>Tip:</strong> {discountToDelete.scope === 'app_wide' ? 'Globalni' : 'Po korisniku'}</div>
                            {discountToDelete.user && <div><strong>Korisnik:</strong> {discountToDelete.user.full_name}</div>}
                            <div><strong>Kategorija:</strong> {discountToDelete.tire_kategorija}</div>
                            <div><strong>Procenat:</strong> {discountToDelete.percentage}%</div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => { setShowDeleteDiscountDialog(false); setDiscountToDelete(null); }}>Otkaži</Button>
                        <Button type="button" onClick={confirmDeleteDiscount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Obriši
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
