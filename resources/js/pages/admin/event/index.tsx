import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Plus, Sparkles, Trophy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLayout from '@/layouts/AdminLayout';
import { EventFilters } from './components/EventFilters';
import { EventTable } from './components/EventTable';
import type {
    EventFilters as EventFiltersType,
    EventItem,
    EventsPage,
    EventSummary,
} from './types';
import { cleanFilters } from './utils';

type AdminEventIndexProps = {
    categories: string[];
    visibilities: string[];
    registrationStatuses: string[];
    events: EventsPage;
    stats: EventSummary;
    filters: EventFiltersType;
};

export default function AdminEventIndex({
    categories,
    visibilities,
    registrationStatuses,
    events,
    stats,
    filters,
}: AdminEventIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [isFiltering, setIsFiltering] = useState(false);

    const visitWithFilters = useCallback((nextFilters: EventFiltersType) => {
        router.get('/admin/event', cleanFilters(nextFilters), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ['events', 'filters', 'stats'],
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    }, []);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            visitWithFilters({
                ...filters,
                search,
            });
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [filters, search, visitWithFilters]);

    function deleteEvent(event: EventItem) {
        if (!window.confirm(`Hapus event "${event.title}"?`)) {
            return;
        }

        router.delete(`/admin/event/${event.id}`, {
            preserveScroll: true,
        });
    }

    const summaryCards = [
        {
            label: 'Total Event',
            value: stats.total,
            icon: Trophy,
            accent: 'bg-[#F0E7FF] text-[#6610F2]',
        },
        {
            label: 'Upcoming',
            value: stats.upcoming,
            icon: CalendarDays,
            accent: 'bg-[#EAF6FF] text-[#1A8FE3]',
        },
        {
            label: 'Published',
            value: stats.published,
            icon: Sparkles,
            accent: 'bg-[#FFF4D6] text-[#A77800]',
        },
    ];

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
                            Gunakan tampilan table agar admin lebih mudah
                            mencari, memfilter, dan mengelola data event dalam
                            jumlah banyak.
                        </p>
                    </div>

                    <Link
                        href="/admin/event/create"
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_16px_30px_rgba(102,16,242,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#550DCC] hover:shadow-[0_20px_36px_rgba(102,16,242,0.30)]"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Event
                    </Link>
                </section>

                {isFiltering ? (
                    <section className="grid gap-5 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-32 rounded-2xl"
                            />
                        ))}
                    </section>
                ) : (
                    <section className="grid gap-5 sm:grid-cols-3">
                        {summaryCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <article
                                    key={card.label}
                                    className="relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-bold tracking-wide text-[#4F465F] uppercase">
                                                {card.label}
                                            </p>
                                            <p className="mt-5 text-3xl font-extrabold text-[#4C00D8]">
                                                {card.value.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </p>
                                        </div>
                                        <span
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.accent}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

                <EventFilters
                    search={search}
                    filters={filters}
                    categories={categories}
                    visibilities={visibilities}
                    registrationStatuses={registrationStatuses}
                    onSearchChange={setSearch}
                    onFilterChange={visitWithFilters}
                />

                <EventTable
                    events={events}
                    filters={filters}
                    isFiltering={isFiltering}
                    onDelete={deleteEvent}
                />
            </div>
        </>
    );
}

AdminEventIndex.layout = (page: ReactNode) => <AdminLayout>{page}</AdminLayout>;
