import { Link, router } from '@inertiajs/react';
import { Bookmark, CalendarDays, MapPin, ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

export type EventItem = {
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
    isBookmarked: boolean;
};

export const categoryStyles: Record<string, string> = {
    Kompetisi: 'bg-[#E0F0FF] text-[#1976D2]',
    Workshop: 'bg-[#DDF7F0] text-[#11795B]',
    Seminar: 'bg-[#FFF0D9] text-[#9A5D00]',
    Hackathon: 'bg-[#EEE1FF] text-[#6A1B9A]',
};

export function formatDate(date: string | null) {
    if (!date) return 'Tanggal menyusul';

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatShortMonth(date: string | null) {
    if (!date) return { month: 'TBD', day: '--' };

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

export function formatDateRange(startDate: string | null, endDate: string | null) {
    if (!startDate) return 'Tanggal menyusul';

    if (!endDate || endDate === startDate) return formatDate(startDate);

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

function EventPoster({
    event,
    onToggleBookmark,
}: {
    event: EventItem;
    onToggleBookmark?: (id: number, current: boolean) => void;
}) {
    if (event.poster_url) {
        return (
            <div className="relative h-full w-full">
                <img
                    src={event.poster_url}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (onToggleBookmark) {
                            onToggleBookmark(event.id, event.isBookmarked);
                            return;
                        }

                        if (event.isBookmarked) {
                            router.delete(`/event/${event.id}/bookmark`);
                        } else {
                            router.post(`/event/${event.id}/bookmark`);
                        }
                    }}
                    className={`absolute top-3 left-3 rounded-full p-2 shadow-md transition ${
                        event.isBookmarked ? 'bg-[#6610F2]' : 'bg-white/90'
                    }`}
                >
                    <Bookmark
                        className={`h-5 w-5 ${
                            event.isBookmarked ? 'text-white' : 'text-[#6610F2]'
                        }`}
                    />
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full items-end bg-[radial-gradient(circle_at_top_left,_rgba(167,139,250,0.55),_transparent_42%),linear-gradient(135deg,_#1D1A39_0%,_#273A5B_55%,_#3D2D72_100%)] p-6 text-white transition-transform duration-500 ease-out group-hover:scale-105">
            <div>
                <p className="text-xs font-semibold tracking-[0.24em] text-white/70 uppercase">InCollab Event</p>
                <h3 className="mt-3 max-w-[220px] text-2xl leading-tight font-bold">{event.title}</h3>
            </div>
        </div>
    );
}

export function EventCard({
    event,
    onToggleBookmark,
}: {
    event: EventItem;
    onToggleBookmark?: (id: number, current: boolean) => void;
}) {
    const badgeClass = categoryStyles[event.category ?? ''] ?? 'bg-[#EEF2FF] text-[#4338CA]';

    return (
        <article className="group overflow-hidden rounded-[28px] border border-[#ECE1F8] bg-white shadow-[0_24px_50px_rgba(97,62,155,0.10)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#B794F6] hover:shadow-[0_30px_64px_rgba(97,62,155,0.18)]">
            <div className="relative h-60 overflow-hidden bg-[#EDE7F7]">
                <EventPoster event={event} onToggleBookmark={onToggleBookmark} />
                <span className={`absolute top-5 right-5 rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`}>{event.category ?? 'Event'}</span>
            </div>

            <div className="space-y-5 p-6">
                <div>
                    <h2 className="text-[30px] leading-tight font-bold text-[#241B35]">{event.title}</h2>
                    <p className="mt-3 text-lg leading-8 text-[#655B78]">{event.organizer ?? 'Penyelenggara belum diisi'}</p>
                </div>

                <div className="space-y-3 text-[17px] text-[#534967]">
                    <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 h-5 w-5 text-[#7C3AED]" />
                        <span>{formatDateRange(event.date, event.end_date)}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-[#7C3AED]" />
                        <span>{event.location ?? 'Lokasi menyusul'}</span>
                    </div>
                </div>

                <p className="border-t border-[#EFE7F8] pt-5 text-base leading-7 text-[#6B617C]">
                    {event.description || 'Detail event akan diumumkan lebih lanjut oleh admin.'}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-full bg-[#F6F0FF] px-4 py-2 text-sm font-semibold text-[#6610F2]">{event.points} poin</div>
                        <div className="rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#1D4ED8]">{event.registration_status ?? event.status ?? 'Coming Soon'}</div>
                    </div>

                    {event.poster_url || event.detail_poster_url ? (
                        <Link
                            href={`/event/${event.id}`}
                            className="inline-flex items-center justify-center rounded-2xl border border-[#7C3AED] px-5 py-3 text-sm font-semibold text-[#7C3AED] transition hover:bg-[#F7F1FF] group-hover:bg-[#6610F2] group-hover:text-white"
                        >
                            Lihat Detail
                        </Link>
                    ) : (
                        <span className="inline-flex items-center justify-center rounded-2xl border border-[#E7DDFC] px-5 py-3 text-sm font-semibold text-[#9C8EB7]">Info menyusul</span>
                    )}
                </div>
            </div>
        </article>
    );
}

export default EventCard;
