import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import EventCard, { EventItem } from '@/components/EventCard';
import DashboardLayout from '@/layouts/DashboardLayout';

type Category =
    | 'Semua'
    | 'Kompetisi'
    | 'Workshop'
    | 'Seminar'
    | 'Hackathon';

const categories: Category[] = [
    'Semua',
    'Kompetisi',
    'Workshop',
    'Seminar',
    'Hackathon',
];

type Props = {
    savedEvents: EventItem[];
};
// Use shared `EventCard` component (imported above)

export default function Tersimpan({
    savedEvents,
}: Props) {
    const [activeCategory, setActiveCategory] =
        useState<Category>('Semua');

    const [search, setSearch] = useState('');

    const [localEvents, setLocalEvents] = useState<EventItem[]>(savedEvents);

    // dst...

    const filteredEvents = useMemo(() => {
        return localEvents.filter((event) => {
            const matchCategory =
                activeCategory === 'Semua'
                    ? true
                    : event.category === activeCategory;

            const matchSearch =
                event.title.toLowerCase().includes(search.toLowerCase()) ||
                (event.organizer ?? '').toLowerCase().includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [localEvents, activeCategory, search]);

    return (
        <>
            <Head title="Tersimpan" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1320px]">

                    {/* HERO SECTION */}
                    <section className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">

                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6610F2]">
                            InCollab
                        </p>

                        <h1 className="mt-3 text-[32px] font-bold text-[#221A32]">
                            Event Tersimpan
                        </h1>

                        <p className="mt-3 max-w-2xl text-[16px] leading-8 text-[#5A516C]">
                            Kelola event yang sudah kamu bookmark dan
                            temukan kembali event favoritmu.
                        </p>

                    </section>

                    {/* SEARCH + FILTER */}
                    <section className="mt-6 rounded-[28px] border border-[#EFE4F8] bg-white p-4 shadow-[0_14px_34px_rgba(102,16,242,0.06)]">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            {/* SEARCH */}
                           <div className="relative flex-1">

                                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7FA2]" />

                                <input
                                    type="text"
                                    placeholder="Cari event, organizer, atau kategori..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    className="h-12 w-full rounded-full border border-[#EADCF8] bg-[#F7F1FF] pl-11 pr-4 text-sm text-[#382A49] outline-none transition placeholder:text-[#9B8FB3] focus:border-[#6610F2]"
                                />
                            </div>

                            {/* FILTER */}
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category) => {
                                    const isActive =
                                        activeCategory === category;

                                    return (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                setActiveCategory(category)
                                            }
                                            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                                                isActive
                                                    ? 'bg-[#6610F2] text-white'
                                                    : 'border border-[#D8CCE8] bg-white text-[#5A516C]'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* EVENT LIST */}
                    <section className="mt-6">

                        {filteredEvents.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2">
                                {filteredEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onToggleBookmark={(id, current) => {
                                            // optimistic removal from UI
                                            setLocalEvents((prev) => prev.filter((e) => e.id !== id));
                                            router.delete(`/event/${id}/bookmark`);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                    

                            <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#DCCEF3] bg-[#FCFAFF] text-center">

                                <div className="text-5xl">
                                    🔖
                                </div>

                                <h2 className="mt-5 text-2xl font-bold text-[#221A32]">
                                    Belum ada event tersimpan
                                </h2>

                                <p className="mt-3 max-w-md text-sm leading-7 text-[#7A7488]">
                                    Simpan event favoritmu terlebih dahulu
                                    agar muncul di halaman ini.
                                </p>

                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

Tersimpan.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
