import { useForm } from '@inertiajs/react';
import { Clock3, ImagePlus, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SettingsPageLayout from '@/layouts/SettingsPageLayout';

// ─── InCollab Brand Colors (Light Mode) ───────────────────────────────────────
const PURPLE = '#6610F2';
const PURPLE_DARK = '#5A0DC8';
const PURPLE_LIGHT = '#F0E7FF'; // background accordion aktif
const PURPLE_BORDER = 'rgba(102, 16, 242, 0.30)';
const PURPLE_GLOW = 'rgba(102, 16, 242, 0.15)';

// ─── Dark mode colors (disabled for now) ─────────────────────────────────────
// const PURPLE_DM_BG   = 'rgba(102, 16, 242, 0.20)'; // dark:bg accordion aktif
// const PURPLE_DM_TEXT = '#A78BFA';                   // dark:text accordion aktif & chevron
// const PURPLE_DM_GLOW = 'rgba(102, 16, 242, 0.10)'; // dark:shadow textarea focus

// ─── Types ───────────────────────────────────────────────────────────────────

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

interface AccordionItemProps {
    item: FaqItem;
}

type ReportImage = {
    file: File;
    previewUrl: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS: FaqItem[] = [
    {
        id: 1,
        question: 'Bagaimana cara mendapatkan poin?',
        answer: 'Kamu bisa mendapatkan poin dengan mengikuti event yang diselenggarakan oleh admin, membagikan catatan belajar, atau berpartisipasi aktif dalam diskusi forum komunitas InCollab.',
    },
    {
        id: 2,
        question: 'Bagaimana cara menukar poin dengan reward?',
        answer: 'Kamu dapat menukar poin dengan reward melalui menu Riwayat Poin. Pilih reward yang tersedia dan konfirmasi penukaran poin kamu.',
    },
    {
        id: 3,
        question: 'Bagaimana cara membuat postingan?',
        answer: "Untuk membuat postingan, kamu bisa menekan tombol '+' atau 'Buat Postingan' yang tersedia di halaman utama, lalu isi judul, deskripsi, dan lampirkan file jika diperlukan.",
    },
    {
        id: 4,
        question: 'Bagaimana menghubungi admin?',
        answer: "Kamu bisa menghubungi admin melalui form 'Hubungi Kami' di halaman ini, atau melalui email resmi admin@incollab.id.",
    },
];

const REPORT_TOPIC_OPTIONS: string[] = [
    'Akun mencurigakan',
    'Postingan bermasalah',
    'Komentar tidak pantas',
    'Event mencurigakan',
    'Bug atau kendala teknis',
    'Lainnya',
];

// ─── AccordionItem ────────────────────────────────────────────────────────────

function AccordionItem({ item }: AccordionItemProps) {
    const [open, setOpen] = useState<boolean>(item.id === 1);

    return (
        <div
            className="overflow-hidden rounded-xl transition-all duration-200"
            style={{
                border: open
                    ? `1px solid ${PURPLE_BORDER}`
                    : '1px solid var(--border)',
            }}
        >
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-[#F0E7FF]/50"
                style={{
                    background: open ? PURPLE_LIGHT : 'transparent',
                    // dark mode (disabled):
                    // background: open ? PURPLE_DM_BG : 'transparent',
                }}
            >
                <span
                    className="text-sm"
                    style={{
                        color: open ? PURPLE : 'var(--foreground)',
                        // dark mode (disabled):
                        // color: open ? PURPLE_DM_TEXT : 'var(--foreground)',
                        fontWeight: open ? 600 : 500,
                    }}
                >
                    {item.question}
                </span>

                {/* Chevron */}
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-transform duration-200"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        stroke: open ? PURPLE : 'var(--muted-foreground)',
                        // dark mode (disabled):
                        // stroke: open ? PURPLE_DM_TEXT : 'var(--muted-foreground)',
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Answer body */}
            <div
                style={{
                    maxHeight: open ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                }}
            >
                <div
                    className="px-5 pt-3 pb-4 text-sm leading-relaxed text-muted-foreground"
                    style={{ borderTop: `1px solid ${PURPLE_BORDER}` }}
                >
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PengaturanBantuan() {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [textareaFocused, setTextareaFocused] = useState<boolean>(false);
    const [reportImages, setReportImages] = useState<ReportImage[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm<{
        kategori_laporan: string;
        isi_laporan: string;
        images: File[];
    }>({
        kategori_laporan: '',
        isi_laporan: '',
        images: [],
    });

    const handleSend = (): void => {
        if (!data.kategori_laporan || !data.isi_laporan.trim()) {
            return;
        }

        post('/pengaturan/bantuan/laporan', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
                reportImages.forEach((image) =>
                    URL.revokeObjectURL(image.previewUrl),
                );
                setReportImages([]);
                setImageError(null);

                window.setTimeout(() => {
                    setSubmitted(false);
                }, 2500);
            },
        });
    };

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setImageError(null);

        if (reportImages.length + files.length > 3) {
            setImageError('Maksimal 3 gambar untuk bukti laporan.');
            event.target.value = '';

            return;
        }

        const nextImages: ReportImage[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setImageError('File bukti harus berupa gambar.');
                event.target.value = '';

                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                setImageError('Ukuran gambar maksimal 2MB per file.');
                event.target.value = '';

                return;
            }

            nextImages.push({
                file,
                previewUrl: URL.createObjectURL(file),
            });
        }

        const mergedImages = [...reportImages, ...nextImages];

        setReportImages(mergedImages);
        setData(
            'images',
            mergedImages.map((image) => image.file),
        );
        event.target.value = '';
    };

    const removeImage = (index: number) => {
        setReportImages((current) => {
            const image = current[index];

            if (image) {
                URL.revokeObjectURL(image.previewUrl);
            }

            const nextImages = current.filter(
                (_, itemIndex) => itemIndex !== index,
            );

            setData(
                'images',
                nextImages.map((item) => item.file),
            );

            return nextImages;
        });
    };

    const isDisabled =
        processing || !data.kategori_laporan || !data.isi_laporan.trim();

    return (
        <SettingsPageLayout title="Bantuan">
            <div className="flex flex-col gap-6">
                {/* ── FAQ Section ── */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <div className="mb-5">
                        <p className="text-xs font-bold tracking-[0.14em] text-[#6610F2] uppercase">
                            Pusat Bantuan
                        </p>
                        <h2 className="mt-2 text-lg font-extrabold text-[#1F1730]">
                            Pertanyaan yang Sering Ditanyakan
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                            Buka panduan cepat ini kalau kamu hanya ingin
                            mencari jawaban tanpa membuat laporan baru.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {FAQ_ITEMS.map((item) => (
                            <AccordionItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#EFE4F8]" />
                    <span className="rounded-full bg-[#F0E7FF] px-4 py-2 text-xs font-extrabold tracking-wide text-[#6610F2] uppercase">
                        Form Laporan Pengguna
                    </span>
                    <div className="h-px flex-1 bg-[#EFE4F8]" />
                </div>

                {/* ── Laporan Pengguna Section ── */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                    <div className="mb-6 rounded-2xl border border-[#EFE4F8] bg-[#FBF7FF] p-5">
                        <p className="text-xs font-bold tracking-[0.14em] text-[#6610F2] uppercase">
                            Kirim Laporan
                        </p>
                        <h2 className="mt-2 text-lg font-extrabold text-[#1F1730]">
                            Laporkan Masalah ke Admin
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                            Gunakan form ini untuk melaporkan pengguna, konten,
                            event, atau aktivitas yang perlu ditinjau admin.
                            Lampirkan gambar bukti jika ada.
                        </p>
                    </div>

                    {/* Topik */}
                    <div className="mb-4">
                        <label className="mb-1.5 block text-xs font-semibold text-foreground">
                            Kategori Laporan
                        </label>
                        <Select
                            value={data.kategori_laporan}
                            onValueChange={(value) =>
                                setData('kategori_laporan', value)
                            }
                        >
                            <SelectTrigger
                                className="w-full [&_[data-slot=select-value]]:text-foreground"
                                style={
                                    data.kategori_laporan
                                        ? { borderColor: PURPLE }
                                        : {}
                                }
                            >
                                <SelectValue placeholder="Pilih kategori laporan" />
                            </SelectTrigger>
                            <SelectContent>
                                {REPORT_TOPIC_OPTIONS.map((opt) => (
                                    <SelectItem
                                        key={opt}
                                        value={opt}
                                        // light mode: ungu muda saat hover
                                        className="focus:bg-[#F0E7FF] focus:text-[#6610F2]"
                                        // dark mode (disabled):
                                        // className="focus:bg-[#6610F2]/20 focus:text-[#A78BFA]"
                                    >
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.kategori_laporan && (
                            <p className="mt-2 text-sm font-medium text-[#D11149]">
                                {errors.kategori_laporan}
                            </p>
                        )}
                    </div>

                    {/* Pesan */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-xs font-semibold text-foreground">
                            Deskripsi Laporan
                        </label>
                        <textarea
                            value={data.isi_laporan}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                setData('isi_laporan', e.target.value)
                            }
                            onFocus={() => setTextareaFocused(true)}
                            onBlur={() => setTextareaFocused(false)}
                            placeholder="Jelaskan kronologi atau detail masalah yang ingin dilaporkan..."
                            rows={5}
                            className="flex w-full resize-y rounded-md border bg-transparent px-3 py-2 text-sm text-foreground shadow-xs transition-all duration-200 outline-none placeholder:text-muted-foreground"
                            style={{
                                // light mode: border & glow ungu
                                borderColor: textareaFocused
                                    ? PURPLE
                                    : 'var(--border)',
                                boxShadow: textareaFocused
                                    ? `0 0 0 3px ${PURPLE_GLOW}`
                                    : 'none',
                                // dark mode (disabled):
                                // boxShadow: textareaFocused ? `0 0 0 3px ${PURPLE_DM_GLOW}` : 'none',
                            }}
                        />
                        {errors.isi_laporan && (
                            <p className="mt-2 text-sm font-medium text-[#D11149]">
                                {errors.isi_laporan}
                            </p>
                        )}
                    </div>

                    {/* Bukti Gambar */}
                    <div className="mb-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-foreground">
                                    Bukti Gambar
                                </label>
                                <p className="mt-1 text-xs text-[#766B8A]">
                                    Unggah maksimal 3 gambar. Format JPG, PNG,
                                    WEBP. Maksimal 2MB per gambar.
                                </p>
                            </div>
                            <span className="shrink-0 rounded-full bg-[#F0E7FF] px-3 py-1 text-xs font-bold text-[#6610F2]">
                                {reportImages.length}/3
                            </span>
                        </div>

                        <label
                            className={`flex min-h-[118px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-5 text-center transition ${
                                reportImages.length >= 3
                                    ? 'cursor-not-allowed border-[#EFE4F8] bg-[#F8F3FF] opacity-70'
                                    : 'border-[#B88CFF] bg-[#FBF7FF] hover:bg-[#F3ECFF]'
                            }`}
                        >
                            <ImagePlus className="h-7 w-7 text-[#6610F2]" />
                            <span className="mt-2 text-sm font-bold text-[#382A49]">
                                Tambah gambar bukti
                            </span>
                            <span className="mt-1 text-xs text-[#766B8A]">
                                Klik untuk memilih gambar dari perangkatmu
                            </span>
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                multiple
                                disabled={reportImages.length >= 3}
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        {imageError && (
                            <p className="mt-2 text-sm font-medium text-[#D11149]">
                                {imageError}
                            </p>
                        )}
                        {errors.images && (
                            <p className="mt-2 text-sm font-medium text-[#D11149]">
                                {errors.images}
                            </p>
                        )}

                        {reportImages.length > 0 && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                                {reportImages.map((image, index) => (
                                    <div
                                        key={`${image.file.name}-${image.previewUrl}`}
                                        className="group relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-[#FBF7FF]"
                                    >
                                        <img
                                            src={image.previewUrl}
                                            alt={image.file.name}
                                            className="h-28 w-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#D11149] opacity-0 shadow transition group-hover:opacity-100"
                                            aria-label="Hapus gambar"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <div className="px-3 py-2">
                                            <p className="truncate text-xs font-semibold text-[#382A49]">
                                                {image.file.name}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="mb-5 flex gap-3 rounded-2xl border border-[#D9C3F5] bg-[#FBF7FF] p-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0E7FF] text-[#6610F2]">
                            <Clock3 className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm font-extrabold text-[#1F1730]">
                                Estimasi respons admin
                            </p>
                            <p className="mt-1 text-sm leading-6 text-[#766B8A]">
                                Laporan akan ditinjau dan dibalas maksimal 2x24
                                jam setelah berhasil dikirim.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={isDisabled}
                            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200"
                            style={{
                                // light mode
                                background: isDisabled
                                    ? `${PURPLE}66`
                                    : `linear-gradient(135deg, ${PURPLE}, ${PURPLE_DARK})`,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                boxShadow: isDisabled
                                    ? 'none'
                                    : `0 4px 14px ${PURPLE}55`,
                                // dark mode (disabled):
                                // background: isDisabled ? `${PURPLE}33` : `linear-gradient(...)`,
                                // boxShadow: isDisabled ? 'none' : `0 4px 14px ${PURPLE}33`,
                            }}
                            onMouseEnter={(e) => {
                                if (!isDisabled) {
                                    e.currentTarget.style.opacity = '0.88';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            {processing
                                ? 'Mengirim...'
                                : submitted
                                  ? '✓ Terkirim!'
                                  : 'Kirim Laporan'}
                        </button>
                    </div>

                    {/* Success message */}
                    {submitted && (
                        <div
                            className="mt-3 rounded-lg px-4 py-3 text-center text-sm"
                            style={{
                                // light mode
                                background: PURPLE_LIGHT,
                                border: `1px solid ${PURPLE_BORDER}`,
                                color: PURPLE,
                                // dark mode (disabled):
                                // background: PURPLE_DM_BG,
                                // color: PURPLE_DM_TEXT,
                            }}
                        >
                            Laporan berhasil terkirim! Admin akan meninjau
                            laporanmu maksimal 2x24 jam.
                        </div>
                    )}
                </div>
            </div>
        </SettingsPageLayout>
    );
}
