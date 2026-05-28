import { Search } from 'lucide-react';
import type { Filters, ReportStatus } from '../types';
import { FilterSelect } from './FilterSelect';

export function PengaduanFilters({
    search,
    filters,
    categories,
    statuses,
    onSearchChange,
    onFilterChange,
}: {
    search: string;
    filters: Filters;
    categories: string[];
    statuses: ReportStatus[];
    onSearchChange: (search: string) => void;
    onFilterChange: (filters: Filters) => void;
}) {
    return (
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[440px]">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#8A7FA2]" />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari ID, pelapor, atau kategori..."
                    className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-5 pl-12 text-sm text-[#382A49] shadow-[0_14px_34px_rgba(102,16,242,0.06)] transition outline-none placeholder:text-[#B8AEC8] focus:border-[#D9C3F5] focus:ring-4 focus:ring-[#6610F2]/10"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[410px]">
                <FilterSelect
                    label="Kategori"
                    value={filters.category}
                    options={categories}
                    placeholder="Semua Kategori"
                    onChange={(category) =>
                        onFilterChange({
                            ...filters,
                            search,
                            category,
                        })
                    }
                />
                <FilterSelect
                    label="Status"
                    value={filters.status}
                    options={statuses}
                    placeholder="Semua Status"
                    onChange={(status) =>
                        onFilterChange({
                            ...filters,
                            search,
                            status,
                        })
                    }
                />
            </div>
        </section>
    );
}
