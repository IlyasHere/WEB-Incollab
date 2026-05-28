import { avatarColors } from '../constants';
import type { Filters, ReportsPage } from '../types';
import { FilterLoadingOverlay } from './FilterLoadingOverlay';
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
            {isFiltering && <FilterLoadingOverlay />}

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
                        {reports.data.length > 0 ? (
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
