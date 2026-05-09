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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Users, Mail, Phone, Building, Edit, Trash2, UserPlus, UserMinus, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

interface User {
    id: number;
    full_name: string;
    email: string;
    company_name?: string;
    phone?: string;
    jib?: string;
    role: number;
    is_active: boolean;
    orders_count: number;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    users: PaginatedUsers;
    filters: { search?: string };
}

interface UserFormData {
    full_name: string;
    email: string;
    company_name: string;
    phone: string;
    jib: string;
    password: string;
    role: number;
    is_active: boolean;
}

const roleOptions = [
    { value: 0, label: 'Korisnik' },
    { value: 1, label: 'Administrator' },
    { value: 2, label: 'Prodaja' },
];

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

export default function AdminUsers({ users, filters = {} }: Props) {
    const [searchInput, setSearchInput] = useState(filters.search || '');

    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userFormData, setUserFormData] = useState<UserFormData>({
        full_name: '', email: '', company_name: '', phone: '', jib: '', password: '', role: 0, is_active: true,
    });

    const applySearch = () => {
        const params: Record<string, string> = {};
        if (searchInput) params.search = searchInput;
        router.get('/admin/users', params, { preserveState: true, preserveScroll: true });
    };

    const clearSearch = () => {
        setSearchInput('');
        router.get('/admin/users');
    };

    const goToPage = (page: number) => {
        const params: Record<string, string> = { page: String(page) };
        if (searchInput) params.search = searchInput;
        router.get('/admin/users', params, { preserveState: true, preserveScroll: true });
    };

    const openCreateUserModal = () => {
        setEditingUser(null);
        setUserFormData({ full_name: '', email: '', company_name: '', phone: '', jib: '', password: '', role: 0, is_active: true });
        setShowUserModal(true);
    };

    const openEditUserModal = (user: User) => {
        setEditingUser(user);
        setUserFormData({
            full_name: user.full_name, email: user.email,
            company_name: user.company_name || '', phone: user.phone || '',
            jib: user.jib || '', password: '', role: user.role, is_active: user.is_active,
        });
        setShowUserModal(true);
    };

    const handleUserFormChange = (field: keyof UserFormData, value: string | boolean | number) => {
        setUserFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUserSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = { ...userFormData };
            if (editingUser && !submitData.password) delete (submitData as any).password;
            if (!submitData.phone) delete (submitData as any).phone;
            if (!submitData.jib) delete (submitData as any).jib;

            if (editingUser) {
                router.patch(`/users/${editingUser.id}`, submitData, {
                    onSuccess: () => { toast.success('Korisnik je uspešno ažuriran'); setShowUserModal(false); },
                    onError: (errors) => Object.values(errors).flat().forEach(m => toast.error(String(m))),
                });
            } else {
                router.post('/users', submitData, {
                    onSuccess: () => { toast.success('Korisnik je uspešno kreiran'); setShowUserModal(false); },
                    onError: (errors) => Object.values(errors).flat().forEach(m => toast.error(String(m))),
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = (user: User) => { setUserToDelete(user); setShowDeleteDialog(true); };

    const confirmDeleteUser = () => {
        if (!userToDelete) return;
        router.delete(`/users/${userToDelete.id}`, {
            onSuccess: () => { toast.success('Korisnik je uspešno obrisan'); setShowDeleteDialog(false); setUserToDelete(null); },
            onError: () => toast.error('Greška pri brisanju korisnika'),
        });
    };

    const handleSoftDeleteUser = (user: User) => {
        router.patch(`/users/${user.id}`, { is_active: false }, {
            onSuccess: () => { toast.success('Korisnik je uspešno deaktiviran'); setShowDeleteDialog(false); setUserToDelete(null); },
            onError: () => toast.error('Greška pri deaktiviranju korisnika'),
        });
    };

    return (
        <AppLayout>
            <Head title="Korisnici — Admin" />

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm">
                        ← Admin
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <h1 className="text-2xl font-bold tracking-tight">Korisnici</h1>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Korisnici
                                    <Badge variant="outline" className="ml-2">{users.total} ukupno</Badge>
                                </CardTitle>
                                <CardDescription>Pregled svih registrovanih korisnika</CardDescription>
                            </div>
                            <Button onClick={openCreateUserModal} className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Dodaj korisnika
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Pretraži po imenu, emailu ili kompaniji..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                                className="max-w-sm"
                            />
                            <Button onClick={applySearch} className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Pretraži
                            </Button>
                            {searchInput && (
                                <Button variant="outline" onClick={clearSearch}>
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ime</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Kompanija</TableHead>
                                        <TableHead>Telefon</TableHead>
                                        <TableHead>JIB</TableHead>
                                        <TableHead>Uloga</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Narudžbe</TableHead>
                                        <TableHead>Registrovan</TableHead>
                                        <TableHead>Akcije</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                                Nema korisnika
                                            </TableCell>
                                        </TableRow>
                                    ) : users.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.full_name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                    {user.email}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {user.company_name && (
                                                    <div className="flex items-center gap-1">
                                                        <Building className="h-3 w-3 text-muted-foreground" />
                                                        {user.company_name}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {user.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3 text-muted-foreground" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{user.jib}</TableCell>
                                            <TableCell>
                                                <Badge variant={user.role === 1 ? 'default' : 'secondary'}>
                                                    {roleOptions.find(r => r.value === user.role)?.label || user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                                    {user.is_active ? 'Aktivan' : 'Neaktivan'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.orders_count}</Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => openEditUserModal(user)}>
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)} className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
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
                                {users.from}–{users.to} od {users.total} korisnika
                            </p>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => goToPage(users.current_page - 1)} disabled={users.current_page === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">Strana {users.current_page} od {users.last_page}</span>
                                <Button variant="outline" size="sm" onClick={() => goToPage(users.current_page + 1)} disabled={users.current_page === users.last_page}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Create/Edit Modal */}
            <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Uredi korisnika' : 'Dodaj novog korisnika'}</DialogTitle>
                        <DialogDescription>
                            {editingUser ? 'Ažuriraj informacije o korisniku' : 'Unesite informacije za novog korisnika'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Puno ime *</Label>
                                <Input id="full_name" value={userFormData.full_name} onChange={(e) => handleUserFormChange('full_name', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input id="email" type="email" value={userFormData.email} onChange={(e) => handleUserFormChange('email', e.target.value)} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company_name">Kompanija *</Label>
                                <Input id="company_name" value={userFormData.company_name} onChange={(e) => handleUserFormChange('company_name', e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefon</Label>
                                <Input id="phone" value={userFormData.phone} onChange={(e) => handleUserFormChange('phone', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jib">JIB</Label>
                                <Input id="jib" value={userFormData.jib} onChange={(e) => handleUserFormChange('jib', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Uloga *</Label>
                                <Select value={userFormData.role.toString()} onValueChange={(v) => handleUserFormChange('role', parseInt(v))}>
                                    <SelectTrigger><SelectValue placeholder="Izaberite ulogu" /></SelectTrigger>
                                    <SelectContent>
                                        {roleOptions.map(o => <SelectItem key={o.value} value={o.value.toString()}>{o.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                {editingUser ? 'Nova šifra (ostavite prazno da zadržite postojeću)' : 'Šifra *'}
                            </Label>
                            <Input id="password" type="password" value={userFormData.password} onChange={(e) => handleUserFormChange('password', e.target.value)} required={!editingUser} minLength={8} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="is_active" checked={userFormData.is_active} onCheckedChange={(checked) => handleUserFormChange('is_active', checked)} />
                            <Label htmlFor="is_active">Aktivan korisnik</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowUserModal(false)} disabled={isSubmitting}>Otkaži</Button>
                            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Čuva se...' : (editingUser ? 'Ažuriraj' : 'Kreiraj')}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Potvrda brisanja</DialogTitle>
                        <DialogDescription>
                            Da li ste sigurni da želite da obrišete korisnika <strong>{userToDelete?.full_name}</strong>? Ova akcija se ne može poništiti.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => { setShowDeleteDialog(false); setUserToDelete(null); }}>Otkaži</Button>
                        {userToDelete?.is_active && (
                            <Button type="button" onClick={() => userToDelete && handleSoftDeleteUser(userToDelete)} className="bg-orange-600 text-white hover:bg-orange-700">
                                <UserMinus className="h-4 w-4 mr-1" />
                                Deaktiviraj
                            </Button>
                        )}
                        <Button type="button" onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Obriši
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
