import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Podešavanja Profila',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    company_name: string;
    jib: string;
    phone: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;


    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        full_name: auth.user.full_name || auth.user.name || '',
        email: auth.user.email || '',
        password: '',
        password_confirmation: '',
        company_name: '',
        jib: '',
        phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Podešavanja profila" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Podešavanja profila" description="Upravljajte svojim podacima" />
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Ime i Prezime</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.full_name}
                                onChange={(e) => setData('full_name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Ime i Prezime"
                            />

                            <InputError className="mt-2" message={errors.full_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email adresa</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="primjer@example.com"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>


                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Vaša email adresa nije verifikovana.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Kliknite ovdje da pošaljete ponovo verifikacijsku email adresu.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        Novi verifikacijski link je poslan na vašu email adresu.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Sačuvaj</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Sačuvano</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
