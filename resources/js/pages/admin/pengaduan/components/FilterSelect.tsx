import { ChevronDown } from 'lucide-react';

export function FilterSelect({
    label,
    value,
    options,
    placeholder,
    onChange,
}: {
    label: string;
    value: string;
    options: string[];
    placeholder: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="relative block">
            <span className="sr-only">{label}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full appearance-none rounded-full border border-[#EFE4F8] bg-white px-5 pr-11 text-sm font-semibold text-[#382A49] shadow-[0_14px_34px_rgba(102,16,242,0.06)] transition outline-none hover:border-[#D9C3F5] focus:border-[#D9C3F5] focus:ring-4 focus:ring-[#6610F2]/10"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-[#766B8A]" />
        </label>
    );
}
