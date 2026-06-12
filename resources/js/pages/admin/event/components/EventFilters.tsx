import { ChevronDown, Search } from 'lucide-react';
import type { EventFilters as EventFiltersType } from '../types';

function FilterSelect({
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
        <label className="relative block min-w-0">
            <span className="sr-only">{placeholder}</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 w-full appearance-none truncate rounded-full border border-[#EFE4F8] bg-white px-5 pr-11 text-sm font-semibold text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none hover:border-[#D9C3F5] focus:border-[#D9C3F5] focus:ring-4 focus:ring-[#6610F2]/10"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-[#766B8A]" />
        </label>
    );
}

export function EventFilters({
    search,
    filters,
    categories,
    visibilities,
    registrationStatuses,
    onSearchChange,
    onFilterChange,
}: {
    search: string;
    filters: EventFiltersType;
    categories: string[];
    visibilities: string[];
    registrationStatuses: string[];
    onSearchChange: (search: string) => void;
    onFilterChange: (filters: EventFiltersType) => void;
}) {
    return (
        <section className="grid gap-4 xl:grid-cols-[minmax(340px,1fr)_220px_220px_280px] xl:items-center">
            <label className="relative block min-w-0">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari judul, ID, kategori, visibility, status registrasi, lokasi, atau penyelenggara event..."
                    className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-4 pl-12 text-sm font-medium text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                />
            </label>

            <div className="grid gap-3 sm:grid-cols-3 xl:contents">
                <FilterSelect
                    value={filters.category}
                    placeholder="Semua Kategori"
                    options={categories.map((category) => ({
                        value: category,
                        label: category,
                    }))}
                    onChange={(category) =>
                        onFilterChange({
                            ...filters,
                            search,
                            category,
                        })
                    }
                />
                <FilterSelect
                    value={filters.visibility}
                    placeholder="Semua Visibility"
                    options={visibilities.map((visibility) => ({
                        value: visibility,
                        label: visibility,
                    }))}
                    onChange={(visibility) =>
                        onFilterChange({
                            ...filters,
                            search,
                            visibility,
                        })
                    }
                />
                <FilterSelect
                    value={filters.registration_status}
                    placeholder="Semua Status Registrasi"
                    options={registrationStatuses.map((status) => ({
                        value: status,
                        label: status,
                    }))}
                    onChange={(registration_status) =>
                        onFilterChange({
                            ...filters,
                            search,
                            registration_status,
                        })
                    }
                />
            </div>
        </section>
    );
}
