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
import WelcomeOnboarding from '@/components/onboarding/WelcomeOnboarding';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageLoading } from '@/hooks/use-page-loading';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { Auth } from '@/types/auth';

type DashboardProps = {
    posts: FeedPost[];
    partners: CollaborationPartner[];
    topics: TrendingTopic[];
    filters?: {
        search?: string;
    };
};

function EmptyFeedState({ search = '' }: { search?: string }) {
    const hasSearch = search.trim() !== '';

    return (
        <section className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#EFE4F8] bg-white p-8 text-center shadow-[0_18px_45px_rgba(177,145,221,0.13)]">
            <div className="max-w-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2]">
                    <FileText className="h-7 w-7" />
                </div>
                <h2 className="mt-5 text-xl font-extrabold text-[#1F1730]">
                    {hasSearch
                        ? 'Postingan tidak ditemukan'
                        : 'Belum ada postingan'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                    {hasSearch
                        ? `Tidak ada postingan yang cocok dengan "${search}". Coba kata kunci lain.`
                        : 'Mulai percakapan dengan membagikan ide, proyek, lomba, atau riset terbarumu. Feed akan menampilkan aktivitas di sini.'}
                </p>
            </div>
        </section>
    );
}

function DashboardSkeleton() {
    return (
        <div className="mx-auto flex max-w-[1320px] gap-6 xl:gap-8">
            <section className="min-w-0 flex-1 space-y-5 sm:space-y-6">
                <section className="rounded-[28px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.13)]">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-3 w-52" />
                        </div>
                    </div>
                    <Skeleton className="mt-5 h-24 w-full rounded-2xl" />
                </section>

                {Array.from({ length: 3 }).map((_, index) => (
                    <section
                        key={index}
                        className="rounded-[28px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.13)]"
                    >
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-11 w-11 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                        </div>
                        <Skeleton className="mt-5 h-6 w-3/4" />
                        <Skeleton className="mt-3 h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-5/6" />
                        <Skeleton className="mt-5 h-56 w-full rounded-2xl" />
                    </section>
                ))}
            </section>

            <aside className="hidden w-[320px] shrink-0 space-y-5 xl:block">
                {Array.from({ length: 2 }).map((_, index) => (
                    <section
                        key={index}
                        className="rounded-[28px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.13)]"
                    >
                        <Skeleton className="h-5 w-36" />
                        <div className="mt-5 space-y-4">
                            {Array.from({ length: 4 }).map((__, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="flex items-center gap-3"
                                >
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </aside>
        </div>
    );
}

export default function Dashboard({
    posts,
    partners,
    topics,
    filters,
}: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isLoading = usePageLoading();
    const search = filters?.search ?? '';

    return (
        <>
            <Head title="Dashboard" />

            <WelcomeOnboarding
                userName={auth.user.name}
                show={auth.user.onboarding_completed_at === null}
            />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                {isLoading ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="mx-auto flex max-w-[1320px] gap-6 xl:gap-8">
                        <section className="min-w-0 flex-1">
                            <div className="space-y-5 sm:space-y-6">
                                <ComposerCard
                                    userName={auth.user.name}
                                    userAvatar={auth.user.avatar}
                                />

                                {posts.length > 0 ? (
                                    <>
                                        {search !== '' && (
                                            <div className="rounded-2xl border border-[#EADCF8] bg-white px-5 py-4 text-sm font-semibold text-[#5E5873] shadow-[0_12px_30px_rgba(177,145,221,0.10)]">
                                                Hasil pencarian untuk{' '}
                                                <span className="text-[#6610F2]">
                                                    "{search}"
                                                </span>
                                            </div>
                                        )}

                                        {posts.map((post) => (
                                            <PostCard
                                                key={post.id}
                                                post={post}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <EmptyFeedState search={search} />
                                )}
                            </div>
                        </section>

                        <RightSidebar topics={topics} partners={partners} />
                    </div>
                )}
            </main>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
