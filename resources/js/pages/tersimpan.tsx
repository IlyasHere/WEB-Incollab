import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';

type Category =
    | 'Semua'
    | 'Kompetisi'
    | 'Workshop'
    | 'Seminar'
    | 'Hackathon';

type SavedEvent = {
    id: number;
    title: string;
    category: Exclude<Category, 'Semua'>;
    organizer: string;
    date: string;
    location: string;
    image: string;
};

const categories: Category[] = [
    'Semua',
    'Kompetisi',
    'Workshop',
    'Seminar',
    'Hackathon',
];

type Props = {
    savedEvents: any[];
};

export default function Tersimpan({
    savedEvents,
}: Props) {
    const [activeCategory, setActiveCategory] =
        useState<Category>('Semua');

    const [search, setSearch] = useState('');

    const events = savedEvents.map((bookmark) => ({
        id: bookmark.event.event_id,
        title: bookmark.event.judul_event,
        category: bookmark.event.kategori_event,
        organizer: bookmark.event.penyelenggara ?? 'InCollab',
        date: bookmark.event.tanggal_event,
        location: bookmark.event.lokasi,
        image:
            bookmark.event.poster_event ??
            '/images/default-event.jpg',
    }));

    // dst...

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const matchCategory =
                activeCategory === 'Semua'
                    ? true
                    : event.category === activeCategory;

            const matchSearch =
                event.title
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                event.organizer
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [events, activeCategory, search]);

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

                            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {filteredEvents.map((event) => (
                                    <article
                                        key={event.id}
                                        className="overflow-hidden rounded-[28px] border border-[#EFE4F8] bg-white shadow-[0_18px_40px_rgba(102,16,242,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(102,16,242,0.12)]"
                                    >

                                        {/* IMAGE */}
                                        <div
                                            className="h-[190px] bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${event.image})`,
                                            }}
                                        />

                                        {/* CONTENT */}
                                        <div className="p-5">

                                            <div className="flex items-center justify-between">

                                                <span className="rounded-full bg-[#F3ECFF] px-3 py-1 text-xs font-semibold text-[#6610F2]">
                                                    {event.category}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        router.delete(`/event/${event.id}/bookmark`, {
                                                            preserveScroll: true,
                                                        })
                                                    }
                                                    className="text-sm font-semibold text-[#D11149] transition hover:opacity-70"
                                                >
                                                    Hapus
                                                </button>

                                            </div>

                                            <h2 className="mt-4 text-xl font-bold text-[#221A32]">
                                                {event.title}
                                            </h2>

                                            <p className="mt-1 text-sm text-[#6B6280]">
                                                {event.organizer}
                                            </p>

                                            <div className="mt-4 space-y-2 text-sm text-[#5A516C]">

                                                <div className="flex items-center gap-2">
                                                    <span>📅</span>
                                                    <span>{event.date}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span>📍</span>
                                                    <span>{event.location}</span>
                                                </div>

                                            </div>

                                            <a
                                                href="/event"
                                                className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#6610F2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#520dd1]"
                                            >
                                                Lihat Detail
                                            </a>

                                        </div>
                                    </article>
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