import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    Briefcase,
    Coins,
    FileText,
    Github,
    Globe,
    GraduationCap,
    Heart,
    Instagram,
    Linkedin,
    MessageSquare,
    Send,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageLoading } from '@/hooks/use-page-loading';
import DashboardLayout from '@/layouts/DashboardLayout';

type Profile = {
    id: number;
    name: string;
    avatar?: string | null;
    bio?: string | null;
    universitas?: string | null;
    jurusan?: string | null;
    angkatan?: string | null;
    semester?: number | null;
    totalPoin: number;
    postCount: number;
    skills: string[];
    interests: string[];
    contacts: {
        instagram?: string | null;
        linkedin?: string | null;
        github?: string | null;
        portfolio?: string | null;
    };
};

type ProfilePost = {
    id: number;
    title: string;
    description: string;
    hashtags: string[];
    likes: number;
    comments: number;
    image?: string | null;
};

type ProfileShowProps = {
    profile: Profile;
    posts: ProfilePost[];
};

function initials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function formatContact(value?: string | null) {
    if (!value) {
        return null;
    }

    return value.replace(/^https?:\/\//, '').replace(/^www\./, '');
}

function contactHref(type: keyof Profile['contacts'], value: string) {
    if (value.startsWith('http')) {
        return value;
    }

    if (type === 'instagram') {
        return `https://instagram.com/${value.replace('@', '')}`;
    }

    if (type === 'linkedin') {
        return `https://linkedin.com/in/${value.replace(/^\/?in\//, '')}`;
    }

    if (type === 'github') {
        return `https://github.com/${value.replace('@', '')}`;
    }

    return `https://${value}`;
}

function EmptyFeedState({ name }: { name: string }) {
    return (
        <section className="rounded-[10px] border border-dashed border-[#D8C4F0] bg-white px-6 py-12 text-center shadow-[0_18px_45px_rgba(177,145,221,0.12)]">
            <FileText className="mx-auto h-10 w-10 text-[#BCA6D8]" />
            <h2 className="mt-4 text-lg font-bold text-[#221A32]">
                Belum ada feed
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                {name} belum memiliki feed.
            </p>
        </section>
    );
}

function ProfilePostCard({ post }: { post: ProfilePost }) {
    return (
        <article className="group overflow-hidden rounded-[10px] border border-[#EFE4F8] bg-white shadow-[0_16px_34px_rgba(177,145,221,0.13)] transition duration-200 hover:-translate-y-1 hover:border-[#D8C4F0] hover:shadow-[0_22px_42px_rgba(177,145,221,0.2)]">
            {post.image ? (
                <img
                    src={post.image}
                    alt={post.title}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
            ) : (
                <div className="flex h-44 w-full items-center justify-center bg-[#EADCF8] text-[#8F65D8] transition duration-300 group-hover:bg-[#E2D1F8]">
                    <FileText className="h-12 w-12" />
                </div>
            )}

            <div className="p-4">
                <h3 className="line-clamp-2 text-lg leading-6 font-bold text-[#221A32]">
                    {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5A516C]">
                    {post.description}
                </p>

                {post.hashtags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {post.hashtags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="rounded-[10px] bg-[#F1E8FA] px-2 py-1 text-xs font-medium text-[#5F556F]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-[#F1E7FA] px-4 py-3 text-sm text-[#5F556F]">
                <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                    </span>
                </div>
                <Link
                    href={`/post/${post.id}`}
                    className="font-bold text-[#6610F2] transition hover:text-[#570DD1]"
                >
                    Lihat Detail
                </Link>
            </div>
        </article>
    );
}

function ProfileSkeleton() {
    return (
        <div className="mx-auto max-w-[1040px] space-y-6">
            <header>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-4 h-9 w-56" />
                <Skeleton className="mt-3 h-4 w-80" />
            </header>

            <section className="rounded-[10px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.13)] sm:p-8">
                <div className="grid gap-8 lg:grid-cols-[140px_1fr]">
                    <Skeleton className="mx-auto h-28 w-28 rounded-full lg:mx-0" />
                    <div className="min-w-0">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="mt-3 h-5 w-80 max-w-full" />
                        <Skeleton className="mt-3 h-4 w-44" />
                        <Skeleton className="mt-6 h-4 w-full" />
                        <Skeleton className="mt-2 h-4 w-5/6" />
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <Skeleton className="h-24 rounded-[10px]" />
                            <Skeleton className="h-24 rounded-[10px]" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-44 rounded-[10px]" />
                    <Skeleton className="h-44 rounded-[10px]" />
                </div>
            </section>

            <section>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="mt-2 h-4 w-72" />
                <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <article
                            key={index}
                            className="overflow-hidden rounded-[10px] border border-[#EFE4F8] bg-white shadow-[0_16px_34px_rgba(177,145,221,0.13)]"
                        >
                            <Skeleton className="h-44 w-full rounded-none" />
                            <div className="p-4">
                                <Skeleton className="h-6 w-4/5" />
                                <Skeleton className="mt-3 h-4 w-full" />
                                <Skeleton className="mt-2 h-4 w-2/3" />
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function ProfileShow({ profile, posts }: ProfileShowProps) {
    const isLoading = usePageLoading();
    const contacts = [
        {
            type: 'instagram' as const,
            label: formatContact(profile.contacts.instagram),
            value: profile.contacts.instagram,
            icon: Instagram,
        },
        {
            type: 'linkedin' as const,
            label: formatContact(profile.contacts.linkedin),
            value: profile.contacts.linkedin,
            icon: Linkedin,
        },
        {
            type: 'github' as const,
            label: formatContact(profile.contacts.github),
            value: profile.contacts.github,
            icon: Github,
        },
        {
            type: 'portfolio' as const,
            label: formatContact(profile.contacts.portfolio),
            value: profile.contacts.portfolio,
            icon: Globe,
        },
    ].filter((contact) => contact.value && contact.label);

    function startChat() {
        router.post('/chat', { user_id: profile.id });
    }

    return (
        <>
            <Head title={`Profil ${profile.name}`} />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto max-w-[1040px] space-y-6">
                    <header>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6610F2] transition hover:text-[#570DD1]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Link>
                        <h1 className="mt-4 text-[30px] leading-tight font-extrabold text-[#1F1730]">
                            Profil Pengguna
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-[#5F556F]">
                            Lihat informasi profil dan postingan kolaborasi dari
                            pengguna ini.
                        </p>
                    </header>

                    <section className="rounded-[10px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.13)] sm:p-8">
                        <div className="grid gap-8 lg:grid-cols-[140px_1fr]">
                            <div className="flex justify-center lg:justify-start">
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="h-28 w-28 shrink-0 rounded-full object-cover shadow-[0_12px_26px_rgba(56,42,73,0.16)]"
                                    />
                                ) : (
                                    <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-2xl font-bold text-white shadow-[0_12px_26px_rgba(56,42,73,0.16)]">
                                        {initials(profile.name)}
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0">
                                <div className="flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <h2 className="text-2xl font-extrabold text-[#1F1730] sm:text-3xl">
                                            {profile.name}
                                        </h2>
                                        <p className="mt-2 flex flex-wrap items-center gap-1 text-sm font-semibold text-[#6610F2] sm:text-base">
                                            <GraduationCap className="h-4 w-4" />
                                            <span>
                                                {profile.jurusan ||
                                                    'Jurusan belum diisi'}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {profile.universitas ||
                                                    'Universitas belum diisi'}
                                            </span>
                                        </p>
                                        <p className="mt-2 text-sm text-[#5F556F] sm:text-base">
                                            Angkatan {profile.angkatan || '-'} •
                                            Semester {profile.semester || '-'}
                                        </p>
                                        <p className="mt-5 text-[15px] leading-7 text-[#4C435E] sm:text-base">
                                            {profile.bio ||
                                                'Pengguna ini belum menambahkan bio profil.'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={startChat}
                                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#6610F2] px-4 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.24)] transition hover:bg-[#570DD1]"
                                    >
                                        <Send className="h-4 w-4" />
                                        Mulai Chat
                                    </button>
                {isLoading ? (
                    <ProfileSkeleton />
                ) : (
                    <div className="mx-auto max-w-[1040px] space-y-6">
                        <header>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#6610F2] transition hover:text-[#570DD1]"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                            <h1 className="mt-4 text-[30px] leading-tight font-extrabold text-[#1F1730]">
                                Profil Pengguna
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-[#5F556F]">
                                Lihat informasi profil dan postingan kolaborasi
                                dari pengguna ini.
                            </p>
                        </header>

                        <section className="rounded-[10px] border border-[#EFE4F8] bg-white p-5 shadow-[0_18px_45px_rgba(177,145,221,0.13)] sm:p-8">
                            <div className="grid gap-8 lg:grid-cols-[140px_1fr]">
                                <div className="flex justify-center lg:justify-start">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="h-28 w-28 shrink-0 rounded-full object-cover shadow-[0_12px_26px_rgba(56,42,73,0.16)]"
                                        />
                                    ) : (
                                        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-2xl font-bold text-white shadow-[0_12px_26px_rgba(56,42,73,0.16)]">
                                            {initials(profile.name)}
                                        </div>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="max-w-3xl">
                                        <h2 className="text-2xl font-extrabold text-[#1F1730] sm:text-3xl">
                                            {profile.name}
                                        </h2>
                                        <p className="mt-2 flex flex-wrap items-center gap-1 text-sm font-semibold text-[#6610F2] sm:text-base">
                                            <GraduationCap className="h-4 w-4" />
                                            <span>
                                                {profile.jurusan ||
                                                    'Jurusan belum diisi'}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                {profile.universitas ||
                                                    'Universitas belum diisi'}
                                            </span>
                                        </p>
                                        <p className="mt-2 text-sm text-[#5F556F] sm:text-base">
                                            Angkatan {profile.angkatan || '-'} •
                                            Semester {profile.semester || '-'}
                                        </p>
                                        <p className="mt-5 text-[15px] leading-7 text-[#4C435E] sm:text-base">
                                            {profile.bio ||
                                                'Pengguna ini belum menambahkan bio profil.'}
                                        </p>
                                    </div>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <div className="min-h-[96px] rounded-[10px] border border-[#EFE4F8] bg-[#FDF7FF] px-5 py-4">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A6D8F]">
                                                <Coins className="h-4 w-4 text-[#6610F2]" />
                                                Poin Dimiliki
                                            </div>
                                            <p className="mt-3 text-3xl font-extrabold text-[#1F1730]">
                                                {profile.totalPoin}
                                            </p>
                                        </div>
                                        <div className="min-h-[96px] rounded-[10px] border border-[#EFE4F8] bg-[#FDF7FF] px-5 py-4">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A6D8F]">
                                                <FileText className="h-4 w-4 text-[#6610F2]" />
                                                Jumlah Postingan
                                            </div>
                                            <p className="mt-3 text-3xl font-extrabold text-[#1F1730]">
                                                {profile.postCount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
                                <section className="min-w-0">
                                    <div className="rounded-[10px] border border-[#EFE4F8] bg-white p-5">
                                        <div className="mb-4 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-[#6610F2]" />
                                            <h3 className="text-xl font-bold text-[#1F1730]">
                                                Skill & Minat
                                            </h3>
                                        </div>

                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-xs text-[#7A6D8F]">
                                                    Skill Utama
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {(profile.skills.length
                                                        ? profile.skills
                                                        : ['Belum diisi']
                                                    ).map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="rounded-[10px] bg-[#EFE2FF] px-3 py-1 text-xs font-bold text-[#6610F2]"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xs text-[#7A6D8F]">
                                                    Bidang Minat
                                                </p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {(profile.interests.length
                                                        ? profile.interests
                                                        : ['Belum diisi']
                                                    ).map((interest) => (
                                                        <span
                                                            key={interest}
                                                            className="rounded-[10px] bg-[#DCEEFF] px-3 py-1 text-xs font-bold text-[#1D5E96]"
                                                        >
                                                            {interest}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="min-w-0">
                                    <div className="rounded-[10px] border border-[#EFE4F8] bg-white p-5">
                                        <div className="mb-4 flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-[#6610F2]" />
                                            <h3 className="text-xl font-bold text-[#1F1730]">
                                                Kontak & Tautan
                                            </h3>
                                        </div>

                                        {contacts.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {contacts.map((contact) => (
                                                    <a
                                                        key={contact.type}
                                                        href={contactHref(
                                                            contact.type,
                                                            contact.value || '',
                                                        )}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex min-h-[72px] min-w-0 items-center gap-3 rounded-[10px] border border-[#F1E7FA] bg-[#FDF7FF] px-4 py-3 text-sm text-[#4C435E] transition hover:border-[#D8C4F0] hover:text-[#6610F2]"
                                                    >
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F1E8FA] text-[#5F556F]">
                                                            <contact.icon className="h-4 w-4" />
                                                        </span>
                                                        <span className="truncate">
                                                            {contact.label}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-[#766B8A]">
                                                Pengguna ini belum menambahkan
                                                kontak atau tautan.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </section>

                                    {contacts.length > 0 ? (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {contacts.map((contact) => (
                                                <a
                                                    key={contact.type}
                                                    href={contactHref(
                                                        contact.type,
                                                        contact.value || '',
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex min-h-[72px] min-w-0 items-center gap-3 rounded-[10px] border border-[#F1E7FA] bg-[#FDF7FF] px-4 py-3 text-sm text-[#4C435E] transition hover:border-[#D8C4F0] hover:text-[#6610F2]"
                                                >
                                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#F1E8FA] text-[#5F556F]">
                                                        <contact.icon className="h-4 w-4" />
                                                    </span>
                                                    <span className="truncate">
                                                        {contact.label}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-[#766B8A]">
                                            Pengguna ini belum menambahkan
                                            kontak atau tautan.
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-extrabold text-[#1F1730]">
                            Feed
                        </h2>
                        <p className="mt-1 text-sm text-[#5F556F]">
                            Postingan dan proyek terbaru dari {profile.name}.
                        </p>

                        <div className="mt-5">
                            {posts.length > 0 ? (
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {posts.map((post) => (
                                        <ProfilePostCard
                                            key={post.id}
                                            post={post}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyFeedState name={profile.name} />
                            )}
                        </div>
                    </section>
                </div>
                        <section>
                            <h2 className="text-2xl font-extrabold text-[#1F1730]">
                                Feed
                            </h2>
                            <p className="mt-1 text-sm text-[#5F556F]">
                                Postingan  terbaru dari {profile.name}
                                .
                            </p>

                            <div className="mt-5">
                                {posts.length > 0 ? (
                                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                        {posts.map((post) => (
                                            <ProfilePostCard
                                                key={post.id}
                                                post={post}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyFeedState name={profile.name} />
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </>
    );
}

ProfileShow.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
