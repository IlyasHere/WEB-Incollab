import { Filter, PackageOpen } from 'lucide-react';

export function EmptyRewardState({ hasFilter }: { hasFilter: boolean }) {
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
