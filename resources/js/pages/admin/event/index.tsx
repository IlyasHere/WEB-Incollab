import { Head, Link } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    Clock,
    Eye,
    GraduationCap,
    HandHeart,
    Leaf,
    MapPin,
    Pencil,
    Plus,
    Recycle,
    Search,
    Soup,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

const summaryCards = [
    {
        label: 'Total Event',
        value: '128',
        icon: CalendarDays,
        accent: 'bg-[#F0E7FF] text-[#6610F2]',
    },
    {
        label: 'Event Aktif',
        value: '24',
        icon: CalendarCheck,
        accent: 'bg-[#E8F4FF] text-[#1A8FE3]',
    },
    {
        label: 'Event Selesai',
        value: '92',
        icon: Clock,
        accent: 'bg-[#FFF8CC] text-[#E6C229]',
    },
];

const events = [
    {
        title: 'Pembersihan Pantai Kuta',
        description: 'Aksi bersih pantai bersama komunitas...',
        category: 'Lingkungan',
        date: '24 Okt 2026',
        location: 'Bali',
        points: 50,
        status: 'Aktif',
        icon: Leaf,
    },
    {
        title: 'Penghijauan Kota Jakarta',
        description: 'Penanaman 1000 pohon di ruang publik...',
        category: 'Lingkungan',
        date: '15 Nov 2026',
        location: 'Jakarta Pusat',
        points: 75,
        status: 'Draft',
        icon: Leaf,
    },
    {
        title: 'Kelas Mengajar Sukarela',
        description: 'Mengajar anak-anak panti asuhan...',
        category: 'Pendidikan',
        date: '02 Des 2026',
        location: 'Bandung',
        points: 100,
        status: 'Selesai',
        icon: GraduationCap,
    },
    {
        title: 'Donor Darah Bersama',
        description: 'Kegiatan sosial donor darah kampus...',
        category: 'Sosial',
        date: '10 Des 2026',
        location: 'Surabaya',
        points: 60,
        status: 'Nonaktif',
        icon: HandHeart,
    },
    {
        title: 'Workshop Daur Ulang',
        description: 'Pelatihan membuat barang kreatif...',
        category: 'Lingkungan',
        date: '20 Des 2026',
        location: 'Yogyakarta',
        points: 40,
        status: 'Aktif',
        icon: Recycle,
    },
    {
        title: 'Dapur Umum Bencana',
        description: 'Membantu memasak untuk relawan...',
        category: 'Sosial',
        date: '25 Des 2026',
        location: 'Semarang',
        points: 80,
        status: 'Draft',
        icon: Soup,
    },
];

function statusClass(status: string) {
    switch (status) {
        case 'Aktif':
            return 'bg-[#DDEEFF] text-[#1A8FE3]';
        case 'Draft':
            return 'bg-[#EEE9F5] text-[#766B8A]';
        case 'Selesai':
            return 'bg-[#FFE2E2] text-[#D11149]';
        case 'Nonaktif':
            return 'bg-[#E9E4F0] text-[#8B8496]';
        default:
            return 'bg-[#F0E7FF] text-[#6610F2]';
    }
}

export default function AdminEventIndex() {
    return (
        <>
            <Head title="Kelola Event" />

            <div className="space-y-6">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#1F1730]">
                            Kelola Event
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F5573] sm:text-base">
                            Buat, kelola, dan publikasikan event untuk komunitas
                            InCollab.
                        </p>
                    </div>

                    <Link
                        href="/admin/event/create"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_16px_30px_rgba(102,16,242,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#550DCC] hover:shadow-[0_20px_36px_rgba(102,16,242,0.30)]"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Event
                    </Link>
                </section>

                <section className="grid gap-5 md:grid-cols-3">
                    {summaryCards.map(
                        ({ label, value, icon: Icon, accent }) => (
                            <div
                                key={label}
                                className="flex items-center gap-4 rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6610F2]/30 hover:shadow-lg"
                            >
                                <span
                                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${accent}`}
                                >
                                    <Icon className="h-6 w-6" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-[#766B8A]">
                                        {label}
                                    </p>
                                    <p className="mt-1 text-3xl font-extrabold text-[#1F1730]">
                                        {value}
                                    </p>
                                </div>
                            </div>
                        ),
                    )}
                </section>

                <section className="flex flex-col gap-4 xl:flex-row xl:items-center">
                    <label className="relative block min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                        <input
                            type="text"
                            placeholder="Cari event..."
                            className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-4 pl-12 text-sm font-medium text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                        />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {['Semua Kategori', 'Semua Status'].map((label) => (
                            <button
                                key={label}
                                type="button"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#EFE4F8] bg-white px-5 text-sm font-semibold text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition hover:border-[#6610F2]/30 hover:bg-[#F7F1FF]"
                            >
                                {label}
                                <ChevronDown className="h-4 w-4 text-[#64748B]" />
                            </button>
                        ))}
                        <button
                            type="button"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#EFE4F8] bg-white px-5 text-sm font-semibold text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition hover:border-[#6610F2]/30 hover:bg-[#F7F1FF]"
                        >
                            <CalendarDays className="h-4 w-4 text-[#1F1730]" />
                            Pilih Tanggal
                        </button>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                    <div className="overflow-x-auto">
                        <div className="grid min-w-[1040px] grid-cols-[minmax(280px,1.6fr)_130px_130px_120px_90px_120px_100px] bg-[#F0E7FF] px-6 py-4 text-xs font-extrabold tracking-wide text-[#4F465F] uppercase">
                            <span>Event</span>
                            <span>Kategori</span>
                            <span>Tanggal</span>
                            <span>Lokasi</span>
                            <span>Poin</span>
                            <span>Status</span>
                            <span className="text-right">Action</span>
                        </div>

                        <div className="divide-y divide-[#EFE4F8]">
                            {events.map((event) => {
                                const Icon = event.icon;

                                return (
                                    <div
                                        key={event.title}
                                        className="grid min-w-[1040px] grid-cols-[minmax(280px,1.6fr)_130px_130px_120px_90px_120px_100px] items-center px-6 py-4 transition hover:bg-[#FBF7FF]"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0E7FF] text-[#766B8A]">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-base font-extrabold text-[#1F1730]">
                                                    {event.title}
                                                </p>
                                                <p className="mt-1 truncate text-xs font-semibold text-[#6F657F]">
                                                    {event.description}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-[#5F5573]">
                                            {event.category}
                                        </p>
                                        <p className="text-sm font-medium text-[#5F5573]">
                                            {event.date}
                                        </p>
                                        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5F5573]">
                                            <MapPin className="h-4 w-4 text-[#8B8496]" />
                                            {event.location}
                                        </p>
                                        <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E6A600]">
                                            <CircleDollarSign className="h-4 w-4" />
                                            {event.points}
                                        </p>
                                        <div>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${statusClass(
                                                    event.status,
                                                )}`}
                                            >
                                                {event.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-end gap-4 text-[#4F465F]">
                                            <button
                                                type="button"
                                                aria-label={`Lihat ${event.title}`}
                                                className="transition hover:text-[#6610F2]"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Edit ${event.title}`}
                                                className="transition hover:text-[#6610F2]"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#EFE4F8] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-[#766B8A]">
                            Menampilkan 1-6 dari 24 event
                        </p>
                        <div className="flex items-center gap-2">
                            {['Prev', '1', '2', '3', '...', 'Next'].map(
                                (item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        className={`h-9 rounded-lg border px-3 text-sm font-semibold transition ${
                                            item === '1'
                                                ? 'border-[#6610F2] bg-[#6610F2] text-white'
                                                : 'border-[#D8CDE8] bg-white text-[#766B8A] hover:border-[#6610F2]/40 hover:bg-[#F7F1FF]'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

AdminEventIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
