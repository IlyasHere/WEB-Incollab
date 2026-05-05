import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AdminLayout from '@/layouts/AdminLayout';

export default function AdminPoinIndex() {
    return (
        <>
            <Head title="Kelola Poin" />
            <section className="rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#6610F2]">
                    Poin
                </p>
                <h1 className="mt-3 text-2xl font-bold text-[#1F1730]">
                    Kelola Poin
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#766B8A]">
                    Halaman awal untuk mengawasi klaim, penambahan, dan
                    penukaran poin mahasiswa.
                </p>
            </section>
        </>
    );
}

AdminPoinIndex.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
