import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

type ComposerCardProps = {
    userName: string;
    userAvatar?: string | null;
};

export default function ComposerCard({
    userName,
    userAvatar,
}: ComposerCardProps) {
    const initials = userName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <section className="overflow-hidden rounded-[24px] border border-[#EFE4F8] bg-white shadow-[0_14px_34px_rgba(177,145,221,0.13)]">
            <div className="flex flex-col gap-4 border-l-4 border-[#6610F2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-sm font-bold text-white">
                        {userAvatar ? (
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-extrabold text-[#1F1730]">
                            Selamat datang, {userName} 👋
                        </h1>
                        <p className="mt-1 text-sm leading-5 text-[#766B8A]">
                            Bagikan ide kolaborasi, proyek, lomba, atau risetmu
                            bersama mahasiswa lain.
                        </p>
                    </div>
                </div>

                <Link
                    href="/add-feed"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6610F2] px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(102,16,242,0.22)] transition hover:bg-[#550DCC] sm:shrink-0"
                >
                    <Plus className="h-4 w-4" />
                    Buat Postingan
                </Link>
            </div>
        </section>
    );
}
