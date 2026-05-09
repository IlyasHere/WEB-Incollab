import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

const dummyNotifications = [
    {
        id: 1,
        title: 'Lomba Inovasi Digital',
        body: 'Lomba “Inovasi Digital 2026” akan dimulai pada 20 Mei. Siapkan tim dan presentasi anda.',
        time: '2 jam lalu',
        image:
            'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=180&q=80',
    },
    {
        id: 2,
        title: 'Pengumuman Pemenang',
        body: 'Selamat! Tim kamu masuk 3 besar lomba “Hackathon Kampus”. Cek detail pembagian hadiah.',
        time: '5 jam lalu',
        image:
            'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=180&q=80',
    },
    {
        id: 3,
        title: 'Komentar Baru pada Proposal',
        body: 'Dosen pembimbing memberikan masukan pada proposal lomba kamu. Silakan cek segera.',
        time: 'Kemarin',
        image:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=180&q=80',
    },
    {
        id: 4,
        title: 'Reminder Pendaftaran',
        body: 'Pendaftaran lomba “Desain UI/UX” ditutup besok malam. Jangan sampai terlewat.',
        time: '2 hari lalu',
        image:
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=180&q=80',
    },
];

export default function PengaturanNotifikasi() {
    return (
        <>
            <Head title="Notifikasi" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <section className="mx-auto max-w-[1320px] rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-[#1F1730] sm:text-3xl">
                            Notifikasi
                        </h1>
                    </div>

                    <div className="space-y-4">
                        {dummyNotifications.map((item) => (
                            <article
                                key={item.id}
                                className="flex items-start gap-4 rounded-[24px] border border-[#EADCF8] bg-[#FBF7FF] p-4 shadow-[0_10px_30px_rgba(102,16,242,0.08)]"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="h-20 w-20 flex-shrink-0 rounded-3xl object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="text-base font-semibold text-[#1F1730]">
                                            {item.title}
                                        </h2>
                                        <span className="shrink-0 text-xs font-medium text-[#766B8A]">
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-[#5E5873]">
                                        {item.body}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}

PengaturanNotifikasi.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
