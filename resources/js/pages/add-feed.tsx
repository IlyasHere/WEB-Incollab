import { Head, Link, useForm } from '@inertiajs/react';
import { ImagePlus, LoaderCircle, Send, Trash2, X } from 'lucide-react';
import type { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import FeedLivePreview from '@/components/feed/FeedLivePreview';
import type { FeedPreviewUser } from '@/components/feed/FeedLivePreview';
import LivePreviewModal from '@/components/feed/LivePreviewModal';
import DashboardLayout from '@/layouts/DashboardLayout';

type AddFeedProps = {
    user: FeedPreviewUser;
};

type FeedForm = {
    title: string;
    content: string;
    tags: string[];
    images: File[];
};

function normalizeTag(value: string) {
    const tag = value.trim().replace(/^#+/, '');

    if (!tag) {
        return null;
    }

    return `#${tag}`;
}

export default function AddFeed({ user }: AddFeedProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [fileError, setFileError] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const { data, setData, post, processing, errors, transform } =
        useForm<FeedForm>({
            title: '',
            content: '',
            tags: [],
            images: [],
        });
    const errorMessages = Object.values(errors).filter(Boolean);

    const previewImages = useMemo(
        () =>
            data.images.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            })),
        [data.images],
    );

    useEffect(() => {
        return () =>
            previewImages.forEach((preview) =>
                URL.revokeObjectURL(preview.url),
            );
    }, [previewImages]);

    const addTags = (rawValue: string) => {
        const nextTags = rawValue
            .split(',')
            .map((tag) => normalizeTag(tag))
            .filter((tag): tag is string => Boolean(tag));

        if (nextTags.length === 0) {
            return;
        }

        setData(
            'tags',
            [...data.tags, ...nextTags].filter(
                (tag, index, array) => array.indexOf(tag) === index,
            ),
        );

        setTagInput('');
    };

    const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            addTags(tagInput);
        }
    };

    const handleTagChange = (value: string) => {
        if (value.includes(',')) {
            addTags(value);

            return;
        }

        setTagInput(value);
    };

    const removeTag = (tag: string) => {
        setData(
            'tags',
            data.tags.filter((item) => item !== tag),
        );
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) {
            return;
        }

        const validFiles: File[] = [];
        let message = '';

        if (data.images.length + files.length > 3) {
            setFileError('Maksimal 3 gambar per postingan.');

            return;
        }

        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) {
                message = 'File harus berupa gambar.';

                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                message = 'Ukuran gambar maksimal 2MB per file.';

                return;
            }

            validFiles.push(file);
        });

        setFileError(message);
        setData('images', [...data.images, ...validFiles]);
    };

    const removeImage = (index: number) => {
        setData(
            'images',
            data.images.filter((_, imageIndex) => imageIndex !== index),
        );
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const pendingTag = normalizeTag(tagInput);
        const submitTags = pendingTag
            ? [...data.tags, pendingTag].filter(
                  (tag, index, array) => array.indexOf(tag) === index,
              )
            : data.tags;

        transform((formData) => ({
            ...formData,
            tags: submitTags,
        }));
        post('/add-feed', {
            forceFormData: true,
            preserveScroll: true,
        });
        setTagInput('');
    };

    return (
        <>
            <Head title="Buat Postingan" />

            <main className="bg-[#FBF7FF] px-4 py-6 pb-28 sm:px-6 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1180px] space-y-6">
                    <section>
                        <Link
                            href="/dashboard"
                            className="text-sm font-bold text-[#5F5573] transition hover:text-[#6610F2]"
                        >
                            ← Kembali ke Beranda
                        </Link>
                        <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.01em] text-[#1F1730]">
                            Buat Postingan
                        </h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5F5573] sm:text-base">
                            Lengkapi postinganmu agar pengguna lain bisa
                            memahami kebutuhan kolaborasimu.
                        </p>
                    </section>

                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.95fr)] lg:items-start">
                        <form
                            onSubmit={submit}
                            encType="multipart/form-data"
                            className="rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.16)] sm:p-7"
                        >
                            <div className="space-y-6">
                                {errorMessages.length > 0 && (
                                    <div className="rounded-2xl border border-[#FFD3DD] bg-[#FFF0F4] px-4 py-3 text-sm font-semibold text-[#D11149]">
                                        <p>Postingan belum bisa dikirim:</p>
                                        <ul className="mt-2 list-disc space-y-1 pl-5">
                                            {errorMessages.map((message) => (
                                                <li key={message}>{message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <label className="block">
                                    <span className="text-sm font-bold text-[#1F1730]">
                                        Judul Postingan
                                    </span>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        placeholder="Contoh: Mencari UI/UX Designer untuk Proyek Aplikasi Kesehatan Mental"
                                        className="mt-2 h-12 w-full rounded-xl border border-[#D8CDE8] bg-[#FDF7FF] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                    {errors.title && (
                                        <p className="mt-2 text-sm font-semibold text-[#D11149]">
                                            {errors.title}
                                        </p>
                                    )}
                                </label>

                                <label className="block">
                                    <span className="text-sm font-bold text-[#1F1730]">
                                        Isi Postingan
                                    </span>
                                    <textarea
                                        value={data.content}
                                        onChange={(event) =>
                                            setData(
                                                'content',
                                                event.target.value,
                                            )
                                        }
                                        rows={7}
                                        placeholder="Jelaskan ide, kebutuhan tim, atau kolaborasi yang sedang kamu cari..."
                                        className="mt-2 w-full resize-none rounded-xl border border-[#D8CDE8] bg-[#FDF7FF] px-4 py-3 text-sm leading-7 text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                    {errors.content && (
                                        <p className="mt-2 text-sm font-semibold text-[#D11149]">
                                            {errors.content}
                                        </p>
                                    )}
                                </label>

                                <div>
                                    <label className="block">
                                        <span className="text-sm font-bold text-[#1F1730]">
                                            Tag / Hashtag
                                        </span>
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(event) =>
                                                handleTagChange(
                                                    event.target.value,
                                                )
                                            }
                                            onKeyDown={handleTagKeyDown}
                                            onBlur={() => addTags(tagInput)}
                                            placeholder="Contoh: #UIUXDesign #Hackathon #PKM"
                                            className="mt-2 h-12 w-full rounded-xl border border-[#D8CDE8] bg-[#FDF7FF] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                        />
                                    </label>

                                    {data.tags.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {data.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center gap-2 rounded-full bg-[#F0E7FF] px-3 py-1.5 text-sm font-bold text-[#6610F2]"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeTag(tag)
                                                        }
                                                        className="rounded-full hover:bg-white/70"
                                                        aria-label={`Hapus ${tag}`}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <span className="text-sm font-bold text-[#1F1730]">
                                        Upload Foto
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                        className="mt-2 flex min-h-[180px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D8C4F0] bg-[#FDF7FF] px-4 text-center transition hover:border-[#6610F2]/50 hover:bg-[#F8F1FF]"
                                    >
                                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8D9FF] text-[#6610F2]">
                                            <ImagePlus className="h-7 w-7" />
                                        </span>
                                        <p className="mt-4 text-base font-bold text-[#1F1730]">
                                            Klik untuk Upload Foto
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-[#766B8A]">
                                            Unggah 1 atau lebih foto untuk
                                            melengkapi postinganmu.
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-[#8B8496]">
                                            PNG, JPG, GIF, WEBP (Maks. 2MB,
                                            maksimal 3 gambar)
                                        </p>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(event) =>
                                            handleFiles(event.target.files)
                                        }
                                    />
                                    {(fileError || errors.images) && (
                                        <p className="mt-2 text-sm font-semibold text-[#D11149]">
                                            {fileError || errors.images}
                                        </p>
                                    )}

                                    {previewImages.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {previewImages.map(
                                                (image, index) => (
                                                    <div
                                                        key={image.url}
                                                        className="group relative h-24 w-24 overflow-hidden rounded-xl border border-[#EFE4F8]"
                                                    >
                                                        <img
                                                            src={image.url}
                                                            alt={
                                                                image.name ??
                                                                'Preview'
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                        {index === 0 &&
                                                            previewImages.length >
                                                                1 && (
                                                                <span className="absolute right-2 bottom-2 rounded-full bg-[#1F1730]/80 px-2 py-0.5 text-xs font-bold text-white">
                                                                    1/
                                                                    {
                                                                        previewImages.length
                                                                    }
                                                                </span>
                                                            )}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index,
                                                                )
                                                            }
                                                            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#D11149] opacity-100 shadow transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                                                            aria-label="Hapus gambar"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-3 border-t border-[#EFE4F8] pt-6 sm:flex-row sm:justify-end">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[#D8CDE8] px-8 text-sm font-bold text-[#382A49] transition hover:bg-[#F7F1FF]"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-8 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                    Posting
                                </button>
                            </div>
                        </form>

                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <h2 className="text-xl font-extrabold text-[#1F1730]">
                                    Live Preview
                                </h2>
                                <FeedLivePreview
                                    user={user}
                                    title={data.title}
                                    content={data.content}
                                    tags={data.tags}
                                    images={previewImages}
                                />
                                <p className="px-4 text-center text-sm leading-6 text-[#766B8A]">
                                    Tampilan ini adalah simulasi bagaimana
                                    postinganmu akan terlihat di Beranda.
                                </p>
                            </div>
                        </aside>
                    </div>

                    <button
                        type="button"
                        onClick={() => setPreviewOpen(true)}
                        className="fixed right-4 bottom-5 left-4 z-40 inline-flex h-12 items-center justify-center rounded-2xl bg-[#6610F2] text-sm font-bold text-white shadow-[0_18px_35px_rgba(102,16,242,0.28)] lg:hidden"
                    >
                        Lihat Preview
                    </button>
                </div>
            </main>

            <LivePreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                user={user}
                title={data.title}
                content={data.content}
                tags={data.tags}
                images={previewImages}
            />
        </>
    );
}

AddFeed.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
