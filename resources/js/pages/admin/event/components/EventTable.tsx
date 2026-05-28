import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import type { EventFilters, EventItem, EventsPage } from '../types';
import { formatDateRange, hasActiveFilter, pageHref } from '../utils';

function EmptyEventState({ hasFilter }: { hasFilter: boolean }) {
    return (
        <div className="flex min-h-[250px] items-center justify-center px-6 py-14 text-center">
            <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2] shadow-[0_16px_32px_rgba(102,16,242,0.16)]">
                    {hasFilter ? 'F' : 'E'}
                </div>
                <h2 className="mt-5 text-lg font-extrabold text-[#1F1730]">
                    {hasFilter ? 'Event tidak ditemukan' : 'Belum ada event'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                    {hasFilter
                        ? 'Coba ubah kata kunci, kategori, visibility, atau status registrasi untuk menemukan event yang kamu cari.'
                        : 'Tambahkan event pertama supaya admin bisa mulai mengelola daftar event.'}
                </p>
            </div>
        </div>
    );
}

function Pagination({
    currentPage,
    lastPage,
    filters,
}: {
    currentPage: number;
    lastPage: number;
    filters: EventFilters;
}) {
    const pages = Array.from({ length: Math.min(lastPage, 3) }, (_, index) =>
        String(index + 1),
    );

    if (lastPage > 4) {
        pages.push('...', String(lastPage));
    } else if (lastPage === 4) {
        pages.push('4');
    }

    return (
        <div className="flex items-center gap-2">
            <a
                href={pageHref(Math.max(currentPage - 1, 1), filters)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766B8A] transition hover:bg-[#F7F1FF]"
                aria-label="Halaman sebelumnya"
            >
                <ChevronLeft className="h-4 w-4" />
            </a>
            {pages.map((page) =>
                page === '...' ? (
                    <span
                        key="ellipsis"
                        className="flex h-9 min-w-9 items-center justify-center px-2 text-sm font-bold text-[#382A49]"
                    >
                        ...
                    </span>
                ) : (
                    <a
                        key={page}
                        href={pageHref(Number(page), filters)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-bold transition ${
                            Number(page) === currentPage
                                ? 'bg-[#6610F2] text-white shadow-[0_10px_18px_rgba(102,16,242,0.22)]'
                                : 'text-[#382A49] hover:bg-[#F7F1FF]'
                        }`}
                    >
                        {page}
                    </a>
                ),
            )}
            <a
                href={pageHref(
                    Math.min(currentPage + 1, lastPage || 1),
                    filters,
                )}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766B8A] transition hover:bg-[#F7F1FF]"
                aria-label="Halaman berikutnya"
            >
                <ChevronRight className="h-4 w-4" />
            </a>
        </div>
    );
}

function EventRow({
    event,
    onDelete,
}: {
    event: EventItem;
    onDelete: (event: EventItem) => void;
}) {
    return (
        <div className="grid min-w-[1280px] grid-cols-[90px_minmax(240px,1.4fr)_140px_150px_160px_140px_160px_120px] items-center px-6 py-4 transition hover:bg-[#FBF7FF]">
            <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#F0E7FF]">
                {event.poster_url ? (
                    <img
                        src={event.poster_url}
                        alt={event.title}
                        className="h-full w-full object-cover"
                    />
                ) : null}
            </div>

            <div className="min-w-0">
                <p className="truncate text-base font-extrabold text-[#1F1730]">
                    {event.title}
                </p>
                <p className="mt-1 text-xs font-semibold text-[#6F657F]">
                    EVT-{String(event.id).padStart(3, '0')} •{' '}
                    {event.organizer ?? 'Penyelenggara'}
                </p>
            </div>

            <p className="text-sm font-medium text-[#5F5573]">
                {event.category ?? '-'}
            </p>
            <p className="text-sm font-medium text-[#5F5573]">
                {formatDateRange(event.date, event.end_date)}
            </p>
            <p className="text-sm font-medium text-[#5F5573]">
                {event.location ?? 'Belum diisi'}
            </p>
            <div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                        event.visibility_status === 'Published'
                            ? 'bg-[#EAF8EF] text-[#1E7A38]'
                            : 'bg-[#FFF4D6] text-[#A77800]'
                    }`}
                >
                    {event.visibility_status ?? 'Draft'}
                </span>
            </div>
            <div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
                        event.registration_status === 'Open'
                            ? 'bg-[#EAF1FF] text-[#1D4ED8]'
                            : event.registration_status === 'Closed'
                              ? 'bg-[#FFE4E6] text-[#BE123C]'
                              : 'bg-[#F7F1FF] text-[#6610F2]'
                    }`}
                >
                    {event.registration_status ?? event.status ?? 'Coming Soon'}
                </span>
            </div>
            <div className="flex justify-end gap-4 text-[#4F465F]">
                <Link
                    href={`/admin/event/${event.id}/edit`}
                    aria-label={`Edit ${event.title}`}
                    className="transition hover:text-[#6610F2]"
                >
                    <Pencil className="h-5 w-5" />
                </Link>
                <button
                    type="button"
                    aria-label={`Hapus ${event.title}`}
                    onClick={() => onDelete(event)}
                    className="transition hover:text-[#D11149]"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

export function EventTable({
    events,
    filters,
    isFiltering,
    onDelete,
}: {
    events: EventsPage;
    filters: EventFilters;
    isFiltering: boolean;
    onDelete: (event: EventItem) => void;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
            {isFiltering && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                    <div className="rounded-2xl border border-[#EFE4F8] bg-white px-5 py-4 text-sm font-bold text-[#382A49] shadow-[0_18px_45px_rgba(102,16,242,0.14)]">
                        Menyaring event...
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <div className="grid min-w-[1280px] grid-cols-[90px_minmax(240px,1.4fr)_140px_150px_160px_140px_160px_120px] bg-[#F0E7FF] px-6 py-4 text-xs font-extrabold tracking-wide text-[#4F465F] uppercase">
                    <span>Poster</span>
                    <span>Event</span>
                    <span>Kategori</span>
                    <span>Tanggal</span>
                    <span>Lokasi</span>
                    <span>Visibility</span>
                    <span>Status Registrasi</span>
                    <span className="text-right">Action</span>
                </div>

                <div className="divide-y divide-[#EFE4F8]">
                    {events.data.length > 0 ? (
                        events.data.map((event) => (
                            <EventRow
                                key={event.id}
                                event={event}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <EmptyEventState hasFilter={hasActiveFilter(filters)} />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#EFE4F8] px-5 py-4 text-sm text-[#766B8A] sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Menampilkan {events.from ?? 0}-{events.to ?? 0} dari{' '}
                    {events.total} event
                </p>
                <Pagination
                    currentPage={events.current_page}
                    lastPage={events.last_page}
                    filters={filters}
                />
            </div>
        </section>
    );
}
