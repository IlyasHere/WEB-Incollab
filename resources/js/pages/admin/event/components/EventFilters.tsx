import { Search } from 'lucide-react';
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
            <span className="pointer-events-none absolute top-1/2 right-5 h-4 w-4 -translate-y-1/2 text-[#64748B]">
                ▾
            </span>
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
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative block min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari judul, ID, kategori, visibility, status registrasi, lokasi, atau penyelenggara event..."
                    className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-4 pl-12 text-sm font-medium text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                />
            </label>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[640px]">
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
