import { type SharedData } from '@/types';

import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background p-4 text-foreground lg:justify-center lg:p-8 dark:bg-background dark:text-input">
                <header className="mb-10 w-full text-sm lg:max-w-6xl">
                    <svg
                        width="251"
                        height="28"
                        viewBox="0 0 251 28"
                        fill=""
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary dark:text-white"
                    >
                        <path
                            d="M24.217 14L16.1738 0L8.04319 14L0 28H32.2602L24.217 14ZM17.4852 25.6375L22.9056 16.275L28.326 25.6375H17.4852ZM16.1738 23.3625L12.0648 16.275H20.1954L16.1738 23.3625ZM21.5068 14H10.7534L16.1738 4.6375L21.5068 14ZM9.35458 16.275L14.775 25.6375H4.0216L9.35458 16.275Z"
                            fill="currentColor"
                        />
                        <path
                            d="M41.2646 11.2891H64.2576L62.5965 14.2641H56.0396L50.0946 24.7641H39.9532L45.8982 14.2641H39.6035L41.2646 11.2891Z"
                            fill="currentColor"
                        />
                        <path
                            d="M90.5731 11.2891H69.9406L62.2471 24.8516H71.7765L74.137 20.7391H77.8963C79.2077 21.0016 79.2077 22.3141 79.2077 22.3141L79.6448 24.8516H88.2126L87.1635 19.7766C91.0976 19.6016 93.633 17.1516 93.8079 14.2641C94.0701 11.3766 90.5731 11.2891 90.5731 11.2891ZM84.1036 16.1016C83.9287 17.8516 82.967 18.7266 82.4425 18.7266H75.2735L77.8963 14.1766H82.6173C82.5299 14.2641 84.191 14.3516 84.1036 16.1016Z"
                            fill="currentColor"
                        />
                        <path d="M101.852 11.2891H110.245L102.551 24.7641H94.1582L101.852 11.2891Z" fill="currentColor" />
                        <path
                            d="M121.872 11.2891L108.233 24.8516H114.79L117.675 22.2266H124.32L123.795 24.8516H132.888L135.773 11.2891H121.872ZM124.932 19.4266H120.823L125.806 14.9641L124.932 19.4266Z"
                            fill="currentColor"
                        />
                        <path d="M201.605 11.2891H210.697L204.577 21.8766H217.429L215.768 24.7641H193.911L201.605 11.2891Z" fill="currentColor" />
                        <path
                            d="M221.537 24.7641H243.306L244.967 21.8766H232.028L233.514 19.2516H242.519L244.006 16.7141H235.001L236.662 13.8266H249.513L251 11.2891H229.231L221.537 24.7641Z"
                            fill="currentColor"
                        />
                        <path
                            d="M194.96 12.861C194.96 12.861 189.277 11.111 184.206 11.1985C179.136 11.3735 172.579 13.6485 170.568 17.3235C170.568 17.3235 168.994 19.861 170.48 22.2235C171.967 24.586 176.163 24.761 177.824 24.6735C179.573 24.586 181.846 24.3235 183.332 23.7985L182.807 24.6735H187.966L192.861 16.361H182.283L180.36 19.5985H185.867C185.867 19.5985 184.731 22.0485 180.972 22.0485C177.212 22.0485 176.95 18.8985 177.649 17.6735C178.349 16.361 179.485 15.136 181.671 14.436C183.857 13.736 186.217 13.911 188.84 14.086C191.463 14.261 193.823 14.6985 193.823 14.6985L194.96 12.861Z"
                            fill="currentColor"
                        />
                        <path
                            d="M138.657 24.7641L146.351 11.2891H155.093L158.153 19.4266L162.699 11.2891H168.382L160.689 24.7641H153.17L150.897 18.6391L147.4 24.7641H138.657Z"
                            fill="currentColor"
                        />
                    </svg>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="grid h-full min-h-120 w-full grid-cols-1 flex-col overflow-clip rounded-md shadow-xl shadow-foreground/15 lg:max-w-6xl lg:grid-cols-2 lg:flex-row">
                        <div className="flex flex-1 flex-col justify-center bg-sidebar p-8 lg:px-10 dark:bg-light-background dark:text-foreground-alt">
                            <h1 className="mb-3 text-3xl font-semibold text-foreground uppercase lg:mb-4 lg:text-5xl dark:text-foreground-alt">
                                Dobrodošli na <br /> <span className="text-foreground-alt dark:text-primary">TRIANGLE WEBSHOP</span>
                            </h1>

                            {auth.user ? (
                                <>
                                    <p className="mb-6 text-xl">
                                        Prijavljeni ste kao <span className="font-semibold">{auth.user?.full_name || auth.user?.email}</span>.{' '}
                                        <br></br>
                                        Započnite kupovinu klikom na dugme ispod.
                                    </p>
                                    <div className="">
                                        <Button asChild size="lg">
                                            <Link href={route('dashboard')}>Početna</Link>
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Јedan od najvećih svjetskih proizvođača svih vrsta pneumatika</p>
                                    <p className="mb-6 text-xl">
                                        Prijavite se koristeći kredencijale koje smo vam dostavili se kako bi započeli kupovinu.
                                    </p>
                                    <div>
                                        <Button asChild size="lg">
                                            <Link href={route('login')}>Prijavi se</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col bg-background-dark p-10 text-lg text-white lg:mb-0 lg:-ml-px dark:bg-sidebar">
                            <h2 className="mb-4 text-2xl font-bold">Postanite naš poslovni partner!</h2>
                            <p className="mb-4">
                                <span className="font-bold">Triangle</span> web shop za pravna lica omogućava jednostavnu i brzu online kupovinu guma
                                po posebnim, partnerskim uslovima.
                            </p>
                            <p>
                                Ako ste vulkanizer, transportna kompanija, trgovina auto-dijelovima ili upravljate voznim parkom — registrujte se i
                                ostvarite pristup cijenama, zalihama i posebnim pogodnostima. Kontaktirajte nas i naš tim će vas registrovati u
                                <span className="font-bold"> Triangle Partner Zonu</span>
                            </p>
                            <div className="mt-8 flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="2" fill="#F7B530" />
                                        <path
                                            d="M12.0311 5.87354C10.2218 5.87354 8.74982 7.3455 8.74982 9.15478C8.74982 10.278 9.31625 11.3115 10.265 11.9194C11.2339 12.5401 12.4232 12.6061 13.5283 12.0976C13.7635 11.9894 13.8665 11.711 13.7583 11.4758C13.6501 11.2407 13.3717 11.1377 13.1365 11.2459C12.3284 11.6177 11.4661 11.5754 10.7708 11.13C10.0923 10.6953 9.68732 9.95694 9.68732 9.15478C9.68732 7.86244 10.7387 6.81104 12.0311 6.81104C13.3234 6.81104 14.3748 7.86244 14.3748 9.15478C14.3748 9.41325 14.1645 9.62353 13.9061 9.62353C13.6699 9.62353 13.4493 9.44441 13.4374 9.16191C13.4373 9.15953 13.4373 9.15716 13.4373 9.15478C13.4373 8.37938 12.8065 7.74854 12.0311 7.74854C11.2557 7.74854 10.6248 8.37938 10.6248 9.15478C10.6248 9.93019 11.2557 10.561 12.0311 10.561C12.3909 10.561 12.7195 10.425 12.9685 10.2018C13.2175 10.425 13.5462 10.561 13.9061 10.561C14.6815 10.561 15.3123 9.93019 15.3123 9.15478C15.3123 7.3455 13.8403 5.87354 12.0311 5.87354ZM12.4932 9.22997C12.457 9.45275 12.2639 9.62353 12.0311 9.62353C11.7726 9.62353 11.5623 9.41325 11.5623 9.15478C11.5623 8.89632 11.7726 8.68603 12.0311 8.68603C12.2714 8.68603 12.4698 8.86791 12.4965 9.10119C12.4895 9.14378 12.4884 9.18713 12.4932 9.22997Z"
                                            fill="#00010C"
                                        />
                                        <path
                                            d="M19.0625 10.1555C19.0623 10.0343 19.0135 9.91313 18.9252 9.82478L17.1875 8.08709V4.46875C17.1875 4.20987 16.9776 4 16.7188 4H7.34375C7.08488 4 6.875 4.20987 6.875 4.46875V8.08709L5.13731 9.82478C5.13569 9.82641 5.13431 9.82822 5.13272 9.82987C5.04488 9.92037 5.00022 10.0395 5.00003 10.1555C5.00003 10.1558 5 10.1561 5 10.1564V18.5938C5 19.3702 5.63175 20 6.40625 20H17.6562C18.4325 20 19.0625 19.3685 19.0625 18.5938V10.1564C19.0625 10.1561 19.0625 10.1558 19.0625 10.1555ZM17.1875 9.41291L17.9308 10.1562L17.1875 10.8996V9.41291ZM7.8125 8.28141C7.8125 8.28131 7.8125 8.28119 7.8125 8.28109V4.9375H16.25V8.28109C16.25 8.28119 16.25 8.28131 16.25 8.28141V11.8371L13.7121 14.375H10.3504L7.8125 11.8371V8.28141ZM6.875 9.41291V10.8996L6.13166 10.1562L6.875 9.41291ZM5.9375 18.3996V11.2879L9.49334 14.8438L5.9375 18.3996ZM6.60044 19.0625L10.3504 15.3125H13.7121L17.4621 19.0625H6.60044ZM18.125 18.3996L14.5692 14.8438L18.125 11.2879V18.3996Z"
                                            fill="#00010C"
                                        />
                                    </svg>

                                    <p className="">E-mail:</p>
                                    <a href="mailto:prodaja@pringdoo.com" className=" ">
                                        prodaja@pringdoo.com
                                    </a>
                                </div>

                                <div className="flex items-center gap-2">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="24" height="24" rx="2" fill="#F7B530" />
                                        <path
                                            d="M19.6196 15.801L17.6306 13.812C17.0822 13.2637 16.1899 13.2637 15.6416 13.812L14.7375 14.7161C14.322 15.1315 13.646 15.1314 13.2308 14.7163L9.31201 10.7942C8.8956 10.3778 8.89554 9.70379 9.31201 9.28732C9.45763 9.14169 9.87579 8.72353 10.2161 8.38322C10.7621 7.83728 10.7697 6.94775 10.2156 6.39369L8.22707 4.41144C7.67869 3.86309 6.78641 3.86309 6.2395 4.41C5.83025 4.81569 5.69825 4.94656 5.51475 5.12847C3.53725 7.10594 3.53725 10.3235 5.51466 12.3009L11.7238 18.5133C13.7059 20.4955 16.914 20.4956 18.8963 18.5133L19.6196 17.79C20.168 17.2417 20.168 16.3494 19.6196 15.801ZM6.90107 5.07444C7.08385 4.89166 7.38122 4.89163 7.5646 5.07494L9.5531 7.05719C9.73632 7.24041 9.73632 7.53694 9.5531 7.72019L9.22157 8.05169L6.57125 5.40138L6.90107 5.07444ZM12.3869 17.8504L6.17775 11.638C4.64782 10.108 4.56372 7.70569 5.91913 6.07528L8.56176 8.71791C7.86738 9.50507 7.89632 10.7045 8.64885 11.4571L12.5675 15.379L12.5676 15.3791C13.3193 16.1309 14.5187 16.1617 15.3069 15.4664L17.9495 18.109C16.3243 19.4621 13.9274 19.3909 12.3869 17.8504ZM18.9567 17.127L18.6251 17.4586L15.9731 14.8065L16.3046 14.475C16.4874 14.2922 16.7848 14.2922 16.9676 14.475L18.9566 16.464C19.1395 16.6469 19.1395 16.9443 18.9567 17.127Z"
                                            fill="#00010C"
                                        />
                                    </svg>

                                    <p className="">Telefon:</p>
                                    <a href="tel:+38765639346" className="">
                                        +387 65 639 346
                                    </a>
                                </div>
                            </div>

                            {/* <img src="/gume.png" alt="" /> */}
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
