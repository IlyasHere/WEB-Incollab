import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    FileUp,
    LayoutGrid,
    MapPin,
    Search,
    ShieldCheck,
    X,
} from 'lucide-react';
import EventCard, {
    EventItem,
    formatDateRange,
    formatShortMonth,
    categoryStyles,
} from '@/components/EventCard';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

type EventPageProps = {
    categories: string[];
    filters: {
        category: string;
        view: 'list' | 'calendar';
        search: string;
    };
    events: EventItem[];
    canManage: boolean;
};

function buildQuery(category: string, view: 'list' | 'calendar', search = '') {
    const params = new URLSearchParams();

    if (category !== 'Semua') {
        params.set('category', category);
    }

    if (view !== 'list') {
        params.set('view', view);
    }

    if (search.trim() !== '') {
        params.set('search', search.trim());
    }

    const query = params.toString();

    return query ? `/event?${query}` : '/event';
}

function CalendarEventRow({ event }: { event: EventItem }) {
    const badgeClass =
        categoryStyles[event.category ?? ''] ?? 'bg-[#EEF2FF] text-[#4338CA]';
    const { month, day } = formatShortMonth(event.date);

    return (
        <article className="group flex flex-col gap-5 rounded-[26px] border border-[#EBDDFA] bg-white p-5 shadow-[0_22px_48px_rgba(96,66,145,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#B794F6] hover:shadow-[0_28px_58px_rgba(96,66,145,0.16)] sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-4 sm:max-w-[170px]">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl bg-[#F3EAFF] text-[#6610F2]">
                    <span className="text-sm font-bold tracking-[0.18em]">{month}</span>
                    <span className="text-[28px] leading-none font-extrabold">{day}</span>
                </div>

                <div className="sm:hidden">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>{event.category ?? 'Event'}</span>
                </div>
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-[#221A32]">{event.title}</h2>
                    <span className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${badgeClass}`}>{event.category ?? 'Event'}</span>
                </div>

                <p className="mt-2 text-base text-[#6C617D]">{event.organizer ?? 'Penyelenggara belum diisi'}</p>

                <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#61566F]">
                    <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#7C3AED]" />
                        <span>{formatDateRange(event.date, event.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#7C3AED]" />
                        <span>{event.location ?? 'Lokasi menyusul'}</span>
                    </div>
                </div>
            </div>

            <div className="flex w-full shrink-0 justify-end sm:w-auto">
                {event.poster_url || event.detail_poster_url ? (
                    <Link href={`/event/${event.id}`} className="inline-flex items-center gap-2 rounded-2xl bg-[#6610F2] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(102,16,242,0.20)] transition group-hover:shadow-[0_22px_38px_rgba(102,16,242,0.30)]">
                        Lihat Detail
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                ) : (
                    <span className="inline-flex items-center rounded-2xl bg-[#F3EAFF] px-5 py-3 text-sm font-semibold text-[#7C3AED]">Segera tersedia</span>
                )}
            </div>
        </article>
    );
}

function SidebarPanel({ canManage }: { canManage: boolean }) {
    return (
        <aside className="space-y-6 xl:sticky xl:top-24">
            <section className="rounded-[28px] border border-[#ECE1F8] bg-white p-6 shadow-[0_22px_48px_rgba(96,66,145,0.08)]">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[28px] font-bold text-[#241B35]">Klaim Poin</h2>
                    <FileUp className="h-6 w-6 text-[#7C3AED]" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6B617C]">Sudah ikut event? Upload sertifikat di sini. Poin hanya masuk setelah bukti disetujui admin.</p>

                <div className="mt-6 rounded-3xl bg-[#FCF9FF] p-5 text-sm leading-7 text-[#6B617C]">
                    <p>Masukkan nama event, tanggal mengikuti, dan upload bukti sertifikat melalui formulir klaim.</p>
                    <Link href="/klaim-poin-event" className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#6610F2] px-5 py-2.5 text-sm font-semibold text-white">Isi Form Klaim</Link>
                </div>
            </section>

            {canManage && (
                <section className="rounded-[28px] border border-[#E6D8FF] bg-[linear-gradient(135deg,_#FBF7FF_0%,_#F3EAFF_100%)] p-6 shadow-[0_18px_40px_rgba(124,58,237,0.10)]">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6610F2] shadow-[0_12px_28px_rgba(102,16,242,0.14)]">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-[0.16em] text-[#6610F2] uppercase">Admin Access</p>
                            <h3 className="mt-2 text-xl font-bold text-[#281A3D]">Card event diisi dari panel admin</h3>
                            <p className="mt-3 text-sm leading-7 text-[#61566F]">Kamu sedang login sebagai admin, jadi bisa langsung menambah event baru dari halaman kelola.</p>
                        </div>
                    </div>

                    <Link href="/admin/event" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#6610F2] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(102,16,242,0.20)]">Kelola Event<ArrowRight className="h-4 w-4" /></Link>
                </section>
            )}
        </aside>
    );
}

export default function EventPage({ categories, filters, events, canManage, }: EventPageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const hasSearch = filters.search.trim() !== '';

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.get(
            '/event',
            {
                ...(filters.category !== 'Semua' ? { category: filters.category } : {}),
                ...(filters.view !== 'list' ? { view: filters.view } : {}),
                ...(search.trim() !== '' ? { search: search.trim() } : {}),
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <>
            <Head title="Event" />

            <main className="px-4 py-5 pb-16 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1460px]">
                    <section className="rounded-[36px] bg-[linear-gradient(120deg,_rgba(255,255,255,0.98)_0%,_rgba(248,241,255,0.98)_55%,_rgba(255,255,255,0.98)_100%)] p-6 shadow-[0_24px_60px_rgba(124,58,237,0.08)] ring-1 ring-[#F0E7FA] sm:p-8 xl:p-10">
                        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                            <div>
                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="max-w-3xl">
                                        <p className="text-sm font-bold tracking-[0.28em] text-[#7C3AED] uppercase">InCollab Event Hub</p>
                                        <h1 className="mt-4 text-[44px] leading-none font-bold text-[#241B35] sm:text-[54px]">Event</h1>
                                        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#665C79]">Temukan kompetisi, workshop, seminar, dan hackathon terbaru di satu halaman. Semua kartu event di bawah ini akan diinput dan dikelola oleh admin.</p>
                                    </div>

                                    <div className="inline-flex rounded-[24px] border border-[#E7DBF8] bg-[#F4ECFE] p-2">
                                        <Link href={buildQuery(filters.category, 'list', filters.search)} className={`inline-flex items-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition ${filters.view === 'list' ? 'bg-[#6610F2] text-white shadow-[0_16px_30px_rgba(102,16,242,0.22)]' : 'text-[#665C79]'}`}>
                                            <LayoutGrid className="h-4 w-4" />
                                            Daftar
                                        </Link>
                                        <Link href={buildQuery(filters.category, 'calendar', filters.search)} className={`inline-flex items-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition ${filters.view === 'calendar' ? 'bg-[#6610F2] text-white shadow-[0_16px_30px_rgba(102,16,242,0.22)]' : 'text-[#665C79]'}`}>
                                            <CalendarDays className="h-4 w-4" />
                                            Kalender
                                        </Link>
                                    </div>
                                </div>

                                <form onSubmit={submitSearch} className="mt-8 flex flex-col gap-3 rounded-[24px] border border-[#E7DBF8] bg-white p-3 shadow-[0_16px_36px_rgba(111,76,168,0.08)] sm:flex-row sm:items-center">
                                    <div className="relative min-w-0 flex-1">
                                        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8A7FA2]" />
                                        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari event, kategori, lokasi, penyelenggara, tanggal, status, atau poin..." className="h-12 w-full rounded-[18px] border border-[#EADCF8] bg-[#FBF7FF] pr-4 pl-12 text-sm font-medium text-[#382A49] outline-none transition placeholder:text-[#9B8FB3] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10" />
                                    </div>

                                    {hasSearch && (
                                        <Link href={buildQuery(filters.category, filters.view)} className="inline-flex h-12 items-center justify-center gap-2 rounded-[16px] border border-[#D8CDE8] px-4 text-sm font-semibold text-[#766B8A] transition hover:border-[#7C3AED] hover:text-[#6610F2]">
                                            <X className="h-4 w-4" />
                                            Reset
                                        </Link>
                                    )}

                                    <button type="submit" className="inline-flex h-12 items-center justify-center rounded-[16px] bg-[#6610F2] px-6 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(102,16,242,0.20)] transition hover:bg-[#5710C9]">Cari</button>
                                </form>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {categories.map((category) => (
                                        <Link key={category} href={buildQuery(category, filters.view, filters.search)} className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${filters.category === category ? 'border-[#6610F2] bg-[#6610F2] text-white shadow-[0_16px_30px_rgba(102,16,242,0.20)]' : 'border-[#D5C0F7] bg-white text-[#2F6FB5] hover:border-[#7C3AED] hover:text-[#7C3AED]'}`}>{category}</Link>
                                    ))}
                                </div>

                                <div id="daftar-event" className="mt-10">
                                    {events.length > 0 ? (
                                        filters.view === 'list' ? (
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {events.map((event) => (
                                                    <EventCard key={event.id} event={event} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-5">
                                                {events.map((event) => (
                                                    <CalendarEventRow key={event.id} event={event} />
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <div className="rounded-[28px] border border-dashed border-[#DCCBFA] bg-white/80 p-8 text-center shadow-[0_18px_40px_rgba(111,76,168,0.06)]">
                                            <p className="text-sm font-bold tracking-[0.18em] text-[#7C3AED] uppercase">{hasSearch ? 'Event Tidak Ditemukan' : 'Belum Ada Event'}</p>
                                            <h2 className="mt-3 text-2xl font-bold text-[#241B35]">{hasSearch ? `Tidak ada event yang cocok dengan "${filters.search}"` : 'Admin belum menambahkan event untuk kategori ini'}</h2>
                                            <p className="mt-3 text-base leading-7 text-[#685E79]">{hasSearch ? 'Coba pakai kata kunci lain seperti nama event, kategori, lokasi, penyelenggara, status, tanggal, atau jumlah poin.' : 'Begitu admin membuat card event dari panel admin, daftar ini akan otomatis terisi.'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <SidebarPanel canManage={canManage} />
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

EventPage.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);