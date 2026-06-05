import { Menu, Search, X, LogOut } from 'lucide-react';

type TopNavbarProps = {
    userName: string;
    userAvatar?: string | null;
    mobileMenuOpen: boolean;
    onToggleMenu: () => void;
    onLogout?: () => void;
};

export default function TopNavbar({
    userName,
    userAvatar,
    mobileMenuOpen,
    onToggleMenu,
    onLogout,
}: TopNavbarProps) {
    const initials = userName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 border-b border-[#EFE4F8] bg-white/95 backdrop-blur">
            <div className="flex h-[80px] items-center gap-3 px-4 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={onToggleMenu}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EEE4F9] text-[#5E5873] transition hover:bg-[#F8F3FF] md:hidden"
                    aria-label={
                        mobileMenuOpen
                            ? 'Tutup menu navigasi'
                            : 'Buka menu navigasi'
                    }
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>

                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#8A7FA2]" />
                    <input
                        type="text"
                        placeholder="Cari postingan, hashtag, atau topik..."
                        className="h-12 w-full rounded-full border border-[#EADCF8] bg-[#F7F1FF] pr-4 pl-11 text-sm text-[#382A49] transition outline-none placeholder:text-[#9B8FB3] focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                    />
                </div>

                {/* Avatar + Logout Dropdown */}
                <div className="group relative">
                    <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#6610F2,#A855F7)] text-sm font-bold text-white shadow-[0_10px_20px_rgba(102,16,242,0.25)]">
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

                    <div className="invisible absolute top-14 right-0 w-44 translate-y-2 rounded-2xl border border-[#EEE4F9] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(56,42,73,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                        <div className="px-3 py-2">
                            <p className="text-xs text-[#8A7FA2]">
                                Masuk sebagai
                            </p>
                            <p className="truncate text-sm font-semibold text-[#382A49]">
                                {userName}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#D11149] transition hover:bg-[#FFF0F4]"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
