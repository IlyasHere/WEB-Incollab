import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronRight,
    Hash,
    MessageSquare,
    Search,
    Sparkles,
    TrendingUp,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import TrendingUpAnimatedIcon from '@/components/icons/TrendingUpAnimatedIcon';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageLoading } from '@/hooks/use-page-loading';
import DashboardLayout from '@/layouts/DashboardLayout';

type Topic = {
    tag: string;
    slug: string;
    postCount: number;
    recentPostCount: number;
    commentCount: number;
    postsLabel: string;
    lastUsedLabel: string | null;
    sampleTitle: string | null;
};

type TrendingIndexProps = {
    topics: Topic[];
};

type SortMode = 'popular' | 'recent' | 'comments';

const sortOptions: Array<{ label: string; value: SortMode }> = [
    { label: 'Paling ramai', value: 'popular' },
    { label: 'Terbaru', value: 'recent' },
    { label: 'Komentar', value: 'comments' },
];

function TrendingIndexSkeleton() {
    return (
        <div className="mx-auto max-w-[1320px] space-y-6">
            <section className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">
                <Skeleton className="h-5 w-40" />
                <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
                    <div>
                        <Skeleton className="h-9 w-64 rounded-full" />
                        <Skeleton className="mt-5 h-10 w-72" />
                        <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
                    </div>
                    <Skeleton className="h-56 rounded-[28px]" />
                </div>
                <Skeleton className="mt-7 h-13 w-full rounded-2xl" />
            </section>
            <section className="grid gap-3 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 rounded-[24px]" />
                ))}
            </section>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-56 rounded-[26px]" />
                ))}
            </section>
        </div>
    );
}

export default function TrendingIndex({ topics }: TrendingIndexProps) {
    const [query, setQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('popular');
    const isLoading = usePageLoading();
    const topTopic = topics[0];
    const normalizedQuery = query.trim().toLowerCase();
    const filteredTopics = useMemo(() => {
        const searchedTopics = normalizedQuery
            ? topics.filter((topic) =>
                  [topic.tag, topic.sampleTitle ?? '']
                      .join(' ')
                      .toLowerCase()
                      .includes(normalizedQuery),
              )
            : topics;

        return [...searchedTopics].sort((first, second) => {
            if (sortMode === 'comments') {
                return second.commentCount - first.commentCount;
            }

            if (sortMode === 'recent') {
                return second.recentPostCount - first.recentPostCount;
            }

            return topicScore(second) - topicScore(first);
        });
    }, [normalizedQuery, sortMode, topics]);
    const totalPosts = topics.reduce(
        (total, topic) => total + topic.postCount,
        0,
    );
    const totalComments = topics.reduce(
        (total, topic) => total + topic.commentCount,
        0,
    );

    return (
        <>
            <Head title="Trending Topik" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                {isLoading ? (
                    <TrendingIndexSkeleton />
                ) : (
                    <div className="mx-auto max-w-[1320px] space-y-6">
                        <section className="overflow-hidden rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">
                            <Link
                                href="/dashboard"
                                className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#6610F2] transition hover:text-[#570DD1]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Beranda
                            </Link>

                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
                                <div className="min-w-0">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E7FF] px-4 py-2 text-sm font-extrabold text-[#6610F2]">
                                        <Sparkles className="h-4 w-4" />
                                        Topik dari aktivitas komunitas
                                    </div>
                                    <h1 className="mt-4 text-3xl font-extrabold text-[#1F1730] sm:text-4xl">
                                        Trending Topik
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5F5573] sm:text-base">
                                        Topik dihitung dari hashtag yang paling
                                        sering dipakai, postingan terbaru, dan
                                        percakapan lewat komentar.
                                    </p>
                                </div>

                                <div className="relative overflow-hidden rounded-[28px] border border-[#DCC5FF] bg-[linear-gradient(135deg,#6610F2_0%,#8B5CF6_48%,#B84DFF_100%)] p-5 text-white shadow-[0_24px_60px_rgba(102,16,242,0.28)]">
                                    <span className="pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
                                    <span className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#1A8FE3]/30 blur-3xl" />
                                    <div className="flex items-center gap-4">
                                        <TrendingUpAnimatedIcon
                                            variant="loop"
                                            size={64}
                                            className="relative rounded-[22px] border border-white/25 bg-white/20 text-white shadow-[0_18px_42px_rgba(31,23,48,0.24)] backdrop-blur"
                                            iconClassName="drop-shadow-[0_2px_8px_rgba(255,255,255,0.55)]"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-extrabold tracking-[0.16em] text-white/75 uppercase">
                                                Sedang naik
                                            </p>
                                            <p className="mt-1 truncate text-2xl font-extrabold text-white">
                                                {topTopic?.tag ??
                                                    'Belum ada topik'}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="relative mt-4 line-clamp-2 text-sm leading-6 text-white/82">
                                        {topTopic?.sampleTitle ??
                                            'Buat postingan dengan hashtag supaya tren komunitas mulai terlihat.'}
                                    </p>

                                    {topTopic && (
                                        <Link
                                            href={`/trending/${topTopic.slug}`}
                                            className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-extrabold text-[#6610F2] shadow-[0_16px_34px_rgba(31,23,48,0.18)] transition hover:-translate-y-0.5 hover:bg-[#F7F1FF]"
                                        >
                                            Buka topik teratas
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="mt-7 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8B7AA3]" />
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(event) =>
                                            setQuery(event.target.value)
                                        }
                                        placeholder="Cari hashtag atau judul postingan..."
                                        className="h-13 w-full rounded-2xl border border-[#E6D7F5] bg-[#FBF7FF] pr-12 pl-12 text-sm font-semibold text-[#2A203C] transition outline-none placeholder:text-[#9B8CB0] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                    {query && (
                                        <button
                                            type="button"
                                            onClick={() => setQuery('')}
                                            className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#7C7292] transition hover:bg-white hover:text-[#2A203C]"
                                            aria-label="Hapus pencarian"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="text-sm font-bold text-[#7C7292]">
                                    {filteredTopics.length} dari {topics.length}{' '}
                                    topik
                                </div>
                            </div>

                            {topics.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {sortOptions.map((option) => {
                                        const active =
                                            sortMode === option.value;

                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    setSortMode(option.value)
                                                }
                                                className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                                                    active
                                                        ? 'bg-[#6610F2] text-white shadow-[0_10px_24px_rgba(102,16,242,0.22)]'
                                                        : 'bg-[#F7F1FF] text-[#675A7C] hover:bg-[#EFE4FF] hover:text-[#2A203C]'
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {topics.length > 0 && (
                            <section className="grid gap-3 md:grid-cols-3">
                                <SummaryMetric
                                    icon={Hash}
                                    label="Total topik"
                                    value={topics.length}
                                />
                                <SummaryMetric
                                    icon={TrendingUp}
                                    label="Total postingan"
                                    value={totalPosts}
                                />
                                <SummaryMetric
                                    icon={MessageSquare}
                                    label="Total komentar"
                                    value={totalComments}
                                />
                            </section>
                        )}

                        {filteredTopics.length > 0 ? (
                            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {filteredTopics.map((topic) => (
                                    <Link
                                        key={topic.slug}
                                        href={`/trending/${topic.slug}`}
                                        className="group rounded-[26px] border border-[#EFE4F8] bg-white p-5 shadow-[0_16px_38px_rgba(177,145,221,0.12)] transition hover:-translate-y-0.5 hover:border-[#D8C4F0] hover:shadow-[0_20px_46px_rgba(102,16,242,0.14)]"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-xs font-extrabold tracking-[0.12em] text-[#8B5CF6] uppercase">
                                                    Peringkat{' '}
                                                    {topics.findIndex(
                                                        (item) =>
                                                            item.slug ===
                                                            topic.slug,
                                                    ) + 1}
                                                </p>
                                                <h2 className="mt-2 truncate text-2xl font-extrabold text-[#1F1730]">
                                                    {topic.tag}
                                                </h2>
                                            </div>
                                            <TrendingUpAnimatedIcon
                                                variant="hover"
                                                size={44}
                                                className="group-hover:bg-[#6610F2] group-hover:text-white"
                                            />
                                        </div>

                                        <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-[#5F5573]">
                                            {topic.sampleTitle ??
                                                'Belum ada ringkasan postingan.'}
                                        </p>

                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <Metric
                                                icon={TrendingUp}
                                                label="Post 7 hari"
                                                value={topic.recentPostCount}
                                            />
                                            <Metric
                                                icon={MessageSquare}
                                                label="Komentar"
                                                value={topic.commentCount}
                                            />
                                        </div>

                                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F1E7FA] pt-4">
                                            <div>
                                                <span className="text-sm font-semibold text-[#7C7292]">
                                                    {topic.postsLabel}
                                                </span>
                                                {topic.lastUsedLabel && (
                                                    <p className="mt-0.5 text-xs font-semibold text-[#9B8CB0]">
                                                        Aktif{' '}
                                                        {topic.lastUsedLabel}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-sm font-extrabold text-[#6610F2]">
                                                Lihat postingan
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </section>
                        ) : (
                            <section className="rounded-[30px] border border-dashed border-[#D8CDE8] bg-white p-8 text-center">
                                {topics.length > 0 ? (
                                    <Search className="mx-auto h-12 w-12 text-[#6610F2]" />
                                ) : (
                                    <Sparkles className="mx-auto h-12 w-12 text-[#6610F2]" />
                                )}
                                <h2 className="mt-4 text-xl font-extrabold text-[#1F1730]">
                                    {topics.length > 0
                                        ? 'Topik tidak ditemukan'
                                        : 'Belum ada topik trending'}
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                                    {topics.length > 0
                                        ? 'Coba kata kunci lain atau hapus pencarian untuk melihat semua topik.'
                                        : 'Buat postingan dengan hashtag agar topik mulai terhitung di halaman ini.'}
                                </p>
                            </section>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}

function topicScore(topic: Topic) {
    return topic.recentPostCount * 3 + topic.postCount * 2 + topic.commentCount;
}

function SummaryMetric({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof TrendingUp;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-[24px] border border-[#EFE4F8] bg-white p-5 shadow-[0_14px_34px_rgba(177,145,221,0.1)]">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2]">
                    <Icon className="h-5 w-5" />
                </span>
                <div>
                    <p className="text-sm font-bold text-[#7C7292]">{label}</p>
                    <p className="text-2xl font-extrabold text-[#1F1730]">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Metric({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof TrendingUp;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-2xl bg-[#FBF7FF] p-3">
            <div className="flex items-center gap-2 text-[#6610F2]">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold">{label}</span>
            </div>
            <p className="mt-2 text-xl font-extrabold text-[#1F1730]">
                {value}
            </p>
        </div>
    );
}

TrendingIndex.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
