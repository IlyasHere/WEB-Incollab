import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    FileUp,
    LayoutGrid,
    MapPin,
    ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

type EventItem = {
    id: number;
    title: string;
    description: string | null;
    date: string | null;
    end_date: string | null;
    location: string | null;
    category: string | null;
    points: number;
    registration_url: string | null;
    status: string | null;
    visibility_status?: string | null;
    registration_status?: string | null;
    poster_url: string | null;
    detail_poster_url?: string | null;
    organizer: string | null;
    admin_name: string | null;
};

type EventPageProps = {
    categories: string[];
    filters: {
        category: string;
        view: 'list' | 'calendar';
    };
    events: EventItem[];
    canManage: boolean;
};

const categoryStyles: Record<string, string> = {
    Kompetisi: 'bg-[#E0F0FF] text-[#1976D2]',
    Workshop: 'bg-[#DDF7F0] text-[#11795B]',
    Seminar: 'bg-[#FFF0D9] text-[#9A5D00]',
    Hackathon: 'bg-[#EEE1FF] text-[#6A1B9A]',
};

function formatDate(date: string | null) {
    if (!date) {
        return 'Tanggal menyusul';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

function formatShortMonth(date: string | null) {
    if (!date) {
        return { month: 'TBD', day: '--' };
    }

    const parsed = new Date(date);

    return {
        month: new Intl.DateTimeFormat('id-ID', { month: 'short' })
            .format(parsed)
            .toUpperCase(),
        day: new Intl.DateTimeFormat('id-ID', { day: '2-digit' }).format(
            parsed,
        ),
    };
}

function formatDateRange(startDate: string | null, endDate: string | null) {
    if (!startDate) {
        return 'Tanggal menyusul';
    }

    if (!endDate || endDate === startDate) {
        return formatDate(startDate);
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function buildQuery(category: string, view: 'list' | 'calendar') {
    const params = new URLSearchParams();

    if (category !== 'Semua') {
        params.set('category', category);
    }

    if (view !== 'list') {
        params.set('view', view);
    }

    const query = params.toString();

    return query ? `/event?${query}` : '/event';
}

function EventPoster({ event }: { event: EventItem }) {
    if (event.poster_url) {
        return (
            <img
                src={event.poster_url}
                alt={event.title}
                className="h-full w-full object-cover"
            />
        );
    }

    return (
        <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.55),_transparent_42%),linear-gradient(135deg,_#1D1A39_0%,_#273A5B_55%,_#3D2D72_100%)] p-6 text-white">
            <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-white/70 uppercase">
                    InCollab Event
                </p>
                <h3 className="mt-3 max-w-[220px] text-2xl leading-tight font-bold">
                    {event.title}
                </h3>
            </div>
        </div>
    );
}

function EventCard({ event }: { event: EventItem }) {
    const badgeClass =
        categoryStyles[event.category ?? ''] ?? 'bg-[#EEF2FF] text-[#4338CA]';

    return (
        <article className="overflow-hidden rounded-[28px] border border-[#ECE1F8] bg-white shadow-[0_24px_50px_rgba(97,62,155,0.10)]">
            <div className="relative h-60 overflow-hidden bg-[#EDE7F7]">
                <EventPoster event={event} />
                <span
                    className={`absolute top-5 right-5 rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}
                >
                    {event.category ?? 'Event'}
                </span>
            </div>

            <div className="space-y-5 p-6">
                <div>
                    <h2 className="text-[30px] leading-tight font-bold text-[#241B35]">
                        {event.title}
                    </h2>
                    <p className="mt-3 text-lg leading-8 text-[#655B78]">
                        {event.organizer ?? 'Penyelenggara belum diisi'}
                    </p>
                </div>

                <div className="space-y-3 text-[17px] text-[#534967]">
                    <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-5 w-5 text-[#7C3AED]" />
                        <span>
                            {formatDateRange(event.date, event.end_date)}
                        </span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-[#7C3AED]" />
                        <span>{event.location ?? 'Lokasi menyusul'}</span>
                    </div>
                </div>

                <p className="border-t border-[#EFE7F8] pt-5 text-base leading-7 text-[#6B617C]">
                    {event.description ||
                        'Detail event akan diumumkan lebih lanjut oleh admin.'}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-full bg-[#F6F0FF] px-4 py-2 text-sm font-semibold text-[#6610F2]">
                            {event.points} poin
                        </div>
                        <div className="rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8]">
                            {event.registration_status ??
                                event.status ??
                                'Coming Soon'}
                        </div>
                    </div>

                    {event.poster_url || event.detail_poster_url ? (
                        <Link
                            href={`/event/${event.id}`}
                            className="inline-flex items-center justify-center rounded-2xl border border-[#7C3AED] px-5 py-3 text-sm font-semibold text-[#7C3AED] transition hover:bg-[#F7F1FF]"
                        >
                            Lihat Detail
                        </Link>
                    ) : (
                        <span className="inline-flex items-center justify-center rounded-2xl border border-[#E7DDFC] px-5 py-3 text-sm font-semibold text-[#9C8EB7]">
                            Info menyusul
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

function CalendarEventRow({ event }: { event: EventItem }) {
    const badgeClass =
        categoryStyles[event.category ?? ''] ?? 'bg-[#EEF2FF] text-[#4338CA]';
    const { month, day } = formatShortMonth(event.date);

    return (
        <article className="flex flex-col gap-5 rounded-[26px] border border-[#EBDDFA] bg-white p-5 shadow-[0_22px_48px_rgba(96,66,145,0.08)] sm:flex-row sm:items-center">
            <div className="flex w-full items-center gap-4 sm:max-w-[170px]">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl bg-[#F3EAFF] text-[#6610F2]">
                    <span className="text-sm font-bold tracking-[0.18em]">
                        {month}
                    </span>
                    <span className="text-[28px] leading-none font-extrabold">
                        {day}
                    </span>
                </div>

                <div className="sm:hidden">
                    <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                    >
                        {event.category ?? 'Event'}
                    </span>
                </div>
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-[#221A32]">
                        {event.title}
                    </h2>
                    <span
                        className={`hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${badgeClass}`}
                    >
                        {event.category ?? 'Event'}
                    </span>
                </div>

                <p className="mt-2 text-base text-[#6C617D]">
                    {event.organizer ?? 'Penyelenggara belum diisi'}
                </p>

                <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#61566F]">
                    <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 text-[#7C3AED]" />
                        <span>
                            {formatDateRange(event.date, event.end_date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#7C3AED]" />
                        <span>{event.location ?? 'Lokasi menyusul'}</span>
                    </div>
                </div>
            </div>

            <div className="flex w-full shrink-0 justify-end sm:w-auto">
                {event.poster_url || event.detail_poster_url ? (
                    <Link
                        href={`/event/${event.id}`}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#6610F2] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(102,16,242,0.20)]"
                    >
                        Lihat Detail
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span className="inline-flex items-center rounded-2xl bg-[#F3EAFF] px-5 py-3 text-sm font-semibold text-[#7C3AED]">
                        Segera tersedia
                    </span>
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
                    <h2 className="text-[28px] font-bold text-[#241B35]">
                        Klaim Poin
                    </h2>
                    <FileUp className="h-6 w-6 text-[#7C3AED]" />
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6B617C]">
                    Sudah ikut event? Upload sertifikat di sini. Poin hanya
                    masuk setelah bukti disetujui admin.
                </p>

                <div className="mt-6 rounded-3xl bg-[#FCF9FF] p-5 text-sm leading-7 text-[#6B617C]">
                    <p>
                        Masukkan nama event, tanggal mengikuti, dan upload bukti
                        sertifikat melalui formulir klaim.
                    </p>
                    <Link
                        href="/klaim-poin-event"
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#6610F2] px-5 py-2.5 text-sm font-semibold text-white"
                    >
                        Isi Form Klaim
                    </Link>
                </div>
            </section>

            {canManage && (
                <section className="rounded-[28px] border border-[#E6D8FF] bg-[linear-gradient(135deg,_#FBF7FF_0%,_#F3EAFF_100%)] p-6 shadow-[0_18px_40px_rgba(124,58,237,0.10)]">
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6610F2] shadow-[0_12px_28px_rgba(102,16,242,0.14)]">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-[0.16em] text-[#6610F2] uppercase">
                                Admin Access
                            </p>
                            <h3 className="mt-2 text-xl font-bold text-[#281A3D]">
                                Card event diisi dari panel admin
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-[#61566F]">
                                Kamu sedang login sebagai admin, jadi bisa
                                langsung menambah event baru dari halaman
                                kelola.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/admin/event"
                        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#6610F2] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(102,16,242,0.20)]"
                    >
                        Kelola Event
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </section>
            )}
        </aside>
    );
}

export default function EventPage({
    categories,
    filters,
    events,
    canManage,
}: EventPageProps) {
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
                                        <p className="text-sm font-bold tracking-[0.28em] text-[#7C3AED] uppercase">
                                            InCollab Event Hub
                                        </p>
                                        <h1 className="mt-4 text-[44px] leading-none font-bold text-[#241B35] sm:text-[54px]">
                                            Event
                                        </h1>
                                        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#665C79]">
                                            Temukan kompetisi, workshop,
                                            seminar, dan hackathon terbaru di
                                            satu halaman. Semua kartu event di
                                            bawah ini akan diinput dan dikelola
                                            oleh admin.
                                        </p>
                                    </div>

                                    <div className="inline-flex rounded-[24px] border border-[#E7DBF8] bg-[#F4ECFE] p-2">
                                        <Link
                                            href={buildQuery(
                                                filters.category,
                                                'list',
                                            )}
                                            className={`inline-flex items-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition ${
                                                filters.view === 'list'
                                                    ? 'bg-[#6610F2] text-white shadow-[0_16px_30px_rgba(102,16,242,0.22)]'
                                                    : 'text-[#665C79]'
                                            }`}
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                            Daftar
                                        </Link>
                                        <Link
                                            href={buildQuery(
                                                filters.category,
                                                'calendar',
                                            )}
                                            className={`inline-flex items-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold transition ${
                                                filters.view === 'calendar'
                                                    ? 'bg-[#6610F2] text-white shadow-[0_16px_30px_rgba(102,16,242,0.22)]'
                                                    : 'text-[#665C79]'
                                            }`}
                                        >
                                            <CalendarDays className="h-4 w-4" />
                                            Kalender
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    {categories.map((category) => (
                                        <Link
                                            key={category}
                                            href={buildQuery(
                                                category,
                                                filters.view,
                                            )}
                                            className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                                                filters.category === category
                                                    ? 'border-[#6610F2] bg-[#6610F2] text-white shadow-[0_16px_30px_rgba(102,16,242,0.20)]'
                                                    : 'border-[#D5C0F7] bg-white text-[#2F6FB5] hover:border-[#7C3AED] hover:text-[#7C3AED]'
                                            }`}
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>

                                <div id="daftar-event" className="mt-10">
                                    {events.length > 0 ? (
                                        filters.view === 'list' ? (
                                            <div className="grid gap-6 md:grid-cols-2">
                                                {events.map((event) => (
                                                    <EventCard
                                                        key={event.id}
                                                        event={event}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-5">
                                                {events.map((event) => (
                                                    <CalendarEventRow
                                                        key={event.id}
                                                        event={event}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <div className="rounded-[28px] border border-dashed border-[#DCCBFA] bg-white/80 p-8 text-center shadow-[0_18px_40px_rgba(111,76,168,0.06)]">
                                            <p className="text-sm font-bold tracking-[0.18em] text-[#7C3AED] uppercase">
                                                Belum Ada Event
                                            </p>
                                            <h2 className="mt-3 text-2xl font-bold text-[#241B35]">
                                                Admin belum menambahkan event
                                                untuk kategori ini
                                            </h2>
                                            <p className="mt-3 text-base leading-7 text-[#685E79]">
                                                Begitu admin membuat card event
                                                dari panel admin, daftar ini
                                                akan otomatis terisi.
                                            </p>
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
