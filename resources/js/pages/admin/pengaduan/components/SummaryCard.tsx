import type { LucideIcon } from 'lucide-react';

export function SummaryCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: number;
    icon: LucideIcon;
    accent: string;
}) {
    return (
        <article className="flex min-h-[132px] items-start justify-between rounded-[20px] border border-[#EFE4F8] bg-white p-6 shadow-[0_18px_40px_rgba(177,145,221,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6610F2]/30 hover:shadow-lg">
            <div>
                <p className="text-xs font-semibold text-[#766B8A]">{label}</p>
                <p className="mt-7 text-2xl font-extrabold text-[#1F1730]">
                    {value}
                </p>
            </div>
            <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}
            >
                <Icon className="h-5 w-5" />
            </span>
        </article>
    );
}
