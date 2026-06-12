import { Head, router } from '@inertiajs/react';
import {
    AlertTriangle,
    CalendarClock,
    CheckCircle2,
    ChevronRight,
    CircleDollarSign,
    HelpCircle,
    Info,
    MapPin,
    Package,
    Search,
    ShoppingBag,
    Sparkles,
    Ticket,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageLoading } from '@/hooks/use-page-loading';
import DashboardLayout from '@/layouts/DashboardLayout';

type RewardCategory = 'voucher' | 'merch';
type CategoryFilter = 'semua' | RewardCategory;

type RewardItem = {
    id: number;
    code: string;
    name: string;
    category: RewardCategory;
    categoryLabel: string;
    points: number;
    stock: number;
    status: 'Aktif' | 'Stok Habis';
    redeemedCount: number;
    description: string;
    redemptionLocation: string;
    redemptionInstructions: string;
    validityDays: number;
    images: string[];
};

type TukarPoinProps = {
    rewards: RewardItem[];
    currentPoints: number;
    summary: {
        availableRewards: number;
        redeemedRewards: number;
        spentPoints: number;
    };
};

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
    { value: 'semua', label: 'Semua' },
    { value: 'voucher', label: 'Voucher' },
    { value: 'merch', label: 'Merch' },
];

function formatNumber(value: number) {
    return value.toLocaleString('id-ID');
}

function fallbackImage(category: RewardCategory) {
    return category === 'merch'
        ? '/images/voucher-kaos.jpg'
        : '/images/voucher.jpg';
}

function canRedeem(reward: RewardItem, currentPoints: number) {
    return reward.stock > 0 && currentPoints >= reward.points;
}

function RewardCatalogSkeleton() {
    return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <article
                    key={index}
                    className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_14px_34px_rgba(102,16,242,0.06)]"
                >
                    <Skeleton className="aspect-[1.65] w-full rounded-none" />
                    <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-5 w-4/5" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </div>
                        <Skeleton className="mt-5 h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-5/6" />
                        <Skeleton className="mt-auto h-9 w-32 rounded-full" />
                        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
                    </div>
                </article>
            ))}
        </div>
    );
}

function PointSidebarSkeleton() {
    return (
        <aside className="space-y-5">
            {Array.from({ length: 3 }).map((_, index) => (
                <section
                    key={index}
                    className="rounded-2xl border border-[#EFE4F8] bg-white p-5 shadow-[0_14px_34px_rgba(102,16,242,0.06)]"
                >
                    <Skeleton className="h-5 w-36" />
                    <div className="mt-5 space-y-3">
                        <Skeleton className="h-16 w-full rounded-2xl" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-12 w-3/4 rounded-xl" />
                    </div>
                </section>
            ))}
        </aside>
    );
}

export default function TukarPoin({
    rewards = [],
    currentPoints = 0,
    summary,
}: TukarPoinProps) {
    const [activeCategory, setActiveCategory] =
        useState<CategoryFilter>('semua');
    const [search, setSearch] = useState('');
    const [selectedReward, setSelectedReward] = useState<RewardItem | null>(
        null,
    );
    const [showConfirm, setShowConfirm] = useState(false);
    const [processingRewardId, setProcessingRewardId] = useState<number | null>(
        null,
    );
    const isLoading = usePageLoading();

    const filteredRewards = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return rewards.filter((reward) => {
            const matchesCategory =
                activeCategory === 'semua' ||
                reward.category === activeCategory;
            const matchesSearch =
                normalizedSearch === '' ||
                reward.name.toLowerCase().includes(normalizedSearch) ||
                reward.code.toLowerCase().includes(normalizedSearch) ||
                reward.categoryLabel.toLowerCase().includes(normalizedSearch) ||
                reward.description.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, rewards, search]);

    const closeModal = () => {
        if (processingRewardId !== null) {
            return;
        }

        setSelectedReward(null);
        setShowConfirm(false);
    };

    const redeemReward = () => {
        if (!selectedReward || processingRewardId !== null) {
            return;
        }

        setProcessingRewardId(selectedReward.id);
        router.post(
            `/tukar-poin/${selectedReward.id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: closeModal,
                onFinish: () => setProcessingRewardId(null),
            },
        );
    };

    return (
        <>
            <Head title="Tukar Poin" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1320px] space-y-6">
                    <section className="overflow-hidden rounded-2xl bg-[linear-gradient(110deg,#6610F2_0%,#1A8FE3_100%)] shadow-[0_18px_45px_rgba(102,16,242,0.18)]">
                        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Reward Catalog
                                </div>
                                <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.01em] text-white sm:text-4xl">
                                    Tukarkan poin kolaborasi kamu
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                                    Pilih reward dari katalog admin, cek stok
                                    dan kebutuhan poin, lalu konfirmasi
                                    penukaran dengan aman.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/25 bg-white/20 p-5 text-white backdrop-blur">
                                <p className="text-xs font-extrabold tracking-wide text-white/80 uppercase">
                                    Poin Kamu
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                                        <CircleDollarSign className="h-7 w-7 text-[#FFE98A]" />
                                    </span>
                                    <p className="text-4xl font-extrabold">
                                        {formatNumber(currentPoints)}
                                    </p>
                                </div>
                                <p className="mt-3 text-sm font-medium text-white/75">
                                    Poin akan otomatis berkurang setelah reward
                                    berhasil ditukar.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
                        <div className="flex min-h-0 flex-col xl:h-[calc(100vh-260px)] xl:min-h-[520px]">
                            <div className="flex shrink-0 flex-col gap-4 rounded-2xl border border-[#EFE4F8] bg-white p-4 shadow-[0_10px_26px_rgba(102,16,242,0.05)] lg:flex-row lg:items-center lg:justify-between">
                                <div className="relative min-w-0 flex-1">
                                    <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8A7FA2]" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Cari reward, kode, atau kategori..."
                                        className="h-12 w-full rounded-full border border-[#EFE4F8] bg-[#FBF7FF] pr-4 pl-12 text-sm font-medium text-[#382A49] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {categoryOptions.map((category) => {
                                        const isActive =
                                            activeCategory === category.value;

                                        return (
                                            <button
                                                key={category.value}
                                                type="button"
                                                onClick={() =>
                                                    setActiveCategory(
                                                        category.value,
                                                    )
                                                }
                                                className={`h-10 cursor-pointer rounded-full px-5 text-sm font-bold transition ${
                                                    isActive
                                                        ? 'bg-[#6610F2] text-white shadow-[0_12px_24px_rgba(102,16,242,0.22)]'
                                                        : 'border border-[#E4D8F2] bg-white text-[#5F5573] hover:border-[#6610F2]/30 hover:bg-[#F7F1FF]'
                                                }`}
                                            >
                                                {category.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-5 min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {isLoading ? (
                                    <RewardCatalogSkeleton />
                                ) : filteredRewards.length > 0 ? (
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {filteredRewards.map((reward) => (
                                            <RewardCard
                                                key={reward.id}
                                                reward={reward}
                                                currentPoints={currentPoints}
                                                onSelect={() => {
                                                    setSelectedReward(reward);
                                                    setShowConfirm(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[#D8CDE8] bg-white p-8 text-center">
                                        <div>
                                            <Package className="mx-auto h-12 w-12 text-[#6610F2]" />
                                            <h2 className="mt-4 text-lg font-extrabold text-[#1F1730]">
                                                Reward tidak ditemukan
                                            </h2>
                                            <p className="mt-2 text-sm text-[#766B8A]">
                                                Coba ubah kata kunci atau
                                                kategori katalog.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isLoading ? (
                            <PointSidebarSkeleton />
                        ) : (
                            <aside className="space-y-5 xl:sticky xl:top-24">
                                <PointSummaryCard
                                    currentPoints={currentPoints}
                                    summary={summary}
                                />
                                <GuideCard />
                            </aside>
                        )}
                    </section>
                </div>
            </main>

            {selectedReward && (
                <RewardDetailModal
                    reward={selectedReward}
                    currentPoints={currentPoints}
                    showConfirm={showConfirm}
                    isProcessing={processingRewardId === selectedReward.id}
                    onClose={closeModal}
                    onAskConfirm={() => setShowConfirm(true)}
                    onCancelConfirm={() => setShowConfirm(false)}
                    onRedeem={redeemReward}
                />
            )}
        </>
    );
}

function RewardCard({
    reward,
    currentPoints,
    onSelect,
}: {
    reward: RewardItem;
    currentPoints: number;
    onSelect: () => void;
}) {
    const Icon = reward.category === 'merch' ? ShoppingBag : Ticket;
    const isOutOfStock = reward.stock <= 0;
    const isPointInsufficient = currentPoints < reward.points;
    const image = reward.images[0] ?? fallbackImage(reward.category);

    return (
        <article className="group flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_14px_34px_rgba(102,16,242,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#6610F2]/35 hover:shadow-[0_22px_48px_rgba(102,16,242,0.14)]">
            <div className="relative aspect-[1.65] overflow-hidden bg-[#F0E7FF]">
                <img
                    src={image}
                    alt={reward.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span
                    className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-extrabold backdrop-blur ${
                        isOutOfStock
                            ? 'bg-white/90 text-[#D11149]'
                            : 'bg-white/90 text-[#6610F2]'
                    }`}
                >
                    {isOutOfStock
                        ? 'Stok Habis'
                        : `Sisa ${formatNumber(reward.stock)}`}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#8A7FA2]">
                            {reward.code}
                        </p>
                        <h2 className="mt-1 line-clamp-2 text-lg font-extrabold text-[#1F1730]">
                            {reward.name}
                        </h2>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FF] text-[#6610F2]">
                        <Icon className="h-5 w-5" />
                    </span>
                </div>

                <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-5 text-[#766B8A]">
                    {reward.description ||
                        'Reward dapat ditukar menggunakan poin aktif mahasiswa.'}
                </p>

                <div className="mt-auto space-y-4 pt-5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF6D8] px-3.5 py-2 text-sm font-extrabold text-[#746000]">
                            <CircleDollarSign className="h-4 w-4" />
                            {formatNumber(reward.points)}
                        </div>
                        <span className="rounded-full bg-[#F7F1FF] px-3.5 py-2 text-xs font-bold text-[#6610F2]">
                            {reward.categoryLabel}
                        </span>
                    </div>

                    {isPointInsufficient && !isOutOfStock && (
                        <p className="inline-flex items-center gap-1 rounded-xl bg-[#FFF0F4] px-3 py-2 text-xs font-bold text-[#D11149]">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Poin kamu belum cukup.
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={onSelect}
                        disabled={isOutOfStock}
                        className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition ${
                            isOutOfStock
                                ? 'cursor-not-allowed bg-[#F2EBFB] text-[#8B8496]'
                                : 'cursor-pointer bg-[#6610F2] text-white shadow-[0_14px_28px_rgba(102,16,242,0.20)] hover:bg-[#550DCC]'
                        }`}
                    >
                        {isOutOfStock ? 'Stok Habis' : 'Lihat & Tukar'}
                        {!isOutOfStock && <ChevronRight className="h-4 w-4" />}
                    </button>
                </div>
            </div>
        </article>
    );
}

function PointSummaryCard({
    currentPoints,
    summary,
}: {
    currentPoints: number;
    summary: TukarPoinProps['summary'];
}) {
    return (
        <section className="rounded-2xl border border-[#EFE4F8] bg-white p-5 shadow-[0_14px_34px_rgba(102,16,242,0.06)]">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[#1F1730]">
                    Ringkasan Poin
                </h2>
                <div className="group relative">
                    <HelpCircle className="h-5 w-5 text-[#8A7FA2]" />
                    <div className="pointer-events-none absolute right-0 z-20 mt-3 w-64 translate-y-2 rounded-2xl border border-[#EFE4F8] bg-white p-4 text-sm leading-6 text-[#5F5573] opacity-0 shadow-[0_18px_45px_rgba(56,42,73,0.14)] transition group-hover:translate-y-0 group-hover:opacity-100">
                        Poin aktif berasal dari klaim event dan akan berkurang
                        otomatis saat reward berhasil ditukar.
                    </div>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-[#FBF7FF] p-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF6D8] text-[#A77800]">
                    <CircleDollarSign className="h-6 w-6" />
                </span>
                <div>
                    <p className="text-3xl font-extrabold text-[#1F1730]">
                        {formatNumber(currentPoints)}
                    </p>
                    <p className="text-sm font-semibold text-[#766B8A]">
                        Poin Aktif
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
                <SummaryMiniCard
                    label="Reward Tersedia"
                    value={summary.availableRewards}
                />
                <SummaryMiniCard
                    label="Sudah Ditukar"
                    value={summary.redeemedRewards}
                />
                <SummaryMiniCard
                    label="Poin Terpakai"
                    value={summary.spentPoints}
                    className="col-span-2"
                />
            </div>
        </section>
    );
}

function SummaryMiniCard({
    label,
    value,
    className = '',
}: {
    label: string;
    value: number;
    className?: string;
}) {
    return (
        <div className={`rounded-xl border border-[#EFE4F8] p-3 ${className}`}>
            <p className="text-xs font-bold text-[#8A7FA2]">{label}</p>
            <p className="mt-2 text-xl font-extrabold text-[#1F1730]">
                {formatNumber(value)}
            </p>
        </div>
    );
}

function GuideCard() {
    return (
        <section className="rounded-2xl border border-[#EFE4F8] bg-white p-5 shadow-[0_14px_34px_rgba(102,16,242,0.06)]">
            <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#6610F2]" />
                <h2 className="text-lg font-extrabold text-[#1F1730]">
                    Panduan Tukar
                </h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[#5F5573]">
                <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#009B6A]" />
                    Pilih reward dan baca detailnya dulu.
                </li>
                <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#009B6A]" />
                    Pastikan poin dan stok masih mencukupi.
                </li>
                <li className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#009B6A]" />
                    Konfirmasi penukaran. Poin akan otomatis dipotong.
                </li>
            </ol>
        </section>
    );
}

function RewardDetailModal({
    reward,
    currentPoints,
    showConfirm,
    isProcessing,
    onClose,
    onAskConfirm,
    onCancelConfirm,
    onRedeem,
}: {
    reward: RewardItem;
    currentPoints: number;
    showConfirm: boolean;
    isProcessing: boolean;
    onClose: () => void;
    onAskConfirm: () => void;
    onCancelConfirm: () => void;
    onRedeem: () => void;
}) {
    const image = reward.images[0] ?? fallbackImage(reward.category);
    const redeemable = canRedeem(reward, currentPoints);
    const remainingPoints = currentPoints - reward.points;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/45 px-4 py-8 backdrop-blur-sm">
            <section className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                <div className="flex items-center justify-between border-b border-[#EFE4F8] px-5 py-4">
                    <div>
                        <p className="text-xs font-bold tracking-wide text-[#8A7FA2] uppercase">
                            {reward.code}
                        </p>
                        <h2 className="text-xl font-extrabold text-[#1F1730]">
                            Detail Reward
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#766B8A] transition hover:bg-[#F7F1FF] hover:text-[#6610F2] disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Tutup detail reward"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[calc(92vh-74px)] overflow-y-auto">
                    <div className="p-5">
                        <div className="overflow-hidden rounded-2xl border border-[#EFE4F8] bg-[#F7F1FF]">
                            <img
                                src={image}
                                alt={reward.name}
                                className="max-h-[360px] w-full object-contain"
                            />
                        </div>

                        <div className="mt-5 space-y-5">
                            <div>
                                <span className="inline-flex rounded-full bg-[#F7F1FF] px-3 py-1 text-xs font-extrabold text-[#6610F2]">
                                    {reward.categoryLabel}
                                </span>
                                <h3 className="mt-3 text-2xl font-extrabold text-[#1F1730]">
                                    {reward.name}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-[#5F5573]">
                                    {reward.description ||
                                        'Reward dapat ditukar menggunakan poin aktif mahasiswa.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <DetailStat
                                    label="Poin Dibutuhkan"
                                    value={formatNumber(reward.points)}
                                />
                                <DetailStat
                                    label="Stok"
                                    value={formatNumber(reward.stock)}
                                />
                            </div>

                            <div className="rounded-2xl border border-[#EFE4F8] bg-[#FBF7FF] p-4">
                                <h4 className="text-sm font-extrabold text-[#1F1730]">
                                    Info Penukaran
                                </h4>
                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                    <RedemptionInfoRow
                                        icon={MapPin}
                                        label="Lokasi / Kanal"
                                        value={reward.redemptionLocation}
                                    />
                                    <RedemptionInfoRow
                                        icon={CalendarClock}
                                        label="Masa Berlaku Kupon"
                                        value={`${reward.validityDays || 30} hari setelah penukaran`}
                                    />
                                    <RedemptionInfoRow
                                        icon={Info}
                                        label="Instruksi"
                                        value={reward.redemptionInstructions}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </div>

                            {!redeemable && (
                                <div className="rounded-xl border border-[#FFD1DC] bg-[#FFF5F7] p-3 text-sm leading-6 font-semibold text-[#D11149]">
                                    {reward.stock <= 0
                                        ? 'Reward ini sedang stok habis.'
                                        : `Poin kamu kurang ${formatNumber(
                                              Math.abs(remainingPoints),
                                          )} untuk menukar reward ini.`}
                                </div>
                            )}
                        </div>
                    </div>

                    {showConfirm && (
                        <div className="mx-5 mb-5 rounded-2xl border border-[#FFE3A3] bg-[#FFF9E8] p-4">
                            <div className="flex gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#A77800]" />
                                <div>
                                    <h3 className="font-extrabold text-[#1F1730]">
                                        Yakin ingin menukar reward ini?
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-[#5F5573]">
                                        Poin kamu akan berkurang{' '}
                                        <span className="font-extrabold text-[#D11149]">
                                            {formatNumber(reward.points)}
                                        </span>{' '}
                                        dan sisa poin menjadi{' '}
                                        <span className="font-extrabold text-[#1F1730]">
                                            {formatNumber(remainingPoints)}
                                        </span>
                                        .
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-[#5F5573]">
                                        Kupon/kode penukaran berlaku selama{' '}
                                        <span className="font-extrabold text-[#1F1730]">
                                            {reward.validityDays || 30} hari
                                        </span>{' '}
                                        dan detailnya akan muncul di Riwayat
                                        Poin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 border-t border-[#EFE4F8] bg-[#FBF7FF] px-5 py-4 sm:flex-row sm:justify-end">
                        {showConfirm ? (
                            <>
                                <button
                                    type="button"
                                    onClick={onCancelConfirm}
                                    disabled={isProcessing}
                                    className="h-11 cursor-pointer rounded-full border border-[#D8CDE8] px-5 text-sm font-bold text-[#382A49] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={onRedeem}
                                    disabled={!redeemable || isProcessing}
                                    className="h-11 cursor-pointer rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isProcessing
                                        ? 'Memproses...'
                                        : 'Ya, Tukar Reward'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isProcessing}
                                    className="h-11 cursor-pointer rounded-full border border-[#D8CDE8] px-5 text-sm font-bold text-[#382A49] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Tutup
                                </button>
                                <button
                                    type="button"
                                    onClick={onAskConfirm}
                                    disabled={!redeemable || isProcessing}
                                    className="h-11 cursor-pointer rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Tukar Reward
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

function RedemptionInfoRow({
    icon: Icon,
    label,
    value,
    className = '',
}: {
    icon: typeof Info;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={`flex gap-3 rounded-xl bg-white p-3 ${className}`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FF] text-[#6610F2]">
                <Icon className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
                <p className="text-xs font-bold text-[#8A7FA2]">{label}</p>
                <p className="mt-1 text-sm leading-6 font-semibold text-[#382A49]">
                    {value}
                </p>
            </div>
        </div>
    );
}

function DetailStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-[#EFE4F8] bg-white p-3">
            <p className="text-xs font-bold text-[#8A7FA2]">{label}</p>
            <p className="mt-2 text-lg font-extrabold text-[#1F1730]">
                {value}
            </p>
        </div>
    );
}

TukarPoin.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
