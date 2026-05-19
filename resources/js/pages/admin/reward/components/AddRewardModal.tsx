import { useForm } from '@inertiajs/react';
import {
    ChevronDown,
    CircleDollarSign,
    ImageUp,
    PackageCheck,
    X,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import type { RewardCategory, RewardImage } from '../types';
import { InputError } from './InputError';

export function AddRewardModal({
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
            images: File[];
        }>({
            nama_reward: '',
            kategori_reward: '',
            poin_dibutuhkan: '',
            stok: '',
            deskripsi: '',
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
                                        onChange={(event) =>
                                            setData(
                                                'kategori_reward',
                                                event.target
                                                    .value as RewardCategory,
                                            )
                                        }
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
