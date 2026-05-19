import { Search } from 'lucide-react';
import { categoryLabels, statusOptions } from '../constants';
import type { Filters, RewardCategory } from '../types';
import { FilterSelect } from './FilterSelect';

export function RewardFilters({
    search,
    filters,
    categories,
    onSearchChange,
    onFilterChange,
}: {
    search: string;
    filters: Filters;
    categories: RewardCategory[];
    onSearchChange: (search: string) => void;
    onFilterChange: (filters: Filters) => void;
}) {
    return (
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative block min-w-0 flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
                <input
                    type="text"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Cari nama, kode, kategori, atau deskripsi reward..."
                    className="h-12 w-full rounded-full border border-[#EFE4F8] bg-white pr-4 pl-12 text-sm font-medium text-[#382A49] shadow-[0_14px_30px_rgba(56,42,73,0.05)] transition outline-none focus:border-[#6610F2]/40 focus:ring-4 focus:ring-[#6610F2]/10"
                />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                <FilterSelect
                    value={filters.category}
                    placeholder="Semua Kategori"
                    options={categories.map((category) => ({
                        value: category,
                        label: categoryLabels[category],
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
                    value={filters.status}
                    placeholder="Semua Status"
                    options={statusOptions}
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
