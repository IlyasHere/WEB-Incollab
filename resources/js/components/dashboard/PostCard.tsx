import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    MessageSquare,
    MoreHorizontal,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';

export type FeedPost = {
    id: number;
    user: {
        name: string;
        major: string;
        avatar?: string | null;
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
    images?: string[];
    canDelete?: boolean;
};

type PostCardProps = {
    post: FeedPost;
};

export default function PostCard({ post }: PostCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = useMemo(() => {
        if (post.images?.length) {
            return post.images;
        }

        return post.image ? [post.image] : [];
    }, [post.image, post.images]);

    const hasCarousel = images.length > 1;
    const displayedImageIndex =
        images.length > 0 ? activeImageIndex % images.length : 0;

    const initials = post.user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const handleDelete = () => {
        setIsDeleting(true);

        router.delete(`/post/${post.id}`, {
            preserveScroll: true,
            onFinish: () => setIsDeleting(false),
            onSuccess: () => setDeleteDialogOpen(false),
        });
    };

    const showPreviousImage = () => {
        setActiveImageIndex((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    };

    const showNextImage = () => {
        setActiveImageIndex((current) => (current + 1) % images.length);
    };

    useEffect(() => {
        if (!hasCarousel) {
            return;
        }

        const interval = window.setInterval(() => {
            setActiveImageIndex((current) => (current + 1) % images.length);
        }, 4000);

        return () => window.clearInterval(interval);
    }, [hasCarousel, images.length]);

    return (
        <>
            <article className="rounded-[30px] border border-white/70 bg-white p-5 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        {post.user.avatar ? (
                            <img
                                src={post.user.avatar}
                                alt={post.user.name}
                                className="h-12 w-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-sm font-bold text-white">
                                {initials}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className="truncate text-[18px] font-bold text-[#1F1730]">
                                {post.user.name}
                            </h2>
                            <p className="truncate text-sm text-[#766B8A]">
                                {post.user.major} • {post.postedAt}
                            </p>
                        </div>
                    </div>

                    {post.canDelete && (
                        <div className="group relative">
                            <button
                                type="button"
                                className="rounded-full p-2 text-[#9689AF] transition hover:bg-[#F8F3FF] hover:text-[#4B3A68]"
                                aria-label="Opsi postingan"
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </button>

                            <div className="invisible absolute top-9 right-0 z-10 w-36 translate-y-1 rounded-2xl border border-[#EEE4F9] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(56,42,73,0.12)] transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#D11149] transition hover:bg-[#FFF0F4]"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* <div className="mt-5">
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-[0.04em] ${post.badgeColor}`}
                >
                    {post.badge}
                </span>
            </div> */}

                <div className="mt-4 space-y-4">
                    <h3 className="max-w-3xl text-[28px] leading-[1.2] font-bold text-[#221A32] sm:text-[34px]">
                        {post.title}
                    </h3>
                    <p className="text-[15px] leading-8 text-[#5A516C] sm:text-[16px]">
                        {post.description}
                    </p>

                    {images.length > 0 && (
                        <div className="group/carousel relative overflow-hidden rounded-[22px] border border-[#EEE4F9]">
                            <button
                                type="button"
                                onClick={hasCarousel ? showNextImage : undefined}
                                className="block w-full cursor-pointer"
                                aria-label={
                                    hasCarousel
                                        ? 'Lihat foto berikutnya'
                                        : post.title
                                }
                            >
                                <img
                                    src={images[displayedImageIndex]}
                                    alt={`${post.title} foto ${displayedImageIndex + 1}`}
                                    className="h-52 w-full object-cover object-center transition duration-500 sm:h-72"
                                />
                            </button>

                            {hasCarousel && (
                                <>
                                    <button
                                        type="button"
                                        onClick={showPreviousImage}
                                        className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#382A49] opacity-0 shadow-[0_10px_24px_rgba(56,42,73,0.18)] transition hover:bg-white group-hover/carousel:opacity-100 focus:opacity-100"
                                        aria-label="Foto sebelumnya"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={showNextImage}
                                        className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#382A49] opacity-0 shadow-[0_10px_24px_rgba(56,42,73,0.18)] transition hover:bg-white group-hover/carousel:opacity-100 focus:opacity-100"
                                        aria-label="Foto berikutnya"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>

                                    <div className="absolute right-0 bottom-3 left-0 flex justify-center gap-2">
                                        {images.map((image, index) => (
                                            <button
                                                type="button"
                                                key={`${image}-${index}`}
                                                onClick={() =>
                                                    setActiveImageIndex(index)
                                                }
                                                className={`h-2.5 rounded-full transition ${
                                                    index === displayedImageIndex
                                                        ? 'w-6 bg-white'
                                                        : 'w-2.5 bg-white/60 hover:bg-white/80'
                                                }`}
                                                aria-label={`Tampilkan foto ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
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
                    </div>
                    {/* 
                <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#6610F2] px-6 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(102,16,242,0.24)] transition hover:brightness-105 sm:min-w-[150px]"
                >
                    Lihat detail
                </button> */}
                    <Link
                        href={`/post/${post.id}`}
                        className="inline-flex items-center justify-center rounded-full bg-[#6610F2] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(102,16,242,0.22)] transition hover:-translate-y-0.5 hover:bg-[#570DD1] hover:shadow-[0_14px_30px_rgba(102,16,242,0.28)]"
                    >
                        Lihat detail
                    </Link>
                </div>
            </article>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="border-[#EEE4F9] bg-white text-[#1F1730] sm:max-w-md">
                    <DialogTitle>Hapus postingan?</DialogTitle>
                    <DialogDescription className="leading-6 text-[#766B8A]">
                        Apakah anda yakin ingin menghapus postingan ini?
                        Postingan, foto, dan komentarnya akan dihapus.
                    </DialogDescription>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#E7DDF2] px-4 text-sm font-semibold text-[#5F556F] transition hover:bg-[#F8F3FF] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#D11149] px-4 text-sm font-semibold text-white transition hover:bg-[#B90E3F] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
