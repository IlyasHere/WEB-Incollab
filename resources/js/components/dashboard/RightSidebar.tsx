import { Sparkles } from 'lucide-react';

export type TrendingTopic = {
    tag: string;
    posts: string;
};

export type CollaborationPartner = {
    name: string;
    role: string;
    campus: string;
    avatar: string;
};

type RightSidebarProps = {
    topics: TrendingTopic[];
    partners: CollaborationPartner[];
};

export default function RightSidebar({
    topics,
    partners,
}: RightSidebarProps) {
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

                    <div className="space-y-5">
                        {topics.map((topic) => (
                            <div key={topic.tag}>
                                <p className="text-[15px] font-bold text-[#2A203C]">
                                    {topic.tag}
                                </p>
                                <p className="mt-1 text-sm text-[#7C7292]">
                                    {topic.posts}
                                </p>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="mt-6 text-sm font-semibold text-[#6610F2]"
                    >
                        Lihat semua topik
                    </button>
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
                                key={partner.name}
                                className="flex items-center gap-3"
                            >
                                <img
                                    src={partner.avatar}
                                    alt={partner.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-[#241A35]">
                                        {partner.name}
                                    </p>
                                    <p className="truncate text-xs text-[#817791]">
                                        {partner.role} • {partner.campus}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex h-9 items-center justify-center rounded-full bg-[#F3E8FF] px-4 text-xs font-semibold text-[#6610F2] transition hover:bg-[#EBDDFF]"
                                >
                                    Lihat
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-[#F4EAFD] px-5 py-4 text-center">
                        <button
                            type="button"
                            className="text-sm font-semibold text-[#1A8FE3]"
                        >
                            Lihat Semua
                        </button>
                    </div>
                </section>
            </div>
        </aside>
    );
}
