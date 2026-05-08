import { Head } from '@inertiajs/react';
import {
    ChevronDown,
    CircleDollarSign,
    Eye,
    FileBadge,
    ImageUp,
    Pencil,
    Plus,
    Search,
    ShoppingBag,
    Ticket,
    Trash2,
    Utensils,
    X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

const summaryCards = [
    { label: 'Total Reward', value: '24' },
    { label: 'Reward Aktif', value: '18' },
    { label: 'Stok Tersedia', value: '150' },
    { label: 'Reward Ditukar', value: '45' },
];

const rewards = [
    {
        name: 'Voucher E-Wallet 50K',
        code: 'RWD-001',
        category: 'Voucher',
        points: 500,
        stock: '100',
        status: 'Aktif',
        icon: Ticket,
        muted: false,
    },
    {
        name: 'Tote Bag InCollab',
        code: 'RWD-002',
        category: 'Merchandise',
        points: 800,
        stock: '25',
        status: 'Aktif',
        icon: ShoppingBag,
        muted: false,
    },
    {
        name: 'Tumbler Exclusive',
        code: 'RWD-003',
        category: 'Merchandise',
        points: 1200,
        stock: '5 (Low)',
        status: 'Aktif',
        icon: Trash2,
        muted: false,
    },
    {
        name: 'Sertifikat Premium',
        code: 'RWD-004',
        category: 'Digital',
        points: 300,
        stock: '∞',
        status: 'Aktif',
        icon: FileBadge,
        muted: false,
    },
    {
        name: 'Voucher Makanan',
        code: 'RWD-005',
        category: 'Voucher',
        points: 400,
        stock: '0',
        status: 'Stok Habis',
        icon: Utensils,
        muted: true,
    },
];

function statusClass(status: string) {
    return status === 'Aktif'
        ? 'bg-[#DDEEFF] text-[#1A8FE3]'
        : 'bg-[#FFE2E2] text-[#D11149]';
}

export default function AdminRewardIndex() {
    const [showAddReward, setShowAddReward] = useState(false);

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

                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {summaryCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6610F2]/30 hover:shadow-lg"
                        >
                            <p className="text-xs font-bold tracking-wide text-[#4F465F] uppercase">
                                {card.label}
                            </p>
                            <p className="mt-3 text-3xl font-extrabold text-[#4C00D8]">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <label className="relative block min-w-0 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                        <input
                            type="text"
                            placeholder="Cari reward..."
                            className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-4 pl-12 text-sm font-medium text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                        />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        {['Semua Kategori', 'Semua Status'].map((label) => (
                            <button
                                key={label}
                                type="button"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#EFE4F8] bg-white px-5 text-sm font-semibold text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition hover:border-[#6610F2]/30 hover:bg-[#F7F1FF]"
                            >
                                {label}
                                <ChevronDown className="h-4 w-4 text-[#64748B]" />
                            </button>
                        ))}
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                    <div className="overflow-x-auto">
                        <div className="grid min-w-[940px] grid-cols-[minmax(260px,1.6fr)_140px_120px_120px_130px_120px] bg-[#F0E7FF] px-6 py-4 text-xs font-extrabold tracking-wide text-[#4F465F] uppercase">
                            <span>Reward</span>
                            <span>Kategori</span>
                            <span>Poin</span>
                            <span>Stok</span>
                            <span>Status</span>
                            <span className="text-right">Action</span>
                        </div>

                        <div className="divide-y divide-[#EFE4F8]">
                            {rewards.map((reward) => {
                                const Icon = reward.icon;

                                return (
                                    <div
                                        key={reward.code}
                                        className={`grid min-w-[940px] grid-cols-[minmax(260px,1.6fr)_140px_120px_120px_130px_120px] items-center px-6 py-4 transition hover:bg-[#FBF7FF] ${
                                            reward.muted ? 'text-[#8B8496]' : ''
                                        }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F0E7FF] text-[#6610F2]">
                                                <Icon className="h-5 w-5" />
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
                                            {reward.category}
                                        </p>
                                        <p className="inline-flex items-center gap-2 text-sm font-bold text-[#8B2E0E]">
                                            <CircleDollarSign className="h-4 w-4" />
                                            {reward.points}
                                        </p>
                                        <p
                                            className={`text-sm font-medium ${
                                                reward.stock === '0' ||
                                                reward.stock.includes('Low')
                                                    ? 'text-[#8B2E0E]'
                                                    : 'text-[#382A49]'
                                            }`}
                                        >
                                            {reward.stock}
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
                                        <div className="flex justify-end gap-4 text-[#4F465F]">
                                            <button
                                                type="button"
                                                aria-label={`Lihat ${reward.name}`}
                                                className="transition hover:text-[#6610F2]"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Edit ${reward.name}`}
                                                className="transition hover:text-[#6610F2]"
                                            >
                                                <Pencil className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

            {showAddReward && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/35 px-4 py-8 backdrop-blur-sm">
                    <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                        <div className="flex items-center justify-between border-b border-[#EFE4F8] px-6 py-5">
                            <h2 className="text-xl font-extrabold text-[#1F1730]">
                                Tambah Reward Baru
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowAddReward(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#766B8A] transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                                aria-label="Tutup modal tambah reward"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form className="space-y-5 px-6 py-6">
                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Upload Gambar
                                </span>
                                <div className="mt-2 flex min-h-[150px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8C4F0] bg-[#FDF7FF] px-4 text-center">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8D9FF] text-[#6610F2]">
                                        <ImageUp className="h-6 w-6" />
                                    </span>
                                    <p className="mt-4 text-sm font-bold text-[#1F1730]">
                                        Klik untuk upload atau drag and drop
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-[#8B8496]">
                                        SVG, PNG, JPG atau GIF (Maks. 800x400px)
                                    </p>
                                </div>
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Nama Reward
                                </span>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama reward"
                                    className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                            </label>

                            <div className="grid gap-5 md:grid-cols-[1fr_0.95fr] md:items-end">
                                <label className="block">
                                    <span className="text-sm font-semibold text-[#1F1730]">
                                        Kategori Reward
                                    </span>
                                    <div className="relative mt-2">
                                        <select className="h-11 w-full appearance-none rounded-lg border border-[#D8CDE8] bg-white px-4 pr-10 text-sm text-[#382A49] transition outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10">
                                            <option>Pilih kategori</option>
                                            <option>Voucher</option>
                                            <option>Merchandise</option>
                                            <option>Digital</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#766B8A]" />
                                    </div>
                                </label>

                                <label className="flex h-11 items-center gap-3">
                                    <span className="relative inline-flex h-7 w-12 items-center rounded-full bg-[#6610F2]">
                                        <span className="mr-1 ml-auto h-5 w-5 rounded-full bg-white shadow" />
                                    </span>
                                    <span className="text-sm font-bold text-[#1F1730]">
                                        Status Aktif
                                    </span>
                                </label>
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
                                            placeholder="0"
                                            className="h-11 w-full rounded-lg border border-[#D8CDE8] pr-4 pl-12 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                        />
                                    </div>
                                </label>

                                <label className="block">
                                    <span className="text-sm font-semibold text-[#1F1730]">
                                        Stok
                                    </span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="mt-2 h-11 w-full rounded-lg border border-[#D8CDE8] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-sm font-semibold text-[#1F1730]">
                                    Deskripsi
                                </span>
                                <textarea
                                    rows={4}
                                    placeholder="Tuliskan deskripsi singkat mengenai reward ini..."
                                    className="mt-2 w-full resize-none rounded-lg border border-[#D8CDE8] px-4 py-3 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                            </label>
                        </form>

                        <div className="flex justify-end gap-3 border-t border-[#EFE4F8] bg-[#FBF7FF] px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setShowAddReward(false)}
                                className="h-10 rounded-full border border-[#1A8FE3] px-6 text-sm font-bold text-[#1A8FE3] transition hover:bg-[#E8F4FF]"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="h-10 rounded-full bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC]"
                            >
                                Simpan Reward
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}

AdminRewardIndex.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
