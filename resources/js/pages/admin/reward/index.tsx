import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    Filter,
    ImageUp,
    PackageOpen,
    PackageCheck,
    Pencil,
    Plus,
    Search,
    ShoppingBag,
    Sparkles,
    Ticket,
    Trash2,
    Trophy,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLayout from '@/layouts/AdminLayout';

type RewardCategory = 'voucher' | 'merch';
type RewardStatus = 'Aktif' | 'Stok Habis';

type Reward = {
    id: number;
    code: string;
    name: string;
    category: RewardCategory;
    categoryLabel: string;
    points: number;
    stock: number;
    status: RewardStatus;
    redeemedCount: number;
    description: string;
    redemptionLocation: string;
    redemptionInstructions: string;
    validityDays: number;
    images: string[];
};

type RewardsPage = {
    data: Reward[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type Summary = {
    total: number;
    aktif: number;
    stok: number;
    ditukar: number;
};

type Filters = {
    search: string;
    category: string;
    status: string;
};

type AdminRewardIndexProps = {
    rewards: RewardsPage;
    summary: Summary;
    filters: Filters;
    categories: RewardCategory[];
};

type RewardImage = {
    file: File;
    previewUrl: string;
};

const categoryLabels: Record<RewardCategory, string> = {
    voucher: 'Voucher',
    merch: 'Merch',
};

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'habis', label: 'Stok Habis' },
];

function statusClass(status: RewardStatus) {
    return status === 'Aktif'
        ? 'bg-[#DDEEFF] text-[#1A8FE3]'
        : 'bg-[#FFE2E2] text-[#D11149]';
}

export default function AdminRewardIndex({
    rewards,
    summary,
    filters,
    categories,
}: AdminRewardIndexProps) {
    const [showAddReward, setShowAddReward] = useState(false);
    const [editingReward, setEditingReward] = useState<Reward | null>(null);
    const [deletingReward, setDeletingReward] = useState<Reward | null>(null);
    const [search, setSearch] = useState(filters.search);
    const [isFiltering, setIsFiltering] = useState(false);

    const visitWithFilters = useCallback((nextFilters: Filters) => {
        router.get('/admin/reward', cleanFilters(nextFilters), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ['rewards', 'filters', 'summary'],
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    }, []);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            visitWithFilters({
                ...filters,
                search,
            });
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [filters, search, visitWithFilters]);

    const summaryCards = [
        {
            label: 'Total Reward',
            value: summary.total,
            icon: Trophy,
            accent: 'bg-[#F0E7FF] text-[#6610F2]',
        },
        {
            label: 'Reward Aktif',
            value: summary.aktif,
            icon: Sparkles,
            accent: 'bg-[#EAF6FF] text-[#1A8FE3]',
        },
        {
            label: 'Stok Tersedia',
            value: summary.stok,
            icon: PackageCheck,
            accent: 'bg-[#FFF4D6] text-[#A77800]',
        },
        {
            label: 'Reward Ditukar',
            value: summary.ditukar,
            icon: ShoppingBag,
            accent: 'bg-[#FFE3EA] text-[#D11149]',
        },
    ];

    return (
        <>
            <Head title="Kelola Reward" />

            <div className="space-y-6">
                <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#1F1730]">
                            Kelola Reward
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F5573] sm:text-base">
                            Kelola reward yang dapat ditukar oleh mahasiswa
                            menggunakan poin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddReward(true)}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_16px_30px_rgba(102,16,242,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#550DCC] hover:shadow-[0_20px_36px_rgba(102,16,242,0.30)]"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Reward
                    </button>
                </section>

                {isFiltering ? (
                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-36 rounded-2xl"
                            />
                        ))}
                    </section>
                ) : (
                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <SummaryCard key={card.label} {...card} />
                        ))}
                    </section>
                )}

                <section className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <label className="relative block min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari nama, kode, kategori, atau deskripsi reward..."
                            className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-4 pl-12 text-sm font-medium text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                        />
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                        <FilterSelect
                            value={filters.category}
                            placeholder="Semua Kategori"
                            options={categories.map((category) => ({
                                value: category,
                                label: categoryLabels[category],
                            }))}
                            onChange={(category) =>
                                visitWithFilters({
                                    ...filters,
                                    search,
                                    category,
                                })
                            }
                        />
                        <FilterSelect
                            value={filters.status}
                            placeholder="Semua Status"
                            options={statusOptions}
                            onChange={(status) =>
                                visitWithFilters({
                                    ...filters,
                                    search,
                                    status,
                                })
                            }
                        />
                    </div>
                </section>

                <section className="relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                    <div className="overflow-x-auto">
                        <div className="grid min-w-[980px] grid-cols-[minmax(280px,1.6fr)_130px_120px_110px_130px_120px_120px] bg-[#F0E7FF] px-6 py-4 text-xs font-extrabold tracking-wide text-[#4F465F] uppercase">
                            <span>Reward</span>
                            <span>Kategori</span>
                            <span>Poin</span>
                            <span>Stok</span>
                            <span>Status</span>
                            <span>Ditukar</span>
                            <span className="text-right">Action</span>
                        </div>

                        <div className="divide-y divide-[#EFE4F8]">
                            {isFiltering ? (
                                <RewardTableSkeleton />
                            ) : rewards.data.length > 0 ? (
                                rewards.data.map((reward) => (
                                    <RewardRow
                                        key={reward.id}
                                        reward={reward}
                                        onEdit={setEditingReward}
                                        onDelete={setDeletingReward}
                                    />
                                ))
                            ) : (
                                <EmptyRewardState
                                    hasFilter={hasActiveFilter(filters)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-[#EFE4F8] px-5 py-4 text-sm text-[#766B8A] sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            Menampilkan {rewards.from ?? 0}-{rewards.to ?? 0}{' '}
                            dari {rewards.total} reward
                        </p>
                        <Pagination
                            currentPage={rewards.current_page}
                            lastPage={rewards.last_page}
                            filters={filters}
                        />
                    </div>
                </section>
            </div>

            {showAddReward && (
                <AddRewardModal
                    onClose={() => setShowAddReward(false)}
                    onSaved={() => setShowAddReward(false)}
                />
            )}

            {editingReward && (
                <EditRewardModal
                    reward={editingReward}
                    onClose={() => setEditingReward(null)}
                    onSaved={() => setEditingReward(null)}
                />
            )}

            {deletingReward && (
                <DeleteRewardDialog
                    reward={deletingReward}
                    onClose={() => setDeletingReward(null)}
                />
            )}
        </>
    );
}

function RewardTableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="grid min-w-[980px] grid-cols-[minmax(280px,1.6fr)_130px_120px_110px_130px_120px_120px] items-center px-6 py-4"
                >
                    <div className="flex min-w-0 items-center gap-4">
                        <Skeleton className="h-14 w-14 rounded-xl" />
                        <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="ml-auto h-5 w-20" />
                </div>
            ))}
        </>
    );
}

function SummaryCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: number;
    icon: LucideIcon;
    accent: string;
}) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6610F2]/30 hover:shadow-lg">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#F0E7FF] opacity-70 transition group-hover:scale-110" />
            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold tracking-wide text-[#4F465F] uppercase">
                        {label}
                    </p>
                    <p className="mt-5 text-3xl font-extrabold text-[#4C00D8]">
                        {value.toLocaleString('id-ID')}
                    </p>
                </div>
                <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
                >
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </article>
    );
}

function EmptyRewardState({ hasFilter }: { hasFilter: boolean }) {
    return (
        <div className="flex min-h-[250px] items-center justify-center px-6 py-14 text-center">
            <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2] shadow-[0_16px_32px_rgba(102,16,242,0.16)]">
                    {hasFilter ? (
                        <Filter className="h-8 w-8" />
                    ) : (
                        <PackageOpen className="h-8 w-8" />
                    )}
                </div>
                <h2 className="mt-5 text-lg font-extrabold text-[#1F1730]">
                    {hasFilter ? 'Reward tidak ditemukan' : 'Belum ada reward'}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                    {hasFilter
                        ? 'Coba ubah kata kunci, kategori, atau status untuk menemukan reward yang kamu cari.'
                        : 'Tambahkan reward pertama untuk mulai mengisi katalog penukaran poin mahasiswa.'}
                </p>
            </div>
        </div>
    );
}

function RewardRow({
    reward,
    onEdit,
    onDelete,
}: {
    reward: Reward;
    onEdit: (reward: Reward) => void;
    onDelete: (reward: Reward) => void;
}) {
    const Icon = reward.category === 'merch' ? ShoppingBag : Ticket;
    const isOutOfStock = reward.stock <= 0;
    const isLowStock = reward.stock > 0 && reward.stock < 5;

    return (
        <div
            className={`grid min-w-[980px] grid-cols-[minmax(280px,1.6fr)_130px_120px_110px_130px_120px_120px] items-center px-6 py-4 transition hover:bg-[#FBF7FF] ${
                isOutOfStock ? 'text-[#8B8496]' : ''
            }`}
        >
            <div className="flex min-w-0 items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F0E7FF]">
                    {reward.images[0] ? (
                        <img
                            src={reward.images[0]}
                            alt={reward.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-[#6610F2]">
                            <Icon className="h-6 w-6" />
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-base font-extrabold text-[#1F1730]">
                        {reward.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#6F657F]">
                        {reward.code}
                    </p>
                </div>
            </div>

            <p className="text-sm font-medium text-[#5F5573]">
                {reward.categoryLabel}
            </p>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-[#8B2E0E]">
                <CircleDollarSign className="h-4 w-4" />
                {reward.points.toLocaleString('id-ID')}
            </p>
            <p
                className={`text-sm font-bold ${
                    reward.stock <= 0 || isLowStock
                        ? 'text-[#D11149]'
                        : 'text-[#382A49]'
                }`}
            >
                {reward.stock.toLocaleString('id-ID')}
                {isLowStock && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FFF0E0] px-2 py-0.5 text-[10px] font-extrabold text-[#F37933]">
                        <AlertTriangle className="h-3 w-3" />
                        Remind
                    </span>
                )}
            </p>
            <div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${statusClass(
                        reward.status,
                    )}`}
                >
                    {reward.status}
                </span>
            </div>
            <p className="text-sm font-semibold text-[#5F5573]">
                {reward.redeemedCount.toLocaleString('id-ID')}
            </p>
            <div className="flex justify-end gap-4 text-[#4F465F]">
                <button
                    type="button"
                    aria-label={`Edit ${reward.name}`}
                    onClick={() => onEdit(reward)}
                    className="transition hover:text-[#6610F2]"
                >
                    <Pencil className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    aria-label={`Hapus ${reward.name}`}
                    onClick={() => onDelete(reward)}
                    className="transition hover:text-[#D11149]"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}

type RedemptionDetailField =
    | 'lokasi_penukaran'
    | 'instruksi_penukaran'
    | 'berlaku_hari';

type RedemptionDetailFieldsProps = {
    data: Record<RedemptionDetailField, string>;
    errors: Partial<Record<RedemptionDetailField, string>>;
    onChange: (field: RedemptionDetailField, value: string) => void;
};

function RedemptionDetailFields({
    data,
    errors,
    onChange,
}: RedemptionDetailFieldsProps) {
    return (
        <div className="rounded-2xl border border-[#EFE4F8] bg-[#FBF7FF] p-4">
            <h3 className="text-sm font-extrabold text-[#1F1730]">
                Detail Penukaran Voucher
            </h3>
            <div className="mt-4 grid gap-5 md:grid-cols-[1fr_140px]">
                <label className="block">
                    <span className="text-sm font-semibold text-[#1F1730]">
                        Lokasi / Kanal Penukaran
                    </span>
                    <input
                        type="text"
                        value={data.lokasi_penukaran}
                        onChange={(event) =>
                            onChange('lokasi_penukaran', event.target.value)
                        }
                        placeholder="Contoh: link merchant voucher atau halaman checkout"
                        className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] bg-white px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                    />
                    {errors.lokasi_penukaran && (
                        <InputError>{errors.lokasi_penukaran}</InputError>
                    )}
                </label>

                <label className="block">
                    <span className="text-sm font-semibold text-[#1F1730]">
                        Berlaku
                    </span>
                    <input
                        type="number"
                        min={1}
                        max={365}
                        value={data.berlaku_hari}
                        onChange={(event) =>
                            onChange('berlaku_hari', event.target.value)
                        }
                        className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] bg-white px-4 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                    />
                    <p className="mt-1 text-xs font-medium text-[#8B8496]">
                        hari
                    </p>
                    {errors.berlaku_hari && (
                        <InputError>{errors.berlaku_hari}</InputError>
                    )}
                </label>
            </div>

            <label className="mt-4 block">
                <span className="text-sm font-semibold text-[#1F1730]">
                    Instruksi Penukaran
                </span>
                <textarea
                    rows={3}
                    value={data.instruksi_penukaran}
                    onChange={(event) =>
                        onChange('instruksi_penukaran', event.target.value)
                    }
                    placeholder="Contoh: Masukkan kode di halaman checkout merchant atau tunjukkan kode voucher ke kasir."
                    className="mt-2 w-full resize-none rounded-lg border border-[#D8CDE8] bg-white px-4 py-3 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                />
                {errors.instruksi_penukaran && (
                    <InputError>{errors.instruksi_penukaran}</InputError>
                )}
            </label>
        </div>
    );
}

function AddRewardModal({
    onClose,
    onSaved,
}: {
    onClose: () => void;
    onSaved: () => void;
}) {
    const [rewardImages, setRewardImages] = useState<RewardImage[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            nama_reward: string;
            kategori_reward: RewardCategory | '';
            poin_dibutuhkan: string;
            stok: string;
            deskripsi: string;
            lokasi_penukaran: string;
            instruksi_penukaran: string;
            berlaku_hari: string;
            images: File[];
        }>({
            nama_reward: '',
            kategori_reward: '',
            poin_dibutuhkan: '',
            stok: '',
            deskripsi: '',
            lokasi_penukaran: '',
            instruksi_penukaran: '',
            berlaku_hari: '30',
            images: [],
        });

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setImageError(null);

        if (rewardImages.length + files.length > 2) {
            setImageError('Maksimal 2 gambar untuk satu reward.');
            event.target.value = '';

            return;
        }

        const nextImages: RewardImage[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setImageError('File reward harus berupa gambar.');
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

        const mergedImages = [...rewardImages, ...nextImages];
        setRewardImages(mergedImages);
        setData(
            'images',
            mergedImages.map((image) => image.file),
        );
        event.target.value = '';
    };

    const removeImage = (index: number) => {
        setRewardImages((current) => {
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

    const closeModal = () => {
        rewardImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        onClose();
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();
        setImageError(null);

        post('/admin/reward', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                rewardImages.forEach((image) =>
                    URL.revokeObjectURL(image.previewUrl),
                );
                setRewardImages([]);
                reset();
                onSaved();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/35 px-4 py-8 backdrop-blur-sm">
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                <div className="flex items-center justify-between border-b border-[#EFE4F8] px-6 py-5">
                    <h2 className="text-xl font-extrabold text-[#1F1730]">
                        Tambah Reward Baru
                    </h2>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#766B8A] transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                        aria-label="Tutup modal tambah reward"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-5 px-6 py-6">
                        <label className="block">
                            <span className="text-sm font-semibold text-[#1F1730]">
                                Upload Gambar
                            </span>
                            <div className="mt-2 rounded-xl border-2 border-dashed border-[#D8C4F0] bg-[#FDF7FF] px-4 py-5 text-center">
                                <label
                                    className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center ${
                                        rewardImages.length >= 2
                                            ? 'cursor-not-allowed opacity-60'
                                            : ''
                                    }`}
                                >
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8D9FF] text-[#6610F2]">
                                        <ImageUp className="h-6 w-6" />
                                    </span>
                                    <p className="mt-4 text-sm font-bold text-[#1F1730]">
                                        Klik untuk upload gambar reward
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-[#8B8496]">
                                        JPG, PNG, WEBP. Maksimal 2 gambar, 2MB
                                        per gambar.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        multiple
                                        disabled={rewardImages.length >= 2}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>

                                {rewardImages.length > 0 && (
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {rewardImages.map((image, index) => (
                                            <div
                                                key={`${image.file.name}-${image.previewUrl}`}
                                                className="group relative overflow-hidden rounded-xl border border-[#EFE4F8] bg-white"
                                            >
                                                <img
                                                    src={image.previewUrl}
                                                    alt={image.file.name}
                                                    className="h-28 w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(index)
                                                    }
                                                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#D11149] opacity-0 shadow transition group-hover:opacity-100"
                                                    aria-label="Hapus gambar reward"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {(imageError || errors.images) && (
                                <p className="mt-2 text-sm font-medium text-[#D11149]">
                                    {imageError || errors.images}
                                </p>
                            )}
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#1F1730]">
                                Nama Reward
                            </span>
                            <input
                                type="text"
                                value={data.nama_reward}
                                onChange={(event) =>
                                    setData('nama_reward', event.target.value)
                                }
                                placeholder="Masukkan nama reward"
                                className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                            />
                            {errors.nama_reward && (
                                <InputError>{errors.nama_reward}</InputError>
                            )}
                        </label>

                        <div className="grid gap-5 md:grid-cols-[1fr_0.95fr] md:items-end">
                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Kategori Reward
                                </span>
                                <div className="relative mt-2">
                                    <select
                                        value={data.kategori_reward}
                                        onChange={(event) => {
                                            const category = event.target
                                                .value as RewardCategory | '';

                                            setData(
                                                'kategori_reward',
                                                category,
                                            );

                                            if (category === 'merch') {
                                                setData('lokasi_penukaran', '');
                                                setData(
                                                    'instruksi_penukaran',
                                                    '',
                                                );
                                                setData('berlaku_hari', '30');
                                            }
                                        }}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#D8CDE8] bg-white px-4 pr-10 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                    >
                                        <option value="">Pilih kategori</option>
                                        <option value="voucher">Voucher</option>
                                        <option value="merch">Merch</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#766B8A]" />
                                </div>
                                {errors.kategori_reward && (
                                    <InputError>
                                        {errors.kategori_reward}
                                    </InputError>
                                )}
                            </label>

                            <div className="rounded-xl border border-[#EFE4F8] bg-[#FBF7FF] px-4 py-3">
                                <p className="text-xs font-bold tracking-wide text-[#766B8A] uppercase">
                                    Status Otomatis
                                </p>
                                <p className="mt-1 inline-flex items-center gap-2 text-sm font-extrabold text-[#382A49]">
                                    <PackageCheck className="h-4 w-4 text-[#6610F2]" />
                                    {Number(data.stok || 0) > 0
                                        ? 'Aktif'
                                        : 'Stok Habis'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Poin yang Dibutuhkan
                                </span>
                                <div className="relative mt-2">
                                    <CircleDollarSign className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#E6C229]" />
                                    <input
                                        type="number"
                                        min={1}
                                        value={data.poin_dibutuhkan}
                                        onChange={(event) =>
                                            setData(
                                                'poin_dibutuhkan',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0"
                                        className="h-11 w-full rounded-lg border border-[#D8CDE8] pr-4 pl-12 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                </div>
                                {errors.poin_dibutuhkan && (
                                    <InputError>
                                        {errors.poin_dibutuhkan}
                                    </InputError>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Stok
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.stok}
                                    onChange={(event) =>
                                        setData('stok', event.target.value)
                                    }
                                    placeholder="0"
                                    className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                                {errors.stok && (
                                    <InputError>{errors.stok}</InputError>
                                )}
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#1F1730]">
                                Deskripsi
                            </span>
                            <textarea
                                rows={4}
                                value={data.deskripsi}
                                onChange={(event) =>
                                    setData('deskripsi', event.target.value)
                                }
                                placeholder="Tuliskan deskripsi singkat mengenai reward ini..."
                                className="mt-2 w-full resize-none rounded-lg border border-[#D8CDE8] px-4 py-3 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                            />
                            {errors.deskripsi && (
                                <InputError>{errors.deskripsi}</InputError>
                            )}
                        </label>

                        {data.kategori_reward === 'voucher' && (
                            <RedemptionDetailFields
                                data={data}
                                errors={errors}
                                onChange={(field, value) =>
                                    setData(field, value)
                                }
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#EFE4F8] bg-[#FBF7FF] px-6 py-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="h-10 rounded-full border border-[#1A8FE3] px-6 text-sm font-bold text-[#1A8FE3] transition hover:bg-[#E8F4FF]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Reward'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

function EditRewardModal({
    reward,
    onClose,
    onSaved,
}: {
    reward: Reward;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [rewardImages, setRewardImages] = useState<RewardImage[]>([]);
    const [imageError, setImageError] = useState<string | null>(null);
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm<{
            nama_reward: string;
            kategori_reward: RewardCategory;
            poin_dibutuhkan: string;
            stok: string;
            deskripsi: string;
            lokasi_penukaran: string;
            instruksi_penukaran: string;
            berlaku_hari: string;
            images: File[];
        }>({
            nama_reward: reward.name,
            kategori_reward: reward.category,
            poin_dibutuhkan: String(reward.points),
            stok: String(reward.stock),
            deskripsi: reward.description,
            lokasi_penukaran: reward.redemptionLocation ?? '',
            instruksi_penukaran: reward.redemptionInstructions ?? '',
            berlaku_hari: String(reward.validityDays || 30),
            images: [],
        });

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setImageError(null);

        if (files.length > 2) {
            setImageError('Maksimal 2 gambar untuk satu reward.');
            event.target.value = '';

            return;
        }

        const nextImages: RewardImage[] = [];

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setImageError('File reward harus berupa gambar.');
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

        rewardImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        setRewardImages(nextImages);
        setData(
            'images',
            nextImages.map((image) => image.file),
        );
        event.target.value = '';
    };

    const removeImage = (index: number) => {
        setRewardImages((current) => {
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

    const closeModal = () => {
        rewardImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        onClose();
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();
        setImageError(null);

        post(`/admin/reward/${reward.id}/update`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                rewardImages.forEach((image) =>
                    URL.revokeObjectURL(image.previewUrl),
                );
                setRewardImages([]);
                reset();
                onSaved();
            },
        });
    };

    const previewImages =
        rewardImages.length > 0
            ? rewardImages.map((image) => image.previewUrl)
            : reward.images;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/35 px-4 py-8 backdrop-blur-sm">
            <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                <div className="flex items-center justify-between border-b border-[#EFE4F8] px-6 py-5">
                    <div>
                        <h2 className="text-xl font-extrabold text-[#1F1730]">
                            Edit Reward
                        </h2>
                        <p className="mt-1 text-sm font-medium text-[#766B8A]">
                            {reward.code}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#766B8A] transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                        aria-label="Tutup modal edit reward"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-5 px-6 py-6">
                        <label className="block">
                            <span className="text-sm font-semibold text-[#1F1730]">
                                Gambar Reward
                            </span>
                            <div className="mt-2 rounded-xl border-2 border-dashed border-[#D8C4F0] bg-[#FDF7FF] px-4 py-5 text-center">
                                <label className="flex min-h-[112px] cursor-pointer flex-col items-center justify-center">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8D9FF] text-[#6610F2]">
                                        <ImageUp className="h-6 w-6" />
                                    </span>
                                    <p className="mt-4 text-sm font-bold text-[#1F1730]">
                                        Upload gambar baru
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-[#8B8496]">
                                        Opsional. Jika diisi, gambar lama akan
                                        diganti. Maksimal 2 gambar, 2MB per
                                        gambar.
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>

                                {previewImages.length > 0 && (
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {previewImages.map((image, index) => (
                                            <div
                                                key={`${image}-${index}`}
                                                className="group relative overflow-hidden rounded-xl border border-[#EFE4F8] bg-white"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${reward.name} ${index + 1}`}
                                                    className="h-28 w-full object-cover"
                                                />
                                                {rewardImages.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#D11149] opacity-0 shadow transition group-hover:opacity-100"
                                                        aria-label="Hapus gambar reward"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {(imageError || errors.images) && (
                                <p className="mt-2 text-sm font-medium text-[#D11149]">
                                    {imageError || errors.images}
                                </p>
                            )}
                        </label>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#1F1730]">
                                Nama Reward
                            </span>
                            <input
                                type="text"
                                value={data.nama_reward}
                                onChange={(event) =>
                                    setData('nama_reward', event.target.value)
                                }
                                className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                            />
                            {errors.nama_reward && (
                                <InputError>{errors.nama_reward}</InputError>
                            )}
                        </label>

                        <div className="grid gap-5 md:grid-cols-[1fr_0.95fr] md:items-end">
                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Kategori Reward
                                </span>
                                <div className="relative mt-2">
                                    <select
                                        value={data.kategori_reward}
                                        onChange={(event) => {
                                            const category = event.target
                                                .value as RewardCategory;

                                            setData(
                                                'kategori_reward',
                                                category,
                                            );

                                            if (category === 'merch') {
                                                setData('lokasi_penukaran', '');
                                                setData(
                                                    'instruksi_penukaran',
                                                    '',
                                                );
                                                setData('berlaku_hari', '30');
                                            }
                                        }}
                                        className="h-11 w-full appearance-none rounded-lg border border-[#D8CDE8] bg-white px-4 pr-10 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                    >
                                        <option value="voucher">Voucher</option>
                                        <option value="merch">Merch</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#766B8A]" />
                                </div>
                                {errors.kategori_reward && (
                                    <InputError>
                                        {errors.kategori_reward}
                                    </InputError>
                                )}
                            </label>

                            <div className="rounded-xl border border-[#EFE4F8] bg-[#FBF7FF] px-4 py-3">
                                <p className="text-xs font-bold tracking-wide text-[#766B8A] uppercase">
                                    Status Otomatis
                                </p>
                                <p className="mt-1 inline-flex items-center gap-2 text-sm font-extrabold text-[#382A49]">
                                    <PackageCheck className="h-4 w-4 text-[#6610F2]" />
                                    {Number(data.stok || 0) > 0
                                        ? 'Aktif'
                                        : 'Stok Habis'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Poin yang Dibutuhkan
                                </span>
                                <div className="relative mt-2">
                                    <CircleDollarSign className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#E6C229]" />
                                    <input
                                        type="number"
                                        min={1}
                                        value={data.poin_dibutuhkan}
                                        onChange={(event) =>
                                            setData(
                                                'poin_dibutuhkan',
                                                event.target.value,
                                            )
                                        }
                                        className="h-11 w-full rounded-lg border border-[#D8CDE8] pr-4 pl-12 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                </div>
                                {errors.poin_dibutuhkan && (
                                    <InputError>
                                        {errors.poin_dibutuhkan}
                                    </InputError>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Stok
                                </span>
                                <input
                                    type="number"
                                    min={0}
                                    value={data.stok}
                                    onChange={(event) =>
                                        setData('stok', event.target.value)
                                    }
                                    className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                                {Number(data.stok || 0) > 0 &&
                                    Number(data.stok || 0) < 5 && (
                                        <p className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#F37933]">
                                            <AlertTriangle className="h-4 w-4" />
                                            Remind: stok sudah mau habis.
                                        </p>
                                    )}
                                {errors.stok && (
                                    <InputError>{errors.stok}</InputError>
                                )}
                            </label>
                        </div>

                        <label className="block">
                            <span className="text-sm font-semibold text-[#1F1730]">
                                Deskripsi
                            </span>
                            <textarea
                                rows={4}
                                value={data.deskripsi}
                                onChange={(event) =>
                                    setData('deskripsi', event.target.value)
                                }
                                className="mt-2 w-full resize-none rounded-lg border border-[#D8CDE8] px-4 py-3 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                            />
                            {errors.deskripsi && (
                                <InputError>{errors.deskripsi}</InputError>
                            )}
                        </label>

                        {data.kategori_reward === 'voucher' && (
                            <RedemptionDetailFields
                                data={data}
                                errors={errors}
                                onChange={(field, value) =>
                                    setData(field, value)
                                }
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#EFE4F8] bg-[#FBF7FF] px-6 py-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="h-10 rounded-full border border-[#1A8FE3] px-6 text-sm font-bold text-[#1A8FE3] transition hover:bg-[#E8F4FF]"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="h-10 rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

function DeleteRewardDialog({
    reward,
    onClose,
}: {
    reward: Reward;
    onClose: () => void;
}) {
    const [processing, setProcessing] = useState(false);

    const destroyReward = () => {
        if (processing) {
            return;
        }

        setProcessing(true);
        router.delete(`/admin/reward/${reward.id}`, {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/40 px-4 py-8 backdrop-blur-sm">
            <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE3EA] text-[#D11149]">
                    <Trash2 className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-extrabold text-[#1F1730]">
                    Hapus Reward?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                    Apakah kamu yakin mau menghapus reward{' '}
                    <span className="font-bold text-[#382A49]">
                        {reward.name}
                    </span>
                    ? Data reward dan gambar yang terkait akan dihapus.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="h-10 rounded-full border border-[#D8CDE8] px-5 text-sm font-bold text-[#382A49] transition hover:bg-[#F7F1FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={destroyReward}
                        disabled={processing}
                        className="h-10 rounded-full bg-[#D11149] px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(209,17,73,0.22)] transition hover:bg-[#B80F40] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </section>
        </div>
    );
}

function FilterSelect({
    value,
    placeholder,
    options,
    onChange,
}: {
    value: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
}) {
    return (
        <label className="relative block">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-[#EFE4F8] bg-white px-5 pr-11 text-sm font-semibold text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none hover:border-[#6610F2]/30 focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
        </label>
    );
}

function Pagination({
    currentPage,
    lastPage,
    filters,
}: {
    currentPage: number;
    lastPage: number;
    filters: Filters;
}) {
    const pages = Array.from({ length: Math.min(lastPage, 3) }, (_, index) =>
        String(index + 1),
    );

    if (lastPage > 4) {
        pages.push('...', String(lastPage));
    } else if (lastPage === 4) {
        pages.push('4');
    }

    return (
        <div className="flex items-center gap-2">
            <a
                href={pageHref(Math.max(currentPage - 1, 1), filters)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766B8A] transition hover:bg-[#F7F1FF]"
                aria-label="Halaman sebelumnya"
            >
                <ChevronLeft className="h-4 w-4" />
            </a>
            {pages.map((page) =>
                page === '...' ? (
                    <span
                        key="ellipsis"
                        className="flex h-9 min-w-9 items-center justify-center px-2 text-sm font-bold text-[#382A49]"
                    >
                        ...
                    </span>
                ) : (
                    <a
                        key={page}
                        href={pageHref(Number(page), filters)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-bold transition ${
                            Number(page) === currentPage
                                ? 'bg-[#6610F2] text-white shadow-[0_10px_18px_rgba(102,16,242,0.22)]'
                                : 'text-[#382A49] hover:bg-[#F7F1FF]'
                        }`}
                    >
                        {page}
                    </a>
                ),
            )}
            <a
                href={pageHref(
                    Math.min(currentPage + 1, lastPage || 1),
                    filters,
                )}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766B8A] transition hover:bg-[#F7F1FF]"
                aria-label="Halaman berikutnya"
            >
                <ChevronRight className="h-4 w-4" />
            </a>
        </div>
    );
}

function InputError({ children }: { children: ReactNode }) {
    return (
        <p className="mt-2 text-sm font-medium text-[#D11149]">{children}</p>
    );
}

function cleanFilters(filters: Filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
    );
}

function hasActiveFilter(filters: Filters) {
    return Object.values(filters).some((value) => value.trim() !== '');
}

function pageHref(page: number, filters: Filters) {
    const params = new URLSearchParams({
        ...cleanFilters(filters),
        page: String(page),
    });

    return `/admin/reward?${params.toString()}`;
}

AdminRewardIndex.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
