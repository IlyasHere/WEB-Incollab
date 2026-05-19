import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Hash,
    MessageSquare,
    Sparkles,
    TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';
import PostCard from '@/components/dashboard/PostCard';
import type { FeedPost } from '@/components/dashboard/PostCard';
import DashboardLayout from '@/layouts/DashboardLayout';

type Topic = {
    tag: string;
    slug: string;
    postCount: number;
    recentPostCount: number;
    commentCount: number;
    postsLabel: string;
    lastUsedLabel: string | null;
};

type TrendingShowProps = {
    topic: Topic;
    posts: FeedPost[];
    relatedTopics: Topic[];
};

export default function TrendingShow({
    topic,
    posts,
    relatedTopics,
}: TrendingShowProps) {
    return (
        <>
            <Head title={`${topic.tag} - Trending Topik`} />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto grid max-w-[1320px] gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <section className="min-w-0 space-y-5">
                        <div className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">
                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href="/trending"
                                    className="inline-flex items-center gap-2 text-sm font-extrabold text-[#6610F2] transition hover:text-[#570DD1]"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Semua topik
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 text-sm font-extrabold text-[#7C7292] transition hover:text-[#570DD1]"
                                >
                                    Kembali ke Beranda
                                </Link>
                            </div>

                            <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E7FF] px-4 py-2 text-sm font-extrabold text-[#6610F2]">
                                        <Hash className="h-4 w-4" />
                                        Trending
                                    </div>
                                    <h1 className="mt-4 text-4xl font-extrabold text-[#1F1730] sm:text-5xl">
                                        {topic.tag}
                                    </h1>
                                    <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5F5573] sm:text-base">
                                        Kumpulan postingan yang memakai hashtag
                                        ini, diurutkan dari aktivitas terbaru.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <Metric
                                    icon={TrendingUp}
                                    label="Post 7 hari"
                                    value={topic.recentPostCount}
                                />
                                <Metric
                                    icon={Hash}
                                    label="Total post"
                                    value={topic.postCount}
                                />
                                <Metric
                                    icon={MessageSquare}
                                    label="Komentar"
                                    value={topic.commentCount}
                                />
                            </div>
                        </div>

                        {posts.length > 0 ? (
                            <div className="space-y-5">
                                {posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        ) : (
                            <section className="rounded-[30px] border border-dashed border-[#D8CDE8] bg-white p-8 text-center">
                                <Sparkles className="mx-auto h-12 w-12 text-[#6610F2]" />
                                <h2 className="mt-4 text-xl font-extrabold text-[#1F1730]">
                                    Belum ada postingan terkait
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                                    Topik ini belum punya postingan yang bisa
                                    ditampilkan.
                                </p>
                            </section>
                        )}
                    </section>

                    <aside className="space-y-5 xl:sticky xl:top-[98px] xl:self-start">
                        <section className="rounded-[28px] border border-[#F0E5FB] bg-white p-5 shadow-[0_16px_38px_rgba(177,145,221,0.14)]">
                            <h2 className="text-xl font-extrabold text-[#261C39]">
                                Ringkasan
                            </h2>
                            <div className="mt-4 space-y-3 text-sm leading-6 text-[#5F5573]">
                                <p>
                                    Topik ini punya{' '}
                                    <strong className="text-[#1F1730]">
                                        {topic.postCount}
                                    </strong>{' '}
                                    postingan dan{' '}
                                    <strong className="text-[#1F1730]">
                                        {topic.commentCount}
                                    </strong>{' '}
                                    komentar.
                                </p>
                                {topic.lastUsedLabel && (
                                    <p>Terakhir aktif {topic.lastUsedLabel}.</p>
                                )}
                            </div>
                        </section>

                        {relatedTopics.length > 0 && (
                            <section className="rounded-[28px] border border-[#F0E5FB] bg-white p-5 shadow-[0_16px_38px_rgba(177,145,221,0.14)]">
                                <h2 className="text-xl font-extrabold text-[#261C39]">
                                    Topik terkait
                                </h2>
                                <div className="mt-4 space-y-3">
                                    {relatedTopics.map((relatedTopic) => (
                                        <Link
                                            key={relatedTopic.slug}
                                            href={`/trending/${relatedTopic.slug}`}
                                            className="block rounded-2xl border border-[#F2E8FA] px-4 py-3 transition hover:border-[#D8C4F0] hover:bg-[#FBF7FF]"
                                        >
                                            <p className="font-extrabold text-[#1F1730]">
                                                {relatedTopic.tag}
                                            </p>
                                            <p className="mt-1 text-sm text-[#7C7292]">
                                                {relatedTopic.postsLabel}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </main>
        </>
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
        <div className="rounded-2xl bg-[#FBF7FF] p-4">
            <div className="flex items-center gap-2 text-[#6610F2]">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold">{label}</span>
            </div>
            <p className="mt-2 text-2xl font-extrabold text-[#1F1730]">
                {value}
            </p>
        </div>
    );
}

TrendingShow.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
