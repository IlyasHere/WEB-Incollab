import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarDays,
    ClipboardList,
    Gift,
    Handshake,
    Plus,
    Send,
    Trophy,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

type AdminDashboardSummary = {
    publishedEvents: number;
    scheduledReminders: number;
    newReports: number;
    newReportsToday: number;
    activeRewards: number;
};

type AdminDashboardEvent = {
    id: number;
    name: string;
    date: string;
    status: string;
};

type AdminDashboardReport = {
    id: number;
    category: string;
    reporter: string;
    status: string;
};

type AdminDashboardProps = {
    summary: AdminDashboardSummary;
    upcomingEvents: AdminDashboardEvent[];
    latestReports: AdminDashboardReport[];
};

const quickActions = [
    {
        label: 'Tambah Event',
        href: '/admin/event',
        icon: Plus,
        variant: 'primary',
    },
    { label: 'Kirim Reminder', href: '/admin/reminder', icon: Send },
    { label: 'Tambah Reward', href: '/admin/reward', icon: Plus },
    // { label: 'Kelola Poin', href: '/admin/poin', icon: Coins },
    { label: 'Pengaduan', href: '/admin/pengaduan', icon: ClipboardList },
];

function statusClass(status: string) {
    switch (status) {
        case 'Aktif':
            return 'bg-[#F0E7FF] text-[#6610F2]';
        case 'Draft':
            return 'bg-[#EEE9F5] text-[#766B8A]';
        case 'Baru':
            return 'bg-[#FFE3EA] text-[#D11149]';
        case 'Diproses':
        case 'Proses':
            return 'bg-[#FFF5C2] text-[#B98900]';
        case 'Selesai':
            return 'bg-[#DCFCE7] text-[#15803D]';
        default:
            return 'bg-[#F0E7FF] text-[#6610F2]';
    }
}

export default function AdminDashboard({
    summary,
    upcomingEvents = [],
    latestReports = [],
}: AdminDashboardProps) {
    const summaryCards = [
        {
            label: 'Event Dipublikasi',
            value: summary.publishedEvents,
            icon: CalendarDays,
            accent: 'bg-[#F0E7FF] text-[#6610F2]',
        },
        {
            label: 'Reminder Terjadwal',
            value: summary.scheduledReminders,
            icon: Trophy,
            accent: 'bg-[#FFF0E0] text-[#F37933]',
        },
        {
            label: 'Pengaduan Baru',
            value: summary.newReports,
            icon: AlertTriangle,
            accent: 'bg-[#FFF0F4] text-[#D11149]',
            badge:
                summary.newReportsToday > 0
                    ? `${summary.newReportsToday} Baru`
                    : undefined,
        },
        {
            label: 'Reward Aktif',
            value: summary.activeRewards,
            icon: Gift,
            accent: 'bg-[#FFF8CC] text-[#E6C229]',
        },
    ];

    return (
        <>
            <Head title="Dashboard Admin" />

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
                                            {value.toLocaleString('id-ID')}
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
                                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-all duration-300 ${
                                    variant === 'primary'
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
                            {upcomingEvents.length > 0 ? (
                                <div className="divide-y divide-[#EFE4F8]">
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
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
                            ) : (
                                <EmptyTableState message="Belum ada event mendatang." />
                            )}
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
                            {latestReports.length > 0 ? (
                                <div className="divide-y divide-[#EFE4F8]">
                                    {latestReports.map((report) => (
                                        <div
                                            key={report.id}
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
                            ) : (
                                <EmptyTableState message="Belum ada pengaduan terbaru." />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function EmptyTableState({ message }: { message: string }) {
    return (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-[#D8CDE8] bg-[#FBF7FF] px-4 py-6 text-center text-sm font-semibold text-[#766B8A]">
            {message}
        </div>
    );
}

AdminDashboard.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
