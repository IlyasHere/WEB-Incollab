import { ChevronDown } from 'lucide-react';

export function FilterSelect({
    value,
    placeholder,
    options,
    onChange,
}: {
    value: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
}) {
    return (
        <label className="relative block">
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-[#EFE4F8] bg-white px-5 pr-11 text-sm font-semibold text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none hover:border-[#6610F2]/30 focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
        </label>
    );
}
