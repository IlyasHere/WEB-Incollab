import { Skeleton } from '@/components/ui/skeleton';
import { avatarColors } from '../constants';
import type { Filters, ReportsPage } from '../types';
import { Pagination } from './Pagination';
import { ReportRow } from './ReportRow';

export function PengaduanTable({
    reports,
    filters,
    isFiltering,
}: {
    reports: ReportsPage;
    filters: Filters;
    isFiltering: boolean;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(177,145,221,0.12)]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] border-collapse text-left">
                    <thead>
                        <tr className="border-b border-[#EFE4F8] text-xs font-extrabold tracking-wide text-[#766B8A] uppercase">
                            <th className="px-5 py-4">ID</th>
                            <th className="px-5 py-4">Pelapor</th>
                            <th className="px-5 py-4">Kategori</th>
                            <th className="px-5 py-4">Tanggal</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFiltering ? (
                            <PengaduanTableSkeleton />
                        ) : reports.data.length > 0 ? (
                            reports.data.map((report, index) => (
                                <ReportRow
                                    key={report.id}
                                    report={report}
                                    avatarColor={
                                        avatarColors[
                                            index % avatarColors.length
                                        ]
                                    }
                                />
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-12 text-center text-sm font-medium text-[#766B8A]"
                                >
                                    Belum ada laporan pengguna.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#EFE4F8] px-5 py-4 text-sm text-[#766B8A] sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Menampilkan {reports.from ?? 0}-{reports.to ?? 0} dari{' '}
                    {reports.total} laporan
                </p>
                <Pagination
                    currentPage={reports.current_page}
                    lastPage={reports.last_page}
                    filters={filters}
                />
            </div>
        </section>
    );
}

function PengaduanTableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-b border-[#EFE4F8]">
                    <td className="px-5 py-4">
                        <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    </td>
                    <td className="px-5 py-4">
                        <Skeleton className="h-7 w-28 rounded-full" />
                    </td>
                    <td className="px-5 py-4">
                        <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-5 py-4">
                        <Skeleton className="h-7 w-24 rounded-full" />
                    </td>
                    <td className="px-5 py-4">
                        <Skeleton className="mx-auto h-8 w-20 rounded-lg" />
                    </td>
                </tr>
            ))}
        </>
    );
}
