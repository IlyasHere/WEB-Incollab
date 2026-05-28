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

export default function TrendingIndex({ topics }: TrendingIndexProps) {
    const [query, setQuery] = useState('');
    const [sortMode, setSortMode] = useState<SortMode>('popular');

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

    // Pre-compute rank index for all topics to avoid O(n) findIndex inside render
    const topicRankMap = useMemo(() => {
        const map = new Map<string, number>();
        topics.forEach((topic, index) => map.set(topic.slug, index + 1));
        return map;
    }, [topics]);

    const liveTopics = useMemo(
        () =>
            [...topics]
                .sort((a, b) => b.recentPostCount - a.recentPostCount)
                .slice(0, 5),
        [topics],
    );

    const totalPosts = topics.reduce((total, topic) => total + topic.postCount, 0);
    const totalComments = topics.reduce((total, topic) => total + topic.commentCount, 0);

    return (
        <>
            <Head title="Trending Topik" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1320px] space-y-6">

                    {/* ── HERO ── */}
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
                                    Temukan hashtag populer dan eksplor semua postingan komunitas berdasarkan topik yang sedang ramai digunakan.
                                </p>
                            </div>

                            {/* TOP TRENDING CARD */}
                            <div className="relative overflow-hidden rounded-[28px] border border-[#DCC5FF] bg-[linear-gradient(135deg,#6610F2_0%,#8B5CF6_48%,#B84DFF_100%)] p-5 text-white shadow-[0_24px_60px_rgba(102,16,242,0.28)]">

                                <span className="pointer-events-none absolute -top-16 -right-12 h-36 w-36 rounded-full bg-white/20 blur-2xl" />

                                <div className="flex items-center gap-4">
                                    <TrendingUpAnimatedIcon
                                        variant="loop"
                                        size={64}
                                        className="relative rounded-[22px] border border-white/25 bg-white/20 text-white shadow-[0_18px_42px_rgba(31,23,48,0.24)] backdrop-blur"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/75">
                                            Sedang naik
                                        </p>
                                        <p className="mt-1 truncate text-2xl font-extrabold text-white">
                                            {topTopic?.tag ?? 'Belum ada topik'}
                                        </p>
                                    </div>
                                </div>

                                <p className="relative mt-4 line-clamp-2 text-sm leading-6 text-white/82">
                                    {topTopic?.sampleTitle ?? 'Belum ada postingan trending.'}
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

                        {/* SEARCH */}
                        <div className="mt-7 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">

                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8B7AA3]" />

                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Cari hashtag atau judul postingan..."
                                    className="h-13 w-full rounded-2xl border border-[#E6D7F5] bg-[#FBF7FF] pr-12 pl-12 text-sm font-semibold text-[#2A203C] outline-none transition placeholder:text-[#9B8CB0] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                />

                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery('')}
                                        className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#7C7292] transition hover:bg-white hover:text-[#2A203C]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="text-sm font-bold text-[#7C7292]">
                                {filteredTopics.length} dari {topics.length} topik
                            </div>
                        </div>

                        {/* SORT FILTER */}
                        {topics.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {sortOptions.map((option) => {
                                    const active = sortMode === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setSortMode(option.value)}
                                            className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                                                active
                                                    ? 'bg-[#6610F2] text-white shadow-[0_10px_24px_rgba(102,16,242,0.22)]'
                                                    : 'bg-[#F7F1FF] text-[#675A7C] hover:bg-[#EFE4FF]'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* ── SUMMARY METRICS ── */}
                    {topics.length > 0 && (
                        <section className="grid gap-3 md:grid-cols-3">
                            <SummaryMetric icon={Hash} label="Total topik" value={topics.length} />
                            <SummaryMetric icon={TrendingUp} label="Total postingan" value={totalPosts} />
                            <SummaryMetric icon={MessageSquare} label="Total komentar" value={totalComments} />
                        </section>
                    )}

                    {/* ── LIVE TRENDING (dari widget dashboard) ── */}
                    {topics.length > 0 && (
                        <section className="rounded-[30px] border border-[#EFE4F8] bg-white p-6 shadow-[0_16px_38px_rgba(177,145,221,0.12)]">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-[#6610F2]" />
                                    <h2 className="text-xl font-extrabold text-[#1F1730]">
                                        Sedang Ramai Sekarang
                                    </h2>
                                </div>
                                <span className="rounded-full bg-[#F0E7FF] px-3 py-1 text-xs font-extrabold text-[#6610F2]">
                                    7 hari terakhir
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-[#7C7292]">
                                Topik dengan postingan baru terbanyak dalam 7 hari terakhir.
                            </p>

                            <div className="mt-5 divide-y divide-[#F5EDFC]">
                                {liveTopics.map((topic, index) => {
                                    const isActive = normalizedQuery === topic.tag.toLowerCase();
                                    return (
                                        <button
                                            key={topic.slug}
                                            type="button"
                                            onClick={() => {
                                                setQuery(isActive ? '' : topic.tag);
                                                document
                                                    .getElementById('topic-cards')
                                                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }}
                                            className={`flex w-full items-center justify-between py-4 text-left transition first:pt-0 last:pb-0 ${
                                                isActive
                                                    ? 'opacity-100'
                                                    : 'hover:opacity-75'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-xs font-extrabold transition ${
                                                    isActive
                                                        ? 'bg-[#6610F2] text-white'
                                                        : 'bg-[#F0E7FF] text-[#6610F2]'
                                                }`}>
                                                    #{index + 1}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className={`truncate font-extrabold transition ${
                                                        isActive ? 'text-[#6610F2]' : 'text-[#1F1730]'
                                                    }`}>
                                                        {topic.tag}
                                                    </p>
                                                    <p className="text-sm font-semibold text-[#8B7AA3]">
                                                        {topic.recentPostCount} postingan baru
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="ml-3 flex flex-shrink-0 items-center gap-3">
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                                                    isActive
                                                        ? 'bg-[#6610F2] text-white'
                                                        : 'bg-[#F0E7FF] text-[#6610F2]'
                                                }`}>
                                                    {topic.commentCount} komentar
                                                </span>
                                                <ChevronRight className={`h-4 w-4 transition ${
                                                    isActive ? 'text-[#6610F2]' : 'text-[#8B5CF6]'
                                                }`} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* ── TOPIC CARDS (semua topik + filter) ── */}
                    {filteredTopics.length > 0 ? (
                        <section id="topic-cards" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {filteredTopics.map((topic) => (
                                <Link
                                    key={topic.slug}
                                    href={`/trending/${topic.slug}`}
                                    className="group rounded-[26px] border border-[#EFE4F8] bg-white p-5 shadow-[0_16px_38px_rgba(177,145,221,0.12)] transition hover:-translate-y-0.5 hover:border-[#D8C4F0]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#8B5CF6]">
                                                Peringkat {topicRankMap.get(topic.slug) ?? '—'}
                                            </p>
                                            <h2 className="mt-2 truncate text-2xl font-extrabold text-[#1F1730]">
                                                {topic.tag}
                                            </h2>
                                        </div>
                                        <TrendingUpAnimatedIcon variant="hover" size={44} />
                                    </div>

                                    <p className="mt-4 line-clamp-2 min-h-12 text-sm leading-6 text-[#5F5573]">
                                        {topic.sampleTitle ?? 'Belum ada ringkasan postingan.'}
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
                                </Link>
                            ))}
                        </section>
                    ) : (
                        <section id="topic-cards" className="rounded-[30px] border border-dashed border-[#D8CDE8] bg-white p-8 text-center">
                            <Search className="mx-auto h-12 w-12 text-[#6610F2]" />
                            <h2 className="mt-4 text-xl font-extrabold text-[#1F1730]">
                                Topik tidak ditemukan
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                                Coba kata kunci lain.
                            </p>
                        </section>
                    )}
                </div>
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
                    <p className="text-2xl font-extrabold text-[#1F1730]">{value}</p>
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
            <p className="mt-2 text-xl font-extrabold text-[#1F1730]">{value}</p>
        </div>
    );
}

TrendingIndex.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);