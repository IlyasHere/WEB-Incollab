import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    ExternalLink,
    Gift,
    FileUp,
    MapPin,
    ShieldAlert,
    UserRound,
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
    detail_poster_url: string | null;
    organizer: string | null;
    admin_name: string | null;
};

type EventDetailPageProps = {
    event: EventItem;
};

const categoryStyles: Record<string, string> = {
    Kompetisi: 'bg-[#E0F0FF] text-[#1976D2]',
    Workshop: 'bg-[#DDF7F0] text-[#11795B]',
    Seminar: 'bg-[#FFF0D9] text-[#9A5D00]',
    Hackathon: 'bg-[#EEE1FF] text-[#6A1B9A]',
};

function formatDateRange(startDate: string | null, endDate: string | null) {
    if (!startDate) {
        return 'Tanggal menyusul';
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    if (!endDate || endDate === startDate) {
        return formatter.format(new Date(startDate));
    }

    return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

function DetailImage({ event }: { event: EventItem }) {
    const source = event.detail_poster_url || event.poster_url;

    if (source) {
        return (
            <img
                src={source}
                alt={event.title}
                className="h-full w-full object-cover"
            />
        );
    }

    return (
        <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top,_rgba(82,174,255,0.24),_transparent_36%),linear-gradient(135deg,_#101828_0%,_#173A57_55%,_#0A1020_100%)] p-8 text-white">
            <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-white/65 uppercase">
                    InCollab Event
                </p>
                <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-bold">
                    {event.title}
                </h1>
            </div>
        </div>
    );
}

export default function EventDetailPage({ event }: EventDetailPageProps) {
    const badgeClass =
        categoryStyles[event.category ?? ''] ?? 'bg-[#EEF2FF] text-[#4338CA]';
    const registrationStatus =
        event.registration_status ?? event.status ?? 'Coming Soon';

    return (
        <>
            <Head title={event.title} />

            <main className="px-4 py-5 pb-16 sm:px-6 sm:py-6 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1120px]">
                    <div className="rounded-[34px] bg-[linear-gradient(135deg,_#F9F4FF_0%,_#FDFBFF_100%)] p-6 shadow-[0_24px_60px_rgba(124,58,237,0.08)] ring-1 ring-[#EFE4F8] sm:p-8">
                        <Link
                            href="/event"
                            className="inline-flex items-center gap-2 text-base font-medium text-[#5F576D] transition hover:text-[#6610F2]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Event
                        </Link>

                        <section className="mt-6 overflow-hidden rounded-[30px] bg-white shadow-[0_18px_45px_rgba(56,42,73,0.10)]">
                            <div className="relative h-[250px] overflow-hidden bg-[#EDE7F7] sm:h-[360px]">
                                <DetailImage event={event} />
                                <span
                                    className={`absolute top-5 left-5 rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}
                                >
                                    {event.category ?? 'Event'}
                                </span>
                            </div>

                            <div className="space-y-8 p-6 sm:p-8">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <h1 className="text-3xl leading-tight font-bold text-[#231A34] sm:text-4xl">
                                            {event.title}
                                        </h1>
                                        <p className="mt-3 text-lg leading-8 text-[#665B78]">
                                            {event.description ||
                                                'Detail event akan diumumkan lebih lanjut oleh admin.'}
                                        </p>
                                    </div>

                                    <div className="rounded-[24px] bg-[#FFF7ED] px-5 py-4 text-right">
                                        <p className="text-sm font-semibold tracking-[0.14em] text-[#EA580C] uppercase">
                                            Status Event
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-[#9A3412]">
                                            {registrationStatus}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                    <div className="rounded-[24px] border border-[#ECE1F8] bg-[#FCFAFF] p-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3EAFF] text-[#6610F2]">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold tracking-[0.14em] text-[#7E7295] uppercase">
                                            Tanggal
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-[#2A203B]">
                                            {formatDateRange(
                                                event.date,
                                                event.end_date,
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-[24px] border border-[#ECE1F8] bg-[#FCFAFF] p-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F4FF] text-[#1976D2]">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold tracking-[0.14em] text-[#7E7295] uppercase">
                                            Lokasi
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-[#2A203B]">
                                            {event.location ??
                                                'Lokasi menyusul'}
                                        </p>
                                    </div>

                                    <div className="rounded-[24px] border border-[#ECE1F8] bg-[#FCFAFF] p-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF8EF] text-[#1E7A38]">
                                            <UserRound className="h-5 w-5" />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold tracking-[0.14em] text-[#7E7295] uppercase">
                                            Penyelenggara
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-[#2A203B]">
                                            {event.organizer ??
                                                'InCollab Admin'}
                                        </p>
                                    </div>

                                    <div className="rounded-[24px] border border-[#F6E1A6] bg-[#FFFDF7] p-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3CD] text-[#C58A00]">
                                            <Gift className="h-5 w-5" />
                                        </div>
                                        <p className="mt-4 text-sm font-semibold tracking-[0.14em] text-[#7E7295] uppercase">
                                            Total Poin
                                        </p>
                                        <p className="mt-2 text-lg font-bold text-[#2A203B]">
                                            {event.points} poin
                                        </p>
                                    </div>
                                </div>

                                <section className="rounded-[28px] border border-[#ECE1F8] bg-white">
                                    <div className="border-b border-[#ECE1F8] px-6 py-4">
                                        <h2 className="text-xl font-bold text-[#251B36]">
                                            Deskripsi
                                        </h2>
                                    </div>

                                    <div className="space-y-6 px-6 py-6 text-[17px] leading-8 text-[#5E556E]">
                                        <p>
                                            {event.description ||
                                                'Belum ada deskripsi tambahan untuk event ini.'}
                                        </p>

                                        <div className="rounded-[24px] bg-[#F5EEFF] p-5 text-sm leading-7 text-[#5E4E78]">
                                            <div className="flex items-start gap-3">
                                                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#6610F2]" />
                                                <p>
                                                    Pastikan membaca seluruh
                                                    informasi event sebelum
                                                    mendaftar. Jika ada
                                                    perubahan jadwal atau
                                                    teknis, admin akan
                                                    memperbarui detail event
                                                    ini.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-[linear-gradient(135deg,_#F9F2FF_0%,_#FFFFFF_100%)] p-6 ring-1 ring-[#EEE3FA]">
                                    <div>
                                        <p className="text-sm font-semibold tracking-[0.16em] text-[#7C3AED] uppercase">
                                            Pendaftaran
                                        </p>
                                        <p className="mt-2 text-base text-[#635875]">
                                            {registrationStatus === 'Open'
                                                ? 'Gunakan tombol di samping untuk membuka laman pendaftaran event.'
                                                : registrationStatus ===
                                                    'Closed'
                                                  ? 'Pendaftaran event ini sudah ditutup oleh admin.'
                                                  : 'Link pendaftaran akan dibuka saat admin mengubah status registrasi ke Open.'}
                                        </p>
                                    </div>

                                    {registrationStatus === 'Open' &&
                                    event.registration_url ? (
                                        <a
                                            href={event.registration_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 rounded-2xl bg-[#6610F2] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(102,16,242,0.20)]"
                                        >
                                            Daftar Sekarang
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    ) : (
                                        <span className="inline-flex items-center rounded-2xl bg-[#F1E8FF] px-6 py-3 text-sm font-semibold text-[#7C3AED]">
                                            {registrationStatus === 'Closed'
                                                ? 'Pendaftaran ditutup'
                                                : 'Link pendaftaran menyusul'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[#E7DBF8] bg-white p-6">
                                    <div>
                                        <p className="text-sm font-semibold tracking-[0.16em] text-[#6610F2] uppercase">
                                            Klaim Poin
                                        </p>
                                        <p className="mt-2 text-base text-[#635875]">
                                            Setelah mengikuti event, upload
                                            sertifikat atau bukti keikutsertaan
                                            untuk diverifikasi admin.
                                        </p>
                                    </div>

                                    <Link
                                        href="/klaim-poin-event"
                                        className="inline-flex items-center gap-2 rounded-2xl bg-[#6610F2] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(102,16,242,0.20)]"
                                    >
                                        Ajukan Klaim
                                        <FileUp className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </>
    );
}

EventDetailPage.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
