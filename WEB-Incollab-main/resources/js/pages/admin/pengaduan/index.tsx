import { Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { PengaduanFilters } from './components/PengaduanFilters';
import { PengaduanSummaryGrid } from './components/PengaduanSummaryGrid';
import { PengaduanTable } from './components/PengaduanTable';
import type { AdminPengaduanIndexProps, Filters } from './types';
import { cleanFilters } from './utils';

export default function AdminPengaduanIndex({
    reports,
    summary,
    filters,
    categories,
    statuses,
}: AdminPengaduanIndexProps) {
    const [search, setSearch] = useState(filters.search);
    const [isFiltering, setIsFiltering] = useState(false);

    const visitWithFilters = useCallback((nextFilters: Filters) => {
        router.get('/admin/pengaduan', cleanFilters(nextFilters), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: ['reports', 'filters'],
            onStart: () => setIsFiltering(true),
            onFinish: () => setIsFiltering(false),
        });
    }, []);

    useEffect(() => {
        if (search === filters.search) {
            return;
        }

        const timeout = window.setTimeout(() => {
            visitWithFilters({
                ...filters,
                search,
            });
        }, 450);

        return () => window.clearTimeout(timeout);
    }, [search, filters, visitWithFilters]);

    return (
        <>
            <Head title="Pengaduan" />

            <div className="space-y-6">
                <div>
                    <header>
                        <h1 className="text-3xl font-extrabold text-[#1F1730]">
                            Pengaduan
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#766B8A] sm:text-base">
                            Kelola laporan pengguna terkait event, postingan,
                            komentar, atau aktivitas mencurigakan.
                        </p>
                    </header>
                </div>

                <PengaduanSummaryGrid summary={summary} />

                <PengaduanFilters
                    search={search}
                    filters={filters}
                    categories={categories}
                    statuses={statuses}
                    onSearchChange={setSearch}
                    onFilterChange={visitWithFilters}
                />

                <PengaduanTable
                    reports={reports}
                    filters={filters}
                    isFiltering={isFiltering}
                />
            </div>
        </>
    );
}

AdminPengaduanIndex.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
