import { Head, usePage } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import type { ReactNode } from 'react';
import ComposerCard from '@/components/dashboard/ComposerCard';
import PostCard from '@/components/dashboard/PostCard';
import type { FeedPost } from '@/components/dashboard/PostCard';
import RightSidebar from '@/components/dashboard/RightSidebar';
import type {
    CollaborationPartner,
    TrendingTopic,
} from '@/components/dashboard/RightSidebar';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { Auth } from '@/types/auth';

const topics: TrendingTopic[] = [
    { tag: '#HackathonNasional', posts: '1.2k postingan baru' },
    { tag: '#PKMKC2024', posts: '850 postingan baru' },
    { tag: '#UIUXPortofolio', posts: '432 postingan baru' },
    { tag: '#LombaEsai', posts: '210 postingan baru' },
];

type DashboardProps = {
    posts: FeedPost[];
    partners: CollaborationPartner[];
};

function EmptyFeedState() {
    return (
        <section className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#EFE4F8] bg-white p-8 text-center shadow-[0_18px_45px_rgba(177,145,221,0.13)]">
            <div className="max-w-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2]">
                    <FileText className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-extrabold text-[#1F1730]">
                    Belum ada postingan
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                    Mulai percakapan dengan membagikan ide, proyek, lomba, atau
                    riset terbarumu. Feed akan menampilkan aktivitas di sini.
                </p>
            </div>
        </section>
    );
}

export default function Dashboard({ posts, partners }: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Dashboard" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto flex max-w-[1320px] gap-6 xl:gap-8">
                    <section className="min-w-0 flex-1">
                        <div className="space-y-5 sm:space-y-6">
                            <ComposerCard
                                userName={auth.user.name}
                                userAvatar={auth.user.avatar}
                            />

                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            ) : (
                                <EmptyFeedState />
                            )}
                        </div>
                    </section>

                    <RightSidebar topics={topics} partners={partners} />
                </div>
            </main>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
