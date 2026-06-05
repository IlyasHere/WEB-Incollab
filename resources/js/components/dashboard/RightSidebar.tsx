import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export type TrendingTopic = {
    tag: string;
    slug: string;
    postsLabel: string;
    postCount: number;
    recentPostCount: number;
    commentCount: number;
};

export type CollaborationPartner = {
    id: number;
    name: string;
    role: string;
    campus: string;
    avatar?: string | null;
    profileUrl: string;
};

type RightSidebarProps = {
    topics: TrendingTopic[];
    partners: CollaborationPartner[];
};

export default function RightSidebar({ topics, partners }: RightSidebarProps) {
    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();

    return (
        <aside className="hidden lg:block lg:w-[300px] lg:shrink-0 xl:w-[320px]">
            <div className="sticky top-[98px] space-y-5">
                <section className="rounded-[28px] border border-[#F0E5FB] bg-white p-5 shadow-[0_16px_38px_rgba(177,145,221,0.14)]">
                    <div className="mb-5 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#6610F2]" />
                        <h2 className="text-[24px] font-bold text-[#261C39]">
                            Trending Topik
                        </h2>
                    </div>

                    {topics.length > 0 ? (
                        <div className="space-y-5">
                            {topics.map((topic) => (
                                <Link
                                    key={topic.slug}
                                    href={`/trending/${topic.slug}`}
                                    className="block rounded-2xl transition hover:bg-[#FBF7FF]"
                                >
                                    <p className="text-[15px] font-bold text-[#2A203C]">
                                        {topic.tag}
                                    </p>
                                    <p className="mt-1 text-sm text-[#7C7292]">
                                        {topic.postsLabel}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm leading-6 text-[#7C7292]">
                            Belum ada topik ramai. Buat postingan dengan hashtag
                            agar topik muncul di sini.
                        </p>
                    )}
                </section>

                <section className="rounded-[28px] border border-[#F0E5FB] bg-white p-0 shadow-[0_16px_38px_rgba(177,145,221,0.14)]">
                    <div className="border-b border-[#F4EAFD] px-5 py-5">
                        <h2 className="text-[24px] font-bold text-[#261C39]">
                            Pengguna lain
                        </h2>
                    </div>

                    <div className="space-y-4 px-5 py-5">
                        {partners.map((partner) => (
                            <div
                                key={partner.id}
                                className="flex items-center gap-3"
                            >
                                {partner.avatar ? (
                                    <img
                                        src={partner.avatar}
                                        alt={partner.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-sm font-bold text-white">
                                        {getInitials(partner.name)}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-[#241A35]">
                                        {partner.name}
                                    </p>
                                    <p className="truncate text-xs text-[#817791]">
                                        {partner.role} • {partner.campus}
                                    </p>
                                </div>
                                <Link
                                    href={partner.profileUrl}
                                    className="inline-flex h-9 items-center justify-center rounded-full bg-[#F3E8FF] px-4 text-xs font-semibold text-[#6610F2] transition hover:bg-[#EBDDFF]"
                                >
                                    Lihat
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </aside>
    );
}
