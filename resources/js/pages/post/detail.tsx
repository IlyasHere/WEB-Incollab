import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    MessageSquare,
    Reply,
    Send,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageLoading } from '@/hooks/use-page-loading';
import DashboardLayout from '@/layouts/DashboardLayout';

type DetailUser = {
    name: string;
    avatar?: string | null;
};

type DetailPost = {
    id: number;
    user: DetailUser & {
        major: string;
    };
    postedAt: string;
    title: string;
    description: string;
    hashtags: string[];
    comments: number;
    images: string[];
};

type Comment = {
    id: number;
    user: DetailUser;
    content: string;
    time: string;
    replies: Comment[];
};

type DetailPostProps = {
    post: DetailPost;
    comments: Comment[];
    currentUser: DetailUser;
};

type CommentForm = {
    content: string;
    parent_id?: number | null;
};

function initials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function Avatar({
    user,
    size = 'md',
}: {
    user: DetailUser;
    size?: 'sm' | 'md';
}) {
    const sizeClass = size === 'sm' ? 'h-9 w-9 text-xs' : 'h-11 w-11 text-sm';

    if (user.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user.name}
                className={`${sizeClass} shrink-0 rounded-full object-cover`}
            />
        );
    }

    return (
        <div
            className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] font-bold text-white`}
        >
            {initials(user.name)}
        </div>
    );
}

function DetailPostSkeleton() {
    return (
        <div className="mx-auto max-w-[760px] space-y-6">
            <header className="flex items-center gap-4">
                <Skeleton className="h-11 w-11 rounded-full" />
                <Skeleton className="h-8 w-56" />
            </header>

            <article className="overflow-hidden rounded-[22px] border border-[#E9DDF5] bg-white shadow-[0_18px_45px_rgba(177,145,221,0.14)]">
                <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-11 w-11 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-52" />
                        </div>
                    </div>
                    <Skeleton className="mt-6 h-8 w-4/5" />
                    <Skeleton className="mt-4 h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-11/12" />
                    <Skeleton className="mt-2 h-4 w-2/3" />
                </div>
                <Skeleton className="h-72 w-full rounded-none" />
                <div className="flex gap-6 border-t border-[#E9DDF5] px-5 py-5 sm:px-6">
                    <Skeleton className="h-5 w-28" />
                </div>
            </article>

            <section className="rounded-[22px] border border-[#E9DDF5] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.14)] sm:p-6">
                <Skeleton className="h-7 w-40" />
                <div className="mt-6 flex items-center gap-4">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <Skeleton className="h-13 flex-1 rounded-full" />
                </div>
                <div className="mt-7 space-y-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Skeleton className="h-11 w-11 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-24 w-full rounded-[18px]" />
                                <Skeleton className="mt-2 h-4 w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function DetailPost({
    post,
    comments,
    currentUser,
}: DetailPostProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const [replyRecipientName, setReplyRecipientName] = useState<string | null>(
        null,
    );
    const {
        data,
        setData,
        post: submitPost,
        processing,
        errors,
        reset,
    } = useForm<CommentForm>({
        content: '',
        parent_id: null,
    });
    const isLoading = usePageLoading();
    const {
        data: replyData,
        setData: setReplyData,
        post: submitReplyPost,
        processing: replyProcessing,
        errors: replyErrors,
        reset: resetReply,
    } = useForm<CommentForm>({
        content: '',
        parent_id: null,
    });

    const submitComment = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        submitPost(`/post/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => reset('content', 'parent_id'),
        });
    };

    const totalComments = comments.reduce(
        (total, comment) => total + 1 + comment.replies.length,
        0,
    );

    const startReply = (comment: Comment, recipient = comment) => {
        setReplyingTo(comment);
        setReplyRecipientName(recipient.user.name);
        setReplyData('parent_id', recipient.id);
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyRecipientName(null);
        resetReply('content', 'parent_id');
    };

    const submitReply = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        submitReplyPost(`/post/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: cancelReply,
        });
    };

    const activeImage = post.images[activeImageIndex];

    const goToPreviousImage = () => {
        setActiveImageIndex((currentIndex) =>
            currentIndex === 0 ? post.images.length - 1 : currentIndex - 1,
        );
    };

    const goToNextImage = () => {
        setActiveImageIndex((currentIndex) =>
            currentIndex === post.images.length - 1 ? 0 : currentIndex + 1,
        );
    };

    return (
        <>
            <Head title={post.title} />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                {isLoading ? (
                    <DetailPostSkeleton />
                ) : (
                    <div className="mx-auto max-w-[760px] space-y-6">
                        <header className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#2C213B] transition hover:bg-white hover:shadow-[0_12px_30px_rgba(177,145,221,0.16)]"
                                aria-label="Kembali"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </Link>
                            <h1 className="text-[26px] font-bold text-[#221A32] sm:text-[30px]">
                                Detail Postingan
                            </h1>
                        </header>

                        <article className="overflow-hidden rounded-[22px] border border-[#E9DDF5] bg-white shadow-[0_18px_45px_rgba(177,145,221,0.14)]">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <Avatar
                                            user={{
                                                name: post.user.name,
                                                avatar: post.user.avatar,
                                            }}
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

                                <div className="mt-4 space-y-4">
                                    <h3 className="text-[24px] leading-[1.25] font-semibold text-[#221A32] sm:text-[28px]">
                                        {post.title}
                                    </h3>
                                    <p className="text-[15px] leading-8 whitespace-pre-line text-[#5A516C] sm:text-[16px]">
                                        {post.description}
                                    </p>
                                    {post.hashtags.length > 0 && (
                                        <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#6610F2]">
                                            {post.hashtags.map((tag) => (
                                                <span key={tag}>{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {activeImage && (
                                <div className="relative">
                                    <img
                                        src={activeImage}
                                        alt={post.title}
                                        className="h-72 w-full object-cover"
                                    />
                                    {post.images.length > 1 && (
                                        <>
                                            <span className="absolute top-4 right-4 rounded-full bg-[#1F1730]/80 px-3 py-1 text-xs font-bold text-white">
                                                {activeImageIndex + 1}/
                                                {post.images.length}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={goToPreviousImage}
                                                className="absolute top-1/2 left-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#382A49] shadow transition hover:bg-white"
                                                aria-label="Gambar sebelumnya"
                                            >
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={goToNextImage}
                                                className="absolute top-1/2 right-4 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#382A49] shadow transition hover:bg-white"
                                                aria-label="Gambar berikutnya"
                                            >
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                                                {post.images.map(
                                                    (image, index) => (
                                                        <button
                                                            key={`${image}-${index}`}
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveImageIndex(
                                                                    index,
                                                                )
                                                            }
                                                            className={`h-2 rounded-full transition ${
                                                                index ===
                                                                activeImageIndex
                                                                    ? 'w-6 bg-white'
                                                                    : 'w-2 bg-white/60'
                                                            }`}
                                                            aria-label={`Lihat gambar ${
                                                                index + 1
                                                            }`}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-6 border-t border-[#E9DDF5] px-5 py-5 text-sm font-semibold text-[#5F556F] sm:px-6">
                                <span className="inline-flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    {totalComments} Comments
                                </span>
                            </div>
                        </article>

                        <section className="rounded-[22px] border border-[#E9DDF5] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.14)] sm:p-6">
                            <h2 className="text-[24px] font-semibold text-[#221A32]">
                                Komentar ({totalComments})
                            </h2>

                            <form
                                onSubmit={submitComment}
                                className="mt-6 flex items-center gap-4"
                            >
                                <Avatar user={currentUser} />
                                <div className="relative min-w-0 flex-1">
                                    <input
                                        type="text"
                                        value={data.content}
                                        onChange={(event) =>
                                            setData(
                                                'content',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Tulis komentar..."
                                        className="h-13 w-full rounded-full border-0 bg-[#E9E0F1] px-5 pr-14 text-[15px] text-[#382A49] outline-none placeholder:text-[#8A7FA2] focus:ring-4 focus:ring-[#6610F2]/15"
                                    />
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#6610F2] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                                        aria-label="Kirim komentar"
                                    >
                                        {processing ? (
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </form>

                            {errors.content && (
                                <p className="mt-2 pl-16 text-sm font-semibold text-[#D11149]">
                                    {errors.content}
                                </p>
                            )}

                            <div className="mt-7 space-y-6">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <Avatar user={comment.user} />

                                                <div className="min-w-0 flex-1">
                                                    <div className="rounded-[18px] bg-[#F2ECF7] px-4 py-3">
                                                        <h3 className="text-sm font-bold text-[#221A32]">
                                                            {comment.user.name}
                                                        </h3>
                                                        <p className="mt-1 text-[15px] leading-6 whitespace-pre-line text-[#5A516C]">
                                                            {comment.content}
                                                        </p>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap items-center gap-5 px-2 text-sm font-semibold text-[#7A6D8F]">
                                                        <span>
                                                            {comment.time}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startReply(
                                                                    comment,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 transition hover:text-[#6610F2]"
                                                        >
                                                            <Reply className="h-4 w-4" />
                                                            Balas
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {comment.replies.length > 0 && (
                                                <div className="space-y-4 border-l-2 border-[#E9DDF5] pl-5 sm:ml-[62px]">
                                                    {comment.replies.map(
                                                        (reply) => (
                                                            <div
                                                                key={reply.id}
                                                                className="flex items-start gap-3"
                                                            >
                                                                <Avatar
                                                                    user={
                                                                        reply.user
                                                                    }
                                                                    size="sm"
                                                                />

                                                                <div className="min-w-0 flex-1">
                                                                    <div className="rounded-[16px] bg-[#F8F3FF] px-4 py-3">
                                                                        <h4 className="text-sm font-bold text-[#221A32]">
                                                                            {
                                                                                reply
                                                                                    .user
                                                                                    .name
                                                                            }
                                                                        </h4>
                                                                        <p className="mt-1 text-[15px] leading-6 whitespace-pre-line text-[#5A516C]">
                                                                            {
                                                                                reply.content
                                                                            }
                                                                        </p>
                                                                    </div>

                                                                    <div className="mt-2 flex flex-wrap items-center gap-5 px-2 text-sm font-semibold text-[#7A6D8F]">
                                                                        <span>
                                                                            {
                                                                                reply.time
                                                                            }
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                startReply(
                                                                                    comment,
                                                                                    reply,
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1.5 transition hover:text-[#6610F2]"
                                                                        >
                                                                            <Reply className="h-4 w-4" />
                                                                            Balas
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            {replyingTo?.id === comment.id && (
                                                <form
                                                    onSubmit={submitReply}
                                                    className="flex items-center gap-3 sm:ml-[62px]"
                                                >
                                                    <Avatar
                                                        user={currentUser}
                                                        size="sm"
                                                    />
                                                    <div className="relative min-w-0 flex-1">
                                                        <input
                                                            type="text"
                                                            value={
                                                                replyData.content
                                                            }
                                                            onChange={(event) =>
                                                                setReplyData(
                                                                    'content',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder={`Balas ${replyRecipientName ?? comment.user.name}...`}
                                                            className="h-11 w-full rounded-full border-0 bg-[#E9E0F1] px-4 pr-24 text-sm text-[#382A49] outline-none placeholder:text-[#8A7FA2] focus:ring-4 focus:ring-[#6610F2]/15"
                                                        />
                                                        <div className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    cancelReply
                                                                }
                                                                className="rounded-full px-3 py-1.5 text-xs font-bold text-[#7A6D8F] transition hover:bg-white"
                                                            >
                                                                Batal
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    replyProcessing
                                                                }
                                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6610F2] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                                                                aria-label="Kirim balasan"
                                                            >
                                                                {replyProcessing ? (
                                                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Send className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            )}

                                            {replyingTo?.id === comment.id &&
                                                replyErrors.content && (
                                                    <p className="text-sm font-semibold text-[#D11149] sm:ml-[110px]">
                                                        {replyErrors.content}
                                                    </p>
                                                )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-[18px] border border-dashed border-[#D8C4F0] bg-[#FDF7FF] px-5 py-8 text-center">
                                        <MessageSquare className="mx-auto h-8 w-8 text-[#BCA6D8]" />
                                        <h3 className="mt-3 text-base font-bold text-[#221A32]">
                                            Belum ada komentar
                                        </h3>
                                        <p className="mt-1 text-sm text-[#766B8A]">
                                            Jadilah yang pertama menanggapi
                                            postingan ini.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </>
    );
}

DetailPost.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
