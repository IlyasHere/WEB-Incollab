import {
    ChevronLeft,
    ChevronRight,
    ImageIcon,
    MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

export type FeedPreviewUser = {
    user_id: number;
    name: string;
    email: string;
    avatar?: string | null;
    mahasiswa?: {
        foto?: string | null;
        universitas?: string | null;
        jurusan?: string | null;
    } | null;
};

export type FeedPreviewImage = {
    url: string;
    name?: string;
};

type FeedLivePreviewProps = {
    user: FeedPreviewUser;
    title: string;
    content: string;
    tags: string[];
    images: FeedPreviewImage[];
};

function resolveAssetUrl(path?: string | null) {
    if (!path) {
        return null;
    }

    if (path.startsWith('http') || path.startsWith('/')) {
        return path;
    }

    return `/storage/${path}`;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function FeedLivePreview({
    user,
    title,
    content,
    tags,
    images,
}: FeedLivePreviewProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const mahasiswaInfo = [
        user.mahasiswa?.jurusan,
        user.mahasiswa?.universitas,
    ].filter(Boolean);
    const avatarUrl =
        resolveAssetUrl(user.mahasiswa?.foto) ?? resolveAssetUrl(user.avatar);
    const safeActiveImageIndex =
        images.length === 0 ? 0 : Math.min(activeImageIndex, images.length - 1);
    const activeImage = images[safeActiveImageIndex];

    const goToPreviousImage = () => {
        setActiveImageIndex((currentIndex) =>
            currentIndex === 0 ? images.length - 1 : currentIndex - 1,
        );
    };

    const goToNextImage = () => {
        setActiveImageIndex((currentIndex) =>
            currentIndex === images.length - 1 ? 0 : currentIndex + 1,
        );
    };

    return (
        <article className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(177,145,221,0.16)]">
            <div className="p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={user.name}
                            className="h-11 w-11 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-sm font-bold text-white">
                            {getInitials(user.name)}
                        </div>
                    )}

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[#1F1730]">
                            {user.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-medium text-[#766B8A]">
                            {mahasiswaInfo.length > 0
                                ? mahasiswaInfo.join(' • ')
                                : 'Mahasiswa'}{' '}
                            • Baru saja
                        </p>
                    </div>
                </div>

                <div className="mt-5 space-y-3">
                    <h2 className="text-xl leading-snug font-extrabold text-[#1F1730]">
                        {title || 'Judul postinganmu akan tampil di sini'}
                    </h2>
                    <p className="line-clamp-5 text-sm leading-7 text-[#5F5573]">
                        {content ||
                            'Deskripsi postinganmu akan tampil di sini...'}
                    </p>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-sm font-bold text-[#6610F2]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {activeImage ? (
                <div className="relative">
                    <img
                        src={activeImage.url}
                        alt={activeImage.name ?? 'Preview gambar postingan'}
                        className="h-64 w-full object-cover"
                    />
                    {images.length > 1 && (
                        <>
                            <span className="absolute top-4 right-4 rounded-full bg-[#1F1730]/80 px-3 py-1 text-xs font-bold text-white">
                                {safeActiveImageIndex + 1}/{images.length}
                            </span>
                            <button
                                type="button"
                                onClick={goToPreviousImage}
                                className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#382A49] shadow transition hover:bg-white"
                                aria-label="Gambar sebelumnya"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={goToNextImage}
                                className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#382A49] shadow transition hover:bg-white"
                                aria-label="Gambar berikutnya"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                                {images.map((image, index) => (
                                    <button
                                        key={`${image.url}-${index}`}
                                        type="button"
                                        onClick={() =>
                                            setActiveImageIndex(index)
                                        }
                                        className={`h-2 rounded-full transition ${
                                            index === safeActiveImageIndex
                                                ? 'w-5 bg-white'
                                                : 'w-2 bg-white/60'
                                        }`}
                                        aria-label={`Lihat gambar ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="mx-5 mb-5 flex h-44 items-center justify-center rounded-2xl border border-dashed border-[#D8C4F0] bg-[#FDF7FF] text-[#8B8496] sm:mx-6 sm:mb-6">
                    <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-[#C7B6DC]" />
                        <p className="mt-2 text-sm font-semibold">
                            Preview foto akan tampil di sini
                        </p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between border-t border-[#F3EBFA] px-5 py-4 text-sm text-[#4F465F] sm:px-6">
                <div className="flex items-center gap-5">
                    <span className="inline-flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />0
                    </span>
                </div>
                <span className="font-bold text-[#6610F2]">Lihat detail</span>
            </div>
        </article>
    );
}
