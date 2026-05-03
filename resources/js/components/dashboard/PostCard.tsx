import { Heart, MessageSquare, Share2 } from 'lucide-react';

export type FeedPost = {
    id: number;
    user: {
        name: string;
        major: string;
        avatar: string;
    };
    postedAt: string;
    badge: string;
    badgeColor: string;
    title: string;
    description: string;
    hashtags: string[];
    likes: number;
    comments: number;
    image?: string;
};

type PostCardProps = {
    post: FeedPost;
};

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="rounded-[30px] border border-white/70 bg-white p-5 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <img
                        src={post.user.avatar}
                        alt={post.user.name}
                        className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <h2 className="truncate text-[18px] font-bold text-[#1F1730]">
                            {post.user.name}
                        </h2>
                        <p className="truncate text-sm text-[#766B8A]">
                            {post.user.major} • {post.postedAt}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="rounded-full p-2 text-[#9689AF] transition hover:bg-[#F8F3FF] hover:text-[#4B3A68]"
                    aria-label="Opsi postingan"
                >
                    <span className="block text-lg leading-none">•••</span>
                </button>
            </div>

            <div className="mt-5">
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.04em] ${post.badgeColor}`}
                >
                    {post.badge}
                </span>
            </div>

            <div className="mt-4 space-y-4">
                <h3 className="max-w-3xl text-[28px] leading-[1.2] font-bold text-[#221A32] sm:text-[34px]">
                    {post.title}
                </h3>
                <p className="text-[15px] leading-8 text-[#5A516C] sm:text-[16px]">
                    {post.description}
                </p>

                {post.image && (
                    <div className="overflow-hidden rounded-[22px] border border-[#EEE4F9]">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="h-52 w-full object-cover object-center sm:h-72"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-3 text-[15px] text-[#6610F2]">
                    {post.hashtags.map((tag) => (
                        <span key={tag}>{tag}</span>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-[#F1E7FA] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5 text-[#5F556F]">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm font-medium transition hover:text-[#D11149]"
                    >
                        <Heart className="h-5 w-5" />
                        {post.likes}
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm font-medium transition hover:text-[#1A8FE3]"
                    >
                        <MessageSquare className="h-5 w-5" />
                        {post.comments}
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 text-sm font-medium transition hover:text-[#6610F2]"
                    >
                        <Share2 className="h-5 w-5" />
                        Share
                    </button>
                </div>

                <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#6610F2] px-6 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(102,16,242,0.24)] transition hover:brightness-105 sm:min-w-[150px]"
                >
                    Lihat detail
                </button>
            </div>
        </article>
    );
}
