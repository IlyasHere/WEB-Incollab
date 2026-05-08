import { useState } from 'react';
import SettingsPageLayout from '@/layouts/SettingsPageLayout';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ─── InCollab Brand Colors (Light Mode) ───────────────────────────────────────
const PURPLE        = '#6610F2';
const PURPLE_DARK   = '#5A0DC8';
const PURPLE_LIGHT  = '#F0E7FF'; // background accordion aktif
const PURPLE_BORDER = 'rgba(102, 16, 242, 0.30)';
const PURPLE_GLOW   = 'rgba(102, 16, 242, 0.15)';

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

const TOPIC_OPTIONS: string[] = [
    'Akun & Profil',
    'Poin & Reward',
    'Postingan & Konten',
    'Teknis & Bug',
    'Lainnya',
];

// ─── AccordionItem ────────────────────────────────────────────────────────────

function AccordionItem({ item }: AccordionItemProps): JSX.Element {
    const [open, setOpen] = useState<boolean>(item.id === 1);

    return (
        <div
            className="rounded-xl overflow-hidden transition-all duration-200"
            style={{
                border: open
                    ? `1px solid ${PURPLE_BORDER}`
                    : '1px solid var(--border)',
            }}
        >
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-200 hover:bg-[#F0E7FF]/50"
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
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
                    className="px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground"
                    style={{ borderTop: `1px solid ${PURPLE_BORDER}` }}
                >
                    {item.answer}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PengaturanBantuan(): JSX.Element {
    const [topic, setTopic]                     = useState<string>('');
    const [message, setMessage]                 = useState<string>('');
    const [submitted, setSubmitted]             = useState<boolean>(false);
    const [textareaFocused, setTextareaFocused] = useState<boolean>(false);

    const handleSend = (): void => {
        if (!topic || !message.trim()) return;
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setTopic('');
            setMessage('');
        }, 2500);
    };

    const isDisabled = !topic || !message.trim();

    return (
        <SettingsPageLayout title="Bantuan">
            <div className="flex flex-col gap-6">

                {/* ── FAQ Section ── */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-xs">
                    <h2 className="text-sm font-bold text-foreground mb-4">
                        Bantuan &amp; Dukungan
                    </h2>
                    <div className="flex flex-col gap-2.5">
                        {FAQ_ITEMS.map((item) => (
                            <AccordionItem key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* ── Hubungi Kami Section ── */}
                <div className="bg-card rounded-2xl p-6 border border-border shadow-xs">
                    <h2 className="text-sm font-bold text-foreground mb-5">
                        Hubungi Kami
                    </h2>

                    {/* Topik */}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Topik
                        </label>
                        <Select value={topic} onValueChange={setTopic}>
                            <SelectTrigger
                                className="w-full [&_[data-slot=select-value]]:text-foreground"
                                style={topic ? { borderColor: PURPLE } : {}}
                            >
                                <SelectValue placeholder="Pilih topik permasalahan" />
                            </SelectTrigger>
                            <SelectContent>
                                {TOPIC_OPTIONS.map((opt) => (
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
                    </div>

                    {/* Pesan */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                            Pesan
                        </label>
                        <textarea
                            value={message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                setMessage(e.target.value)
                            }
                            onFocus={() => setTextareaFocused(true)}
                            onBlur={() => setTextareaFocused(false)}
                            placeholder="Tulis pesanmu di sini..."
                            rows={5}
                            className="placeholder:text-muted-foreground text-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-y transition-all duration-200"
                            style={{
                                // light mode: border & glow ungu
                                borderColor: textareaFocused ? PURPLE : 'var(--border)',
                                boxShadow: textareaFocused
                                    ? `0 0 0 3px ${PURPLE_GLOW}`
                                    : 'none',
                                // dark mode (disabled):
                                // boxShadow: textareaFocused ? `0 0 0 3px ${PURPLE_DM_GLOW}` : 'none',
                            }}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSend}
                            disabled={isDisabled}
                            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200"
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
                            onMouseEnter={e => {
                                if (!isDisabled) e.currentTarget.style.opacity = '0.88';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.opacity = '1';
                            }}
                        >
                            {submitted ? '✓ Terkirim!' : 'Kirim Pesan'}
                        </button>
                    </div>

                    {/* Success message */}
                    {submitted && (
                        <div
                            className="mt-3 px-4 py-3 rounded-lg text-sm text-center"
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
                            Pesan kamu berhasil dikirim! Admin akan merespons dalam 1×24 jam.
                        </div>
                    )}
                </div>

            </div>
        </SettingsPageLayout>
    );
}