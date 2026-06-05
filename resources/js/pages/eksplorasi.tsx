import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

function PlaceholderPage({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
            <div className="mx-auto max-w-[1320px]">
                <section className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">
                    <p className="text-sm font-semibold tracking-[0.16em] text-[#6610F2] uppercase">
                        InCollab
                    </p>
                    <h1 className="mt-3 text-[32px] font-bold text-[#221A32]">
                        {title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-[16px] leading-8 text-[#5A516C]">
                        {description}
                    </p>
                </section>
            </div>
        </main>
    );
}

export default function Eksplorasi() {
    return (
        <>
            <Head title="Eksplorasi" />
            <PlaceholderPage
                title="Eksplorasi"
                description="Halaman ini disiapkan sebagai placeholder untuk area eksplorasi postingan, topik, dan kolaborasi. Nantikan fitur-fitur menarik yang akan datang di sini!"
            />
        </>
    );
}

Eksplorasi.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
