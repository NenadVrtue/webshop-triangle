import { type SharedData } from '@/types';

import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button"

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-background p-4 text-foreground lg:justify-center lg:p-8 dark:bg-background dark:text-input">
                <header className="mb-10 w-full  text-sm  lg:max-w-6xl">
                    <svg width="251" height="28" viewBox="0 0 251 28" fill="" xmlns="http://www.w3.org/2000/svg" className='dark:text-white text-primary'>
                        <path d="M24.217 14L16.1738 0L8.04319 14L0 28H32.2602L24.217 14ZM17.4852 25.6375L22.9056 16.275L28.326 25.6375H17.4852ZM16.1738 23.3625L12.0648 16.275H20.1954L16.1738 23.3625ZM21.5068 14H10.7534L16.1738 4.6375L21.5068 14ZM9.35458 16.275L14.775 25.6375H4.0216L9.35458 16.275Z" fill="currentColor" />
                        <path d="M41.2646 11.2891H64.2576L62.5965 14.2641H56.0396L50.0946 24.7641H39.9532L45.8982 14.2641H39.6035L41.2646 11.2891Z" fill="currentColor" />
                        <path d="M90.5731 11.2891H69.9406L62.2471 24.8516H71.7765L74.137 20.7391H77.8963C79.2077 21.0016 79.2077 22.3141 79.2077 22.3141L79.6448 24.8516H88.2126L87.1635 19.7766C91.0976 19.6016 93.633 17.1516 93.8079 14.2641C94.0701 11.3766 90.5731 11.2891 90.5731 11.2891ZM84.1036 16.1016C83.9287 17.8516 82.967 18.7266 82.4425 18.7266H75.2735L77.8963 14.1766H82.6173C82.5299 14.2641 84.191 14.3516 84.1036 16.1016Z" fill="currentColor" />
                        <path d="M101.852 11.2891H110.245L102.551 24.7641H94.1582L101.852 11.2891Z" fill="currentColor" />
                        <path d="M121.872 11.2891L108.233 24.8516H114.79L117.675 22.2266H124.32L123.795 24.8516H132.888L135.773 11.2891H121.872ZM124.932 19.4266H120.823L125.806 14.9641L124.932 19.4266Z" fill="currentColor" />
                        <path d="M201.605 11.2891H210.697L204.577 21.8766H217.429L215.768 24.7641H193.911L201.605 11.2891Z" fill="currentColor" />
                        <path d="M221.537 24.7641H243.306L244.967 21.8766H232.028L233.514 19.2516H242.519L244.006 16.7141H235.001L236.662 13.8266H249.513L251 11.2891H229.231L221.537 24.7641Z" fill="currentColor" />
                        <path d="M194.96 12.861C194.96 12.861 189.277 11.111 184.206 11.1985C179.136 11.3735 172.579 13.6485 170.568 17.3235C170.568 17.3235 168.994 19.861 170.48 22.2235C171.967 24.586 176.163 24.761 177.824 24.6735C179.573 24.586 181.846 24.3235 183.332 23.7985L182.807 24.6735H187.966L192.861 16.361H182.283L180.36 19.5985H185.867C185.867 19.5985 184.731 22.0485 180.972 22.0485C177.212 22.0485 176.95 18.8985 177.649 17.6735C178.349 16.361 179.485 15.136 181.671 14.436C183.857 13.736 186.217 13.911 188.84 14.086C191.463 14.261 193.823 14.6985 193.823 14.6985L194.96 12.861Z" fill="currentColor" />
                        <path d="M138.657 24.7641L146.351 11.2891H155.093L158.153 19.4266L162.699 11.2891H168.382L160.689 24.7641H153.17L150.897 18.6391L147.4 24.7641H138.657Z" fill="currentColor" />
                    </svg>


                </header >
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="grid grid-cols-1 shadow-xl shadow-foreground/15 lg:grid-cols-2  w-full  min-h-120 h-full  rounded-md overflow-clip flex-col lg:max-w-6xl lg:flex-row">
                        <div className="flex-1 bg-sidebar flex flex-col justify-center dark:bg-light-background  p-8 lg:px-10  dark:text-foreground-alt    ">
                            <h1 className="mb-3 lg:mb-4 text-3xl lg:text-5xl  font-semibold uppercase">
                                Dobrodošli na <br />  <span className="text-foreground-alt dark:text-foreground">TRIANGLE
                                    WEBSHOP</span></h1>

                            {auth.user ? (
                                <>
                                    <p className="mb-6 text-xl ">
                                        Prijavljeni ste kao <span className="font-semibold">{auth.user?.full_name || auth.user?.email}</span>. <br></br>
                                        Započnite kupovinu klikom na dugme ispod.
                                    </p>
                                    <div className="">
                                        <Button asChild size="lg">
                                            <Link
                                                href={route('dashboard')}

                                            >
                                                Početna
                                            </Link>
                                        </Button>
                                    </div>

                                </>


                            ) : (
                                <>
                                    <p className="mb-6 text-xl ">
                                        Prijavite se koristeći kredencijale koje smo vam dostavili se kako bi započeli kupovinu.
                                    </p>
                                    <div>
                                        <Button asChild size="lg">
                                            <Link
                                                href={route('login')}

                                            >
                                                Prijavi se
                                            </Link>
                                        </Button>
                                    </div>




                                </>
                            )}
                        </div>
                        <div className="flex items-center justify-center bg-background-dark  p-4 overflow-hidden   lg:mb-0 lg:-ml-px  dark:bg-sidebar">
                            <img src="/gume.png" alt="" />

                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div >
        </>
    );
}
