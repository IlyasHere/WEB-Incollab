import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    Coins,
    Gift,
    Handshake,
    Plus,
    Send,
    Trophy,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

const summaryCards = [
    {
        label: 'Event Dipublikasi',
        value: '24',
        icon: CalendarDays,
        accent: 'bg-[#F0E7FF] text-[#6610F2]',
    },
    {
        label: 'Reminder Terjadwal',
        value: '12',
        icon: Trophy,
        accent: 'bg-[#FFF0E0] text-[#F37933]',
    },
    {
        label: 'Pengaduan Baru',
        value: '8',
        icon: AlertTriangle,
        accent: 'bg-[#FFF0F4] text-[#D11149]',
        badge: '3 Baru',
    },
    {
        label: 'Reward Aktif',
        value: '45',
        icon: Gift,
        accent: 'bg-[#FFF8CC] text-[#E6C229]',
    },
];

const quickActions = [
    {
        label: 'Tambah Event',
        href: '/admin/event',
        icon: Plus,
        variant: 'primary',
    },
    // { label: 'Kirim Reminder', href: '/admin/reminder', icon: Send },
    { label: 'Tambah Reward', href: '/admin/reward', icon: Plus },
    { label: 'Kelola Poin', href: '/admin/poin', icon: Coins },
];

const upcomingEvents = [
    {
        name: 'UI/UX Competition Bootcamp',
        date: '12 Okt 2026',
        status: 'Aktif',
    },
    { name: 'Seminar Karier Digital', date: '15 Okt 2026', status: 'Draft' },
    { name: 'Hackathon Kampus 2026', date: '20 Okt 2026', status: 'Aktif' },
    { name: 'Workshop Data Analytics', date: '24 Okt 2026', status: 'Aktif' },
];

const latestReports = [
    { category: 'Infrastruktur', reporter: 'Ahmad Rizki', status: 'Baru' },
    { category: 'Pelayanan', reporter: 'Salsabila Putri', status: 'Proses' },
    { category: 'Fasilitas', reporter: 'Naufal Akbar', status: 'Selesai' },
    { category: 'Akun', reporter: 'Dinda Maharani', status: 'Proses' },
];

function statusClass(status: string) {
    switch (status) {
        case 'Aktif':
            return 'bg-[#F0E7FF] text-[#6610F2]';
        case 'Draft':
            return 'bg-[#EEE9F5] text-[#766B8A]';
        case 'Baru':
            return 'bg-[#FFE3EA] text-[#D11149]';
        case 'Proses':
            return 'bg-[#FFF5C2] text-[#B98900]';
        case 'Selesai':
            return 'bg-[#DCFCE7] text-[#15803D]';
        default:
            return 'bg-[#F0E7FF] text-[#6610F2]';
    }
}

function SkeletonBlock({ className }: { className: string }) {
    return (
        <div className={`animate-pulse rounded-xl bg-[#EFE4F8] ${className}`} />
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-7">
            <section>
                <SkeletonBlock className="h-9 w-56" />
                <SkeletonBlock className="mt-4 h-5 w-full max-w-[520px]" />
            </section>

            <SkeletonBlock className="h-[86px] w-full rounded-2xl" />

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]"
                    >
                        <SkeletonBlock className="h-10 w-10" />
                        <SkeletonBlock className="mt-5 h-8 w-16" />
                        <SkeletonBlock className="mt-4 h-4 w-36" />
                    </div>
                ))}
            </section>

            <section className="flex flex-wrap gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonBlock key={index} className="h-12 w-40" />
                ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <section
                        key={index}
                        className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]"
                    >
                        <SkeletonBlock className="h-6 w-44" />
                        <div className="mt-6 space-y-4">
                            {Array.from({ length: 4 }).map((__, rowIndex) => (
                                <SkeletonBlock
                                    key={rowIndex}
                                    className="h-10 w-full"
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = window.setTimeout(() => setIsLoading(false), 900);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            <Head title="Dashboard Admin" />

            {isLoading ? (
                <DashboardSkeleton />
            ) : (
                <div className="space-y-7">
                    <section>
                        <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#1F1730]">
                            Dashboard
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#766B8A] sm:text-base">
                            Ringkasan aktivitas utama InCollab untuk admin.
                        </p>
                    </section>

                    <section className="flex items-center gap-4 rounded-2xl border border-[#E6D4F7] bg-[#F7F0FF] px-6 py-6 text-[#1F1730]">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6610F2] shadow-[0_12px_24px_rgba(102,16,242,0.12)]">
                            <Handshake className="h-6 w-6" />
                        </span>
                        <p className="text-base font-bold sm:text-xl">
                            Halo Admin, berikut ringkasan terbaru hari ini.
                        </p>
                    </section>

                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map(
                            ({ label, value, icon: Icon, accent, badge }) => (
                                <div
                                    key={label}
                                    className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6610F2]/30 hover:shadow-lg"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <p className="mt-4 text-2xl font-extrabold text-[#1F1730]">
                                                {value}
                                            </p>
                                            <p className="mt-3 text-xs font-bold tracking-wide text-[#766B8A] uppercase">
                                                {label}
                                            </p>
                                        </div>
                                        {badge && (
                                            <span className="rounded-full bg-[#FFE3EA] px-3 py-1 text-xs font-extrabold text-[#D11149]">
                                                {badge}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ),
                        )}
                    </section>

                    <section className="flex flex-wrap gap-4">
                        {quickActions.map(
                            ({ label, href, icon: Icon, variant }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-all duration-300 ${variant === 'primary'
                                            ? 'bg-[#6610F2] text-white shadow-[0_12px_26px_rgba(102,16,242,0.20)] hover:bg-[#550DCC] hover:shadow-[0_16px_32px_rgba(102,16,242,0.26)]'
                                            : 'border border-[#6610F2] bg-white text-[#6610F2] hover:bg-[#F4ECFF] hover:shadow-[0_12px_24px_rgba(102,16,242,0.10)]'
                                        }`}
                                >
                                    <Icon className="h-4.5 w-4.5" />
                                    {label}
                                </Link>
                            ),
                        )}
                    </section>

                    <div className="grid gap-6 xl:grid-cols-2">
                        <section className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-xl font-extrabold text-[#1F1730]">
                                    Event Terdekat
                                </h2>
                                <span className="text-xs font-bold text-[#766B8A]">
                                    {upcomingEvents.length} event
                                </span>
                            </div>
                            <div className="mt-5 overflow-hidden">
                                <div className="grid grid-cols-[minmax(0,1.6fr)_110px_84px] border-b border-[#EFE4F8] px-2 pb-3 text-xs font-extrabold tracking-wide text-[#766B8A] uppercase">
                                    <span>Nama Event</span>
                                    <span>Tanggal</span>
                                    <span className="text-right">Status</span>
                                </div>
                                <div className="divide-y divide-[#EFE4F8]">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.name}
                                            className="grid grid-cols-[minmax(0,1.6fr)_110px_84px] items-center gap-3 px-2 py-4 transition hover:bg-[#FBF7FF]"
                                        >
                                            <p className="truncate text-sm font-bold text-[#382A49]">
                                                {event.name}
                                            </p>
                                            <p className="text-sm font-medium text-[#382A49]">
                                                {event.date}
                                            </p>
                                            <div className="text-right">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${statusClass(
                                                        event.status,
                                                    )}`}
                                                >
                                                    {event.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-xl font-extrabold text-[#1F1730]">
                                    Pengaduan Terbaru
                                </h2>
                                <span className="text-xs font-bold text-[#766B8A]">
                                    {latestReports.length} laporan
                                </span>
                            </div>
                            <div className="mt-5 overflow-hidden">
                                <div className="grid grid-cols-[1fr_1fr_92px] border-b border-[#EFE4F8] px-2 pb-3 text-xs font-extrabold tracking-wide text-[#766B8A] uppercase">
                                    <span>Kategori</span>
                                    <span>Pelapor</span>
                                    <span className="text-right">Status</span>
                                </div>
                                <div className="divide-y divide-[#EFE4F8]">
                                    {latestReports.map((report) => (
                                        <div
                                            key={`${report.category}-${report.reporter}`}
                                            className="grid grid-cols-[1fr_1fr_92px] items-center gap-3 px-2 py-4 transition hover:bg-[#FBF7FF]"
                                        >
                                            <p className="truncate text-sm font-bold text-[#382A49]">
                                                {report.category}
                                            </p>
                                            <p className="truncate text-sm font-medium text-[#382A49]">
                                                {report.reporter}
                                            </p>
                                            <div className="text-right">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${statusClass(
                                                        report.status,
                                                    )}`}
                                                >
                                                    {report.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </>
    );
}

AdminDashboard.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
