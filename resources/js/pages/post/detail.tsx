import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Heart, MessageSquare, Send } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

type Reply = {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    time: string;
};

type Comment = {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    content: string;
    time: string;
    likes: number;
    replies: Reply[];
};

const post = {
    id: 1,
    user: {
        name: 'Amanda Rizky',
        major: 'Sistem Informasi',
        avatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    postedAt: '2 jam yang lalu',
    badge: 'OPEN RECRUITING',
    badgeColor: 'bg-[#F0E7FF] text-[#6610F2]',
    title: 'Mencari UI/UX Designer untuk Proyek Aplikasi Kesehatan Mental',
    description:
        'Halo teman-teman! Saya dan tim sedang mengembangkan purwarupa aplikasi "MindEase" untuk PKM-KC tahun ini. Kami butuh partner yang nyaman dengan Figma, alur onboarding, dan eksplorasi visual yang ramah pengguna.',
    hashtags: ['#PKMKC', '#UIUXDesign', '#MentalHealthApp'],
    likes: 24,
    comments: 5,
};

const initialComments: Comment[] = [
    {
        id: 1,
        user: {
            name: 'Andi Saputra',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
        },
        content: 'Keren banget idenya! Izin tanya, lombanya kapan ya?',
        time: '1 jam yang lalu',
        likes: 2,
        replies: [
            {
                id: 101,
                user: {
                    name: 'Budi Santoso',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                },
                content: 'Setahu saya pendaftarannya tutup minggu depan kak.',
                time: '30 menit yang lalu',
            },
        ],
    },
    {
        id: 2,
        user: {
            name: 'Rina Putri',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        },
        content: 'Saya tertarik di bagian marketing! Cek DM ya.',
        time: '45 menit yang lalu',
        likes: 1,
        replies: [],
    },
    {
        id: 3,
        user: {
            name: 'Dimas Pratama',
            avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&q=80',
        },
        content: 'Kalau butuh bantu pitch deck, saya bisa ikut diskusi.',
        time: '20 menit yang lalu',
        likes: 0,
        replies: [],
    },
];

const currentUser = {
    name: 'Kamu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export default function DetailPost() {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [commentText, setCommentText] = useState('');
    const [replyTargetId, setReplyTargetId] = useState<number | null>(null);
    const [replyText, setReplyText] = useState('');
    const commentCount =
        post.comments + comments.length - initialComments.length;

    const submitComment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const content = commentText.trim();

        if (!content) {
            return;
        }

        setComments((currentComments) => [
            {
                id: Date.now(),
                user: currentUser,
                content,
                time: 'Baru saja',
                likes: 0,
                replies: [],
            },
            ...currentComments,
        ]);
        setCommentText('');
    };

    const submitReply = (
        event: FormEvent<HTMLFormElement>,
        commentId: number,
    ) => {
        event.preventDefault();

        const content = replyText.trim();

        if (!content) {
            return;
        }

        setComments((currentComments) =>
            currentComments.map((comment) =>
                comment.id === commentId
                    ? {
                          ...comment,
                          replies: [
                              ...comment.replies,
                              {
                                  id: Date.now(),
                                  user: currentUser,
                                  content,
                                  time: 'Baru saja',
                              },
                          ],
                      }
                    : comment,
            ),
        );
        setReplyText('');
        setReplyTargetId(null);
    };

    return (
        <>
            <Head title="Detail Postingan" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[760px] space-y-6">
                    <header className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.visit('/dashboard')}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#2C213B] transition hover:bg-white hover:shadow-[0_12px_30px_rgba(177,145,221,0.16)]"
                            aria-label="Kembali"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-[26px] font-bold text-[#221A32] sm:text-[30px]">
                            Detail Postingan
                        </h1>
                    </header>

                    <article className="rounded-[22px] border border-[#E9DDF5] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.14)] sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <img
                                    src={post.user.avatar}
                                    alt={post.user.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="min-w-0">
                                    <h2 className="truncate text-[15px] font-bold text-[#221A32]">
                                        {post.user.name}
                                    </h2>
                                    <p className="truncate text-sm leading-5 text-[#5F556F]">
                                        {post.user.major}
                                    </p>
                                    <p className="text-sm leading-5 text-[#8A7FA2]">
                                        {post.postedAt}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="rounded-full p-2 text-[#5F556F] transition hover:bg-[#F7F1FF]"
                                aria-label="Opsi postingan"
                            >
                                <span className="block text-lg leading-none">
                                    ...
                                </span>
                            </button>
                        </div>

                        {/* <div className="mt-4">
                            <span className="inline-flex rounded-full bg-[#F0E7FF] px-3 py-1 text-xs font-bold tracking-[0.04em] text-[#6610F2]">
                                {post.badge}
                            </span>
                        </div> */}

                        <div className="mt-4 space-y-4">
                            <h3 className="text-[24px] leading-[1.25] font-semibold text-[#221A32] sm:text-[28px]">
                                {post.title}
                            </h3>
                            <p className="text-[15px] leading-8 text-[#5A516C] sm:text-[16px]">
                                {post.description}
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#6610F2]">
                                {post.hashtags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-6 border-t border-[#E9DDF5] pt-5 text-sm font-semibold text-[#5F556F]">
                            <span className="inline-flex items-center gap-2">
                                <Heart className="h-5 w-5 fill-[#D11149] text-[#D11149]" />
                                {post.likes} Likes
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                {commentCount} Comments
                            </span>
                        </div>
                    </article>

                    <section className="rounded-[22px] border border-[#E9DDF5] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.14)] sm:p-6">
                        <h2 className="text-[24px] font-semibold text-[#221A32]">
                            Komentar ({commentCount})
                        </h2>

                        <form
                            onSubmit={submitComment}
                            className="mt-6 flex items-center gap-4"
                        >
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                            />
                            <div className="relative min-w-0 flex-1">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(event) =>
                                        setCommentText(event.target.value)
                                    }
                                    placeholder="Tulis komentar..."
                                    className="h-13 w-full rounded-full border-0 bg-[#E9E0F1] px-5 pr-14 text-[15px] text-[#382A49] outline-none placeholder:text-[#8A7FA2] focus:ring-4 focus:ring-[#6610F2]/15"
                                />
                                <button
                                    type="submit"
                                    className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#6610F2] text-white transition hover:brightness-105"
                                    aria-label="Kirim komentar"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>

                        <div className="mt-7 space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id}>
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={comment.user.avatar}
                                            alt={comment.user.name}
                                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="rounded-[18px] bg-[#F2ECF7] px-4 py-3">
                                                <h3 className="text-sm font-bold text-[#221A32]">
                                                    {comment.user.name}
                                                </h3>
                                                <p className="mt-1 text-[15px] leading-6 text-[#5A516C]">
                                                    {comment.content}
                                                </p>
                                            </div>

                                            <div className="mt-2 flex flex-wrap items-center gap-5 px-2 text-sm font-semibold text-[#7A6D8F]">
                                                <span>{comment.time}</span>
                                                <span>
                                                    {comment.likes}{' '}
                                                    {comment.likes === 1
                                                        ? 'Like'
                                                        : 'Likes'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReplyTargetId(
                                                            comment.id,
                                                        );
                                                        setReplyText('');
                                                    }}
                                                    className="text-[#0065A8] transition hover:text-[#6610F2]"
                                                >
                                                    Balas
                                                </button>
                                            </div>

                                            {replyTargetId === comment.id && (
                                                <form
                                                    onSubmit={(event) =>
                                                        submitReply(
                                                            event,
                                                            comment.id,
                                                        )
                                                    }
                                                    className="mt-3 flex items-center gap-3 pl-8"
                                                >
                                                    <input
                                                        type="text"
                                                        value={replyText}
                                                        onChange={(event) =>
                                                            setReplyText(
                                                                event.target
                                                                    .value,
                                                            )
                                                        }
                                                        placeholder="Tulis balasan..."
                                                        className="h-11 min-w-0 flex-1 rounded-full border-0 bg-[#F7F1FF] px-4 text-sm text-[#382A49] outline-none placeholder:text-[#8A7FA2] focus:ring-4 focus:ring-[#6610F2]/15"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6610F2] text-white transition hover:brightness-105"
                                                        aria-label="Kirim balasan"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            )}

                                            {comment.replies.length > 0 && (
                                                <div className="mt-4 space-y-3 border-l-2 border-[#E0D5EC] pl-8">
                                                    {comment.replies.map(
                                                        (reply) => (
                                                            <div
                                                                key={reply.id}
                                                                className="flex items-start gap-3"
                                                            >
                                                                <img
                                                                    src={
                                                                        reply
                                                                            .user
                                                                            .avatar
                                                                    }
                                                                    alt={
                                                                        reply
                                                                            .user
                                                                            .name
                                                                    }
                                                                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="rounded-[16px] bg-[#E9E0F1] px-4 py-3">
                                                                        <h4 className="text-sm font-bold text-[#221A32]">
                                                                            {
                                                                                reply
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        </h4>
                                                                        <p className="mt-1 text-[15px] leading-6 text-[#5A516C]">
                                                                            {
                                                                                reply.content
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="mt-2 px-2 text-sm font-semibold text-[#7A6D8F]">
                                                                        {
                                                                            reply.time
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}

DetailPost.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
