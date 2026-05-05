import { Head, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import ComposerCard from '@/components/dashboard/ComposerCard';
import PostCard from '@/components/dashboard/PostCard';
import type { FeedPost } from '@/components/dashboard/PostCard';
import RightSidebar from '@/components/dashboard/RightSidebar';
import type {
    CollaborationPartner,
    TrendingTopic,
} from '@/components/dashboard/RightSidebar';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { Auth } from '@/types/auth';

const posts: FeedPost[] = [
    {
        id: 1,
        user: {
            name: 'Amanda Rizky',
            major: 'Sistem Informasi',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        },
        postedAt: '2 jam yang lalu',
        badge: 'OPEN RECRUITING',
        badgeColor: 'bg-[#F0E7FF] text-[#6610F2]',
        title: 'Mencari UI/UX Designer untuk Proyek Aplikasi Kesehatan Mental',
        description:
            'Halo teman-teman! Saya dan tim sedang mengembangkan purwarupa aplikasi "MindEase" untuk PKM-KC tahun ini. Kami butuh partner yang nyaman dengan Figma, alur onboarding, dan eksplorasi visual yang ramah pengguna.',
        hashtags: ['#PKMKC', '#UIUXDesign', '#MentalHealthApp'],
        likes: 24,
        comments: 5,
    },
    {
        id: 2,
        user: {
            name: 'Bima Satria',
            major: 'Teknik Informatika',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        },
        postedAt: '5 jam yang lalu',
        badge: 'INFO LOMBA',
        badgeColor: 'bg-[#DDEEFF] text-[#1A8FE3]',
        title: 'Hackathon Nasional 2024 - Buka Tim Baru!',
        description:
            'Pendaftaran dibuka minggu depan. Saya butuh 1 backend developer, 1 data analyst, dan 1 UI designer untuk target MVP dalam tiga minggu. Fokus kita produk edukasi dengan dashboard yang siap dipresentasikan.',
        hashtags: ['#HackathonNasional', '#BackEndDev', '#DataAnalyst'],
        likes: 89,
        comments: 12,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    },
];

const topics: TrendingTopic[] = [
    { tag: '#HackathonNasional', posts: '1.2k postingan baru' },
    { tag: '#PKMKC2024', posts: '850 postingan baru' },
    { tag: '#UIUXPortofolio', posts: '432 postingan baru' },
    { tag: '#LombaEsai', posts: '210 postingan baru' },
];

const partners: CollaborationPartner[] = [
    {
        name: 'Ani Wijaya',
        role: 'UI/UX',
        campus: 'Binus',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
        name: 'Rizky Putra',
        role: 'Backend',
        campus: 'ITS',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: Auth }>().props;

    return (
        <>
            <Head title="Dashboard" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto flex max-w-[1320px] gap-6 xl:gap-8">
                    <section className="min-w-0 flex-1">
                        <div className="space-y-5 sm:space-y-6">
                            <ComposerCard userName={auth.user.name} />

                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </section>

                    <RightSidebar topics={topics} partners={partners} />
                </div>
            </main>
        </>
    );
}

Dashboard.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
