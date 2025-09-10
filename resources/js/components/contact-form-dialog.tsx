import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface Tire {
    id: number;
    sifra: string;
    ime: string;
    dimenzije?: string;
    sirina?: string;
    visina?: string;
    eprel_code?: string;
    veleprodajna_cijena?: number;
    maloprodajna_cijena?: number;
    kolicina_na_stanju: number;
    sezona?: string;
    is_active: boolean;
}

interface ContactFormDialogProps {
    tire: Tire;
    children: React.ReactNode;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export function ContactFormDialog({ tire, children }: ContactFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Ime je obavezno';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email je obavezan';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Unesite validnu email adresu';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Poruka je obavezna';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            router.post('/contact-inquiry', {
                tire_id: tire.id,
                tire_sifra: tire.sifra,
                tire_name: tire.ime,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            }, {
                onSuccess: () => {
                    toast.success('Vaš upit je uspešno poslat! Kontaktiraćemo vas uskoro.');
                    setOpen(false);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                },
                onError: (errors) => {
                    console.error('Contact form errors:', errors);
                    toast.error('Greška pri slanju upita. Molimo pokušajte ponovo.');
                },
                onFinish: () => {
                    setIsSubmitting(false);
                }
            });
        } catch (error) {
            console.error('Contact form submission error:', error);
            toast.error('Greška pri slanju upita. Molimo pokušajte ponovo.');
            setIsSubmitting(false);
        }
    };

    const getTireDisplayInfo = () => {
        const parts = [];
        if (tire.sifra) parts.push(`Šifra: ${tire.sifra}`);
        if (tire.ime) parts.push(tire.ime);
        if (tire.dimenzije) parts.push(tire.dimenzije);
        return parts.join(' - ');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Pošaljite upit o gumi
                    </DialogTitle>
                    <DialogDescription>
                        Pošaljite nam upit o gumi: <strong>{getTireDisplayInfo()}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Ime i prezime *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Vaše ime i prezime"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefon</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+387 XX XXX XXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email adresa *</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="vasa.email@example.com"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Vaš upit *</Label>
                        <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Opišite vaš upit o ovoj gumi..."
                            rows={4}
                            className={errors.message ? 'border-red-500' : ''}
                        />
                        {errors.message && (
                            <p className="text-sm text-red-500">{errors.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Otkaži
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            {isSubmitting ? 'Šalje se...' : 'Pošalji upit'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
