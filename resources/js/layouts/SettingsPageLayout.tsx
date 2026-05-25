import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    CircleDollarSign,
    HelpCircle,
    Home,
    LogOut,
    Search,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { Auth } from '@/types/auth';

type SettingsPageLayoutProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

type SettingsNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

const settingsItems: SettingsNavItem[] = [
    { label: 'Edit Profil', href: '/pengaturan', icon: UserRound },
    {
        label: 'Riwayat Poin',
        href: '/pengaturan/riwayat-poin',
        icon: CircleDollarSign,
    },
    { label: 'Bantuan', href: '/pengaturan/bantuan', icon: HelpCircle },
];

export default function SettingsPageLayout({
    title,
    description,
    children,
}: SettingsPageLayoutProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { isCurrentUrl } = useCurrentUrl();
    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div
            className="min-h-screen bg-[#FBF7FF] font-sans text-[#382A49]"
            style={{
                fontFamily:
                    '"Plus Jakarta Sans", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
            }}
        >
            <Head title={title} />

            <header className="sticky top-0 z-30 border-b border-[#EFE4F8] bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-4 px-4 sm:px-6 lg:px-8">
                    <Link href="/dashboard" className="shrink-0">
                        <img
                            src="/images/logo.svg"
                            alt="InCollab"
                            className="h-10 w-auto"
                        />
                    </Link>

                    <div className="relative min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A7FA2]" />
                        <input
                            type="text"
                            placeholder="Cari pengaturan..."
                            className="h-12 w-full rounded-full border border-[#EADCF8] bg-[#F7F1FF] pr-4 pl-11 text-sm text-[#382A49] transition outline-none placeholder:text-[#9B8FB3] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                        />
                    </div>

                    <Link
                        href="/pengaturan/notifikasi"
                        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#EEE4F9] text-[#6610F2] transition hover:bg-[#F7F1FF]"
                        aria-label="Notifikasi"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-[#D11149]" />
                    </Link>

                    <Link
                        href="/pengaturan"
                        className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(135deg,#6610F2,#A855F7)] text-sm font-bold text-white shadow-[0_10px_20px_rgba(102,16,242,0.25)]"
                        aria-label="Edit profil"
                    >
                        {auth.user.avatar ? (
                            <img
                                src={auth.user.avatar}
                                alt={auth.user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </Link>
                </div>
            </header>

            <main className="px-4 py-6 pb-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1320px]">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#1F1730]">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-2 text-sm font-medium text-[#766B8A]">
                                    {description}
                                </p>
                            )}
                        </div>

                        <Link
                            href="/dashboard"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#D8CDE8] bg-white px-4 text-sm font-semibold text-[#6610F2] transition hover:bg-[#F7F1FF]"
                        >
                            <Home className="h-4 w-4" />
                            Kembali ke Beranda
                        </Link>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
                        <aside className="h-fit rounded-[24px] border border-[#EFE4F8] bg-white p-4 shadow-[0_18px_45px_rgba(177,145,221,0.12)]">
                            <h2 className="px-3 pb-4 text-xl font-bold text-[#1F1730]">
                                Settings
                            </h2>

                            <div className="space-y-1">
                                {settingsItems.map(
                                    ({ label, href, icon: Icon }) => {
                                        const active = isCurrentUrl(href);

                                        return (
                                            <Link
                                                key={label}
                                                href={href}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                                                    active
                                                        ? 'bg-[#F3ECFF] text-[#6610F2]'
                                                        : 'text-[#5E5873] hover:bg-[#F8F3FF] hover:text-[#6610F2]'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </Link>
                                        );
                                    },
                                )}

                                <div className="my-3 border-t border-[#EFE4F8]" />

                                <button
                                    type="button"
                                    onClick={() => router.post('/logout')}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#D11149] transition hover:bg-[#FFF0F4]"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Keluar
                                </button>
                            </div>
                        </aside>

                        <section className="rounded-[24px] border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(177,145,221,0.12)]">
                            {children}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
