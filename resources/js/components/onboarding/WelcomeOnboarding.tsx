import { router } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Compass,
    MessageCircle,
    Sparkles,
    Star,
    UserRound,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type WelcomeOnboardingProps = {
    userName: string;
    show: boolean;
};

type Slide = {
    title: string;
    description: string;
    icon: LucideIcon;
    accent: string;
};

const slides: Slide[] = [
    {
        title: 'Selamat Datang di InCollab',
        description:
            'Jelajahi informasi kolaborasi, event kampus, proyek, lomba, dan peluang kegiatan mahasiswa dalam satu platform.',
        icon: Sparkles,
        accent: 'from-[#6610F2] to-[#1A8FE3]',
    },
    {
        title: 'Jelajahi Feed Kolaborasi',
        description:
            'Temukan berbagai postingan berisi ide, informasi lomba, proyek, penelitian, dan kegiatan kampus yang bisa kamu ikuti atau diskusikan.',
        icon: Compass,
        accent: 'from-[#1A8FE3] to-[#6610F2]',
    },
    {
        title: 'Diskusi Lewat Komentar',
        description:
            'Gunakan kolom komentar untuk bertanya, berdiskusi, atau merespons informasi yang dibagikan pada setiap postingan.',
        icon: MessageCircle,
        accent: 'from-[#6610F2] to-[#F37933]',
    },
    {
        title: 'Temukan Event Kampus',
        description:
            'Lihat daftar event, seminar, workshop, webinar, dan kompetisi yang dipublikasikan oleh admin InCollab.',
        icon: CalendarDays,
        accent: 'from-[#F37933] to-[#E6C229]',
    },
    {
        title: 'Kumpulkan Poin dari Aktivitas',
        description:
            'Dapatkan poin dari partisipasi dalam event atau kegiatan tertentu sebagai bentuk apresiasi keaktifanmu.',
        icon: Star,
        accent: 'from-[#E6C229] to-[#6610F2]',
    },
    {
        title: 'Lengkapi Profilmu',
        description:
            'Tambahkan skill, minat, sosial media, dan portofolio agar informasi kolaborasi dan aktivitas yang kamu temukan lebih sesuai dengan profilmu.',
        icon: UserRound,
        accent: 'from-[#6610F2] to-[#D11149]',
    },
];

export default function WelcomeOnboarding({
    userName,
    show,
}: WelcomeOnboardingProps) {
    const [isOpen, setIsOpen] = useState(show);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const firstActionRef = useRef<HTMLButtonElement | null>(null);
    const currentSlide = slides[activeIndex];
    const SlideIcon = currentSlide.icon;
    const isLastSlide = activeIndex === slides.length - 1;
    const firstName = useMemo(
        () => userName.trim().split(' ')[0] || 'Sobat',
        [userName],
    );

    const completeOnboarding = useCallback(
        (redirectTo?: string) => {
            if (isCompleting) {
                return;
            }

            setIsCompleting(true);
            router.post(
                '/onboarding/complete',
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setIsOpen(false);

                        if (redirectTo) {
                            router.visit(redirectTo);
                        }
                    },
                    onFinish: () => setIsCompleting(false),
                },
            );
        },
        [isCompleting],
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.setTimeout(() => firstActionRef.current?.focus(), 120);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                completeOnboarding();
            }

            if (event.key !== 'Tab' || !modalRef.current) {
                return;
            }

            const focusable = modalRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!first || !last) {
                return;
            }

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [completeOnboarding, isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#120A1F]/55 p-4 backdrop-blur-[5px]">
            <section
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-onboarding-title"
                className="relative max-h-[92vh] w-full max-w-[820px] animate-[incollab-modal-in_280ms_ease-out] overflow-hidden rounded-[28px] border border-[#EFE4F8] bg-white shadow-[0_34px_90px_rgba(31,23,48,0.28)]"
            >
                <style>{`
                    @keyframes incollab-modal-in {
                        from { opacity: 0; transform: translateY(12px) scale(0.96); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }

                    @keyframes incollab-logo-float {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-8px) scale(1.035); }
                    }

                    @keyframes incollab-logo-glow {
                        0%, 100% { opacity: 0.45; transform: scale(0.96); }
                        50% { opacity: 0.85; transform: scale(1.08); }
                    }

                    @keyframes incollab-slide-in {
                        from { opacity: 0; transform: translateX(14px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}</style>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(102,16,242,0.18),transparent_38%),linear-gradient(135deg,#FFFFFF_0%,#FBF7FF_52%,#FFFFFF_100%)]" />
                <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#1A8FE3]/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-[#6610F2]/10 blur-3xl" />

                <div className="relative flex max-h-[92vh] flex-col overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
                    <div className="flex items-center justify-between gap-4">
                        <p className="rounded-full border border-[#E4D8F2] bg-white/80 px-4 py-2 text-xs font-extrabold tracking-wide text-[#6610F2] uppercase">
                            {activeIndex + 1} dari {slides.length}
                        </p>
                        <button
                            ref={firstActionRef}
                            type="button"
                            disabled={isCompleting}
                            onClick={() => completeOnboarding()}
                            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[#766B8A] transition hover:bg-[#F0E7FF] hover:text-[#6610F2] disabled:cursor-not-allowed disabled:opacity-60"
                            aria-label="Lewati onboarding"
                        >
                            Lewati
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="mt-5 flex justify-center">
                        <div className="relative flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
                            <span className="absolute inset-2 animate-[incollab-logo-glow_2.4s_ease-in-out_infinite] rounded-[34px] bg-[#6610F2]/20 blur-xl" />
                            <span className="absolute inset-5 rounded-[28px] border border-[#EFE4F8] bg-white/80 shadow-[0_18px_45px_rgba(102,16,242,0.16)]" />
                            <img
                                src="/images/logo.svg"
                                alt="Logo InCollab"
                                className="relative h-20 w-20 animate-[incollab-logo-float_2.8s_ease-in-out_infinite] object-contain sm:h-24 sm:w-24"
                            />
                        </div>
                    </div>

                    <div
                        key={activeIndex}
                        className="mt-2 animate-[incollab-slide-in_260ms_ease-out] text-center"
                    >
                        <div
                            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${currentSlide.accent} text-white shadow-[0_16px_28px_rgba(102,16,242,0.2)]`}
                        >
                            <SlideIcon className="h-7 w-7" />
                        </div>

                        <h2
                            id="welcome-onboarding-title"
                            className="text-2xl font-extrabold text-[#1F1730] sm:text-3xl"
                        >
                            {activeIndex === 0
                                ? `Hi ${firstName}, Selamat Datang di InCollab`
                                : currentSlide.title}
                            {activeIndex === 0 && (
                                <span className="ml-2" aria-hidden="true">
                                    👋
                                </span>
                            )}
                        </h2>
                        <p className="mx-auto mt-4 max-w-[620px] text-sm leading-7 text-[#766B8A] sm:text-base">
                            {currentSlide.description}
                        </p>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-2">
                        {slides.map((slide, index) => (
                            <button
                                key={slide.title}
                                type="button"
                                disabled={isCompleting}
                                onClick={() => setActiveIndex(index)}
                                className={`h-2.5 rounded-full transition-all ${
                                    index === activeIndex
                                        ? 'w-9 bg-[#6610F2]'
                                        : 'w-2.5 bg-[#E4D8F2] hover:bg-[#CDB7EA]'
                                }`}
                                aria-label={`Buka slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#EFE4F8] pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            disabled={activeIndex === 0 || isCompleting}
                            onClick={() =>
                                setActiveIndex((current) =>
                                    Math.max(current - 1, 0),
                                )
                            }
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#E4D8F2] bg-white px-5 text-sm font-bold text-[#382A49] transition hover:border-[#CDB7EA] hover:bg-[#FBF7FF] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Sebelumnya
                        </button>

                        {isLastSlide ? (
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    disabled={isCompleting}
                                    onClick={() => completeOnboarding()}
                                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#D9C3F5] bg-white px-5 text-sm font-extrabold text-[#6610F2] transition hover:bg-[#F0E7FF] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Mulai Jelajahi
                                </button>
                                <button
                                    type="button"
                                    disabled={isCompleting}
                                    onClick={() =>
                                        completeOnboarding('/pengaturan')
                                    }
                                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#6610F2] px-5 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(102,16,242,0.28)] transition hover:bg-[#570DD1] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Lengkapi Profil Sekarang
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                disabled={isCompleting}
                                onClick={() =>
                                    setActiveIndex((current) =>
                                        Math.min(
                                            current + 1,
                                            slides.length - 1,
                                        ),
                                    )
                                }
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-6 text-sm font-extrabold text-white shadow-[0_16px_28px_rgba(102,16,242,0.28)] transition hover:bg-[#570DD1] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Lanjut
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
