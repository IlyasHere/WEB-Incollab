import { Head, Link } from '@inertiajs/react';
import { ChevronDown, ImageUp } from 'lucide-react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

function FieldLabel({
    children,
    required = false,
}: {
    children: ReactNode;
    required?: boolean;
}) {
    return (
        <span className="text-sm font-semibold text-[#1F1730]">
            {children}
            {required && <span className="text-[#D11149]"> *</span>}
        </span>
    );
}

function SectionTitle({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center gap-4">
            <p className="shrink-0 text-xs font-extrabold tracking-wide text-[#6610F2] uppercase">
                {children}
            </p>
            <div className="h-px flex-1 bg-[#EFE4F8]" />
        </div>
    );
}

function inputClass() {
    return 'h-11 w-full rounded-lg border border-[#D8CDE8] bg-[#FDF7FF] px-4 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10';
}

export default function AdminEventCreate() {
    return (
        <>
            <Head title="Tambah Event Baru" />

            <div className="space-y-6">
                <Link
                    href="/admin/event"
                    className="inline-flex text-sm font-bold text-[#6610F2] transition hover:text-[#550DCC]"
                >
                    ← Kembali ke Kelola Event
                </Link>

                <section>
                    <h1 className="text-3xl font-extrabold tracking-[-0.01em] text-[#1F1730]">
                        Tambah Event Baru
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F5573] sm:text-base">
                        Lengkapi informasi event untuk mempublikasikan kegiatan
                        baru.
                    </p>
                </section>

                <section className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] sm:p-8">
                    <form className="space-y-8">
                        <div className="space-y-5">
                            <SectionTitle>Informasi Utama</SectionTitle>

                            <label className="block">
                                <FieldLabel required>Judul Event</FieldLabel>
                                <input
                                    type="text"
                                    placeholder="Masukkan judul event..."
                                    className={`mt-2 ${inputClass()}`}
                                />
                            </label>

                            <label className="block">
                                <FieldLabel required>Kategori Event</FieldLabel>
                                <div className="relative mt-2">
                                    <select
                                        className={`${inputClass()} appearance-none pr-10`}
                                    >
                                        <option>Pilih Kategori...</option>
                                        <option>Lingkungan</option>
                                        <option>Pendidikan</option>
                                        <option>Sosial</option>
                                        <option>Komunitas</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-[#766B8A]" />
                                </div>
                            </label>

                            <label className="block">
                                <FieldLabel required>
                                    Deskripsi Event
                                </FieldLabel>
                                <textarea
                                    rows={5}
                                    placeholder="Tulis deskripsi lengkap event..."
                                    className="mt-2 w-full resize-none rounded-lg border border-[#D8CDE8] bg-[#FDF7FF] px-4 py-3 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                            </label>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle>Waktu & Tempat</SectionTitle>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="block">
                                    <FieldLabel required>
                                        Tanggal Mulai Event
                                    </FieldLabel>
                                    <input
                                        type="date"
                                        className={`mt-2 ${inputClass()}`}
                                    />
                                </label>

                                <label className="block">
                                    <FieldLabel>
                                        Tanggal Selesai Event
                                    </FieldLabel>
                                    <input
                                        type="date"
                                        className={`mt-2 ${inputClass()}`}
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <FieldLabel>Lokasi</FieldLabel>
                                <input
                                    type="text"
                                    placeholder="Nama tempat atau link online..."
                                    className={`mt-2 ${inputClass()}`}
                                />
                            </label>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle>Detail Tambahan</SectionTitle>

                            <div className="grid gap-5 md:grid-cols-2">
                                <label className="block">
                                    <FieldLabel>Penyelenggara</FieldLabel>
                                    <input
                                        type="text"
                                        placeholder="Nama instansi/komunitas"
                                        className={`mt-2 ${inputClass()}`}
                                    />
                                </label>

                                <label className="block">
                                    <FieldLabel>
                                        Deadline Pendaftaran
                                    </FieldLabel>
                                    <input
                                        type="date"
                                        className={`mt-2 ${inputClass()}`}
                                    />
                                </label>
                            </div>

                            <label className="block max-w-md">
                                <FieldLabel>Poin Event</FieldLabel>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className={`mt-2 ${inputClass()}`}
                                />
                            </label>

                            <label className="block">
                                <FieldLabel>Poster Event</FieldLabel>
                                <div className="mt-2 flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8C4F0] bg-[#FDF7FF] px-4 text-center">
                                    <ImageUp className="h-8 w-8 text-[#6610F2]" />
                                    <p className="mt-3 text-sm font-bold text-[#1F1730]">
                                        Klik untuk upload atau drag & drop
                                    </p>
                                    <p className="mt-1 text-xs font-medium text-[#8B8496]">
                                        PNG, JPG, max 5MB
                                    </p>
                                </div>
                            </label>

                            <label className="block">
                                <FieldLabel required>
                                    Link Pendaftaran
                                </FieldLabel>
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    className={`mt-2 ${inputClass()}`}
                                />
                            </label>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle>Konten Detail</SectionTitle>

                            <label className="block">
                                <FieldLabel>Syarat & Ketentuan</FieldLabel>
                                <textarea
                                    rows={5}
                                    placeholder="Tuliskan syarat dan ketentuan..."
                                    className="mt-2 w-full resize-none rounded-lg border border-[#D8CDE8] bg-[#FDF7FF] px-4 py-3 text-sm text-[#382A49] transition outline-none placeholder:text-[#8B8496] focus:border-[#6610F2] focus:bg-white focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                            </label>
                        </div>

                        <div className="space-y-5">
                            <SectionTitle>Publikasi</SectionTitle>

                            <div>
                                <FieldLabel required>Status Event</FieldLabel>
                                <div className="mt-3 grid gap-3 md:grid-cols-3">
                                    {[
                                        ['Aktif', 'bg-[#22C55E]'],
                                        ['Draft', 'bg-[#94A3B8]'],
                                        ['Nonaktif', 'bg-[#D11149]'],
                                    ].map(([label, dot], index) => (
                                        <label
                                            key={label}
                                            className={`flex h-11 items-center gap-3 rounded-lg border px-4 text-sm font-semibold text-[#382A49] transition ${
                                                index === 1
                                                    ? 'border-[#6610F2] ring-2 ring-[#6610F2]/10'
                                                    : 'border-[#D8CDE8] hover:border-[#6610F2]/40'
                                            }`}
                                        >
                                            <span className="h-4 w-4 rounded-full border border-[#CFC3DE] bg-white">
                                                {index === 1 && (
                                                    <span className="m-1 block h-2 w-2 rounded-full bg-[#6610F2]" />
                                                )}
                                            </span>
                                            <span
                                                className={`h-2 w-2 rounded-full ${dot}`}
                                            />
                                            {label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-[#EFE4F8] pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs font-medium text-[#766B8A]">
                                Field bertanda{' '}
                                <span className="text-[#D11149]">*</span> wajib
                                diisi.
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/admin/event"
                                    className="inline-flex h-11 items-center justify-center rounded-lg px-6 text-sm font-bold text-[#5F5573] transition hover:bg-[#F7F1FF]"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="button"
                                    className="h-11 rounded-lg border border-[#6610F2] px-6 text-sm font-bold text-[#6610F2] transition hover:bg-[#F4ECFF]"
                                >
                                    Simpan Draft
                                </button>
                                <button
                                    type="button"
                                    className="h-11 rounded-lg bg-[#6610F2] px-6 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC]"
                                >
                                    Publikasikan Event
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
}

AdminEventCreate.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
