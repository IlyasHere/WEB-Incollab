import type { SummaryCardItem } from '../types';

export function SummaryCard({
    label,
    value,
    icon: Icon,
    accent,
}: SummaryCardItem) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_45px_rgba(56,42,73,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6610F2]/30 hover:shadow-lg">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#F0E7FF] opacity-70 transition group-hover:scale-110" />
            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold tracking-wide text-[#4F465F] uppercase">
                        {label}
                    </p>
                    <p className="mt-5 text-3xl font-extrabold text-[#4C00D8]">
                        {value.toLocaleString('id-ID')}
                    </p>
                </div>
                <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}
                >
                    <Icon className="h-5 w-5" />
                </span>
            </div>
        </article>
    );
}
