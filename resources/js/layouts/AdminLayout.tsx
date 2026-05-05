import { Link, router, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    Bell,
    CalendarDays,
    Coins,
    Gift,
    Grid2X2,
    LogOut,
    Megaphone,
    Menu,
    Settings,
    Trophy,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Auth } from '@/types/auth';

type AdminLayoutProps = {
    children: ReactNode;
};

type AdminNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

const navItems: AdminNavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: Grid2X2 },
    { label: 'Event', href: '/admin/event', icon: Trophy },
    { label: 'Reminder', href: '/admin/reminder', icon: CalendarDays },
    { label: 'Pengaduan', href: '/admin/pengaduan', icon: Megaphone },
    { label: 'Reward', href: '/admin/reward', icon: Gift },
    { label: 'Poin', href: '/admin/poin', icon: Coins },
    { label: 'Pengaturan', href: '/admin/pengaturan', icon: Settings },
];

function getCurrentPath() {
    if (typeof window === 'undefined') {
        return '';
    }

    return window.location.pathname;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const currentPath = getCurrentPath();

    return (
        <>
            <div className="px-6 py-6">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-3"
                >
                    <img
                        src="/images/logo.svg"
                        alt="InCollab"
                        className="h-10 w-10 shrink-0"
                    />
                    <div>
                        <p className="text-xl leading-5 font-extrabold text-[#6610F2]">
                            InCollab
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#766B8A]">
                            Admin Panel
                        </p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 space-y-2 px-3 py-7">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const active = currentPath === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-300 ${active
                                    ? 'bg-[#6610F2] text-white shadow-[0_14px_26px_rgba(102,16,242,0.24)]'
                                    : 'text-[#46566E] hover:bg-[#F7F1FF] hover:text-[#6610F2]'
                                }`}
                        >
                            <Icon className="h-5 w-5" strokeWidth={2.1} />
                            {label}
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const userName = auth.user.name;
    const initials = userName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div
            className="min-h-screen bg-white text-[#1F1730]"
            style={{
                fontFamily:
                    '"Plus Jakarta Sans", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
            }}
        >
            <div className="flex min-h-screen">
                <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[#EFE4F8] bg-white lg:flex">
                    <SidebarContent />
                </aside>

                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <button
                            type="button"
                            aria-label="Tutup menu admin"
                            className="absolute inset-0 bg-[#1F1730]/35"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <aside className="relative flex h-full w-[290px] flex-col bg-white shadow-[18px_0_45px_rgba(31,23,48,0.18)]">
                            <div className="absolute top-4 right-4">
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EFE4F8] text-[#766B8A]"
                                    aria-label="Tutup menu admin"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <SidebarContent
                                onNavigate={() => setMobileMenuOpen(false)}
                            />
                        </aside>
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <header className="sticky top-0 z-30 border-b border-[#EFE4F8] bg-white/95 shadow-[0_12px_34px_rgba(102,16,242,0.04)] backdrop-blur">
                        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(true)}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EFE4F8] text-[#6610F2] transition hover:bg-[#F7F1FF] lg:hidden"
                                aria-label="Buka menu admin"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            <div className="min-w-0 flex-1" />

                            <div className="group relative">
                                <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#F0E7FF] text-xs font-extrabold text-[#6610F2] shadow-[0_10px_22px_rgba(102,16,242,0.12)] ring-1 ring-[#EFE4F8]">
                                    {initials}
                                </div>

                                <div className="invisible absolute top-14 right-0 w-48 translate-y-2 rounded-2xl border border-[#EFE4F8] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(56,42,73,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                    <div className="px-3 py-2">
                                        <p className="text-xs text-[#766B8A]">
                                            Masuk sebagai
                                        </p>
                                        <p className="truncate text-sm font-semibold text-[#382A49]">
                                            {userName}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.post('/logout')}
                                        className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#D11149] transition hover:bg-[#FFF0F4]"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
                        <div className="mx-auto max-w-[1184px]">{children}</div>
                    </main>
                </div>
            </div>
        </div>
    );
}
