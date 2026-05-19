import type { ReportStatus } from '../types';

export function StatusBadge({ status }: { status: ReportStatus }) {
    const styles: Record<ReportStatus, string> = {
        Baru: 'bg-[#EAF6FF] text-[#1A8FE3]',
        Diproses: 'bg-[#FFF0E0] text-[#F37933]',
        Selesai: 'bg-[#F0E7FF] text-[#6610F2]',
        Ditolak: 'bg-[#FFE3EA] text-[#D11149]',
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${styles[status]}`}
        >
            {status}
        </span>
    );
}
