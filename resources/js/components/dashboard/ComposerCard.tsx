type ComposerCardProps = {
    userName: string;
};

export default function ComposerCard({ userName }: ComposerCardProps) {
    const initials = userName
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <section className="rounded-[28px] border border-white/70 bg-white p-4 shadow-[0_18px_45px_rgba(177,145,221,0.16)] sm:p-5">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A8FE3,#6610F2)] text-sm font-bold text-white">
                    {initials}
                </div>
                <button
                    type="button"
                    className="min-h-[80px] flex-1 rounded-[22px] bg-[#F7F1FF] px-5 py-4 text-left text-sm leading-6 text-[#A197B4] transition hover:bg-[#F3EAFF] sm:text-base"
                >
                    Bagikan ide kolaborasi atau cari tim proyekmu di sini...
                </button>
            </div>
        </section>
    );
}
