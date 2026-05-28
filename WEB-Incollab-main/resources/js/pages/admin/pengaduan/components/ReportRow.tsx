import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import type { Report } from '../types';
import { initials } from '../utils';
import { StatusBadge } from './StatusBadge';

export function ReportRow({
    report,
    avatarColor,
}: {
    report: Report;
    avatarColor: string;
}) {
    return (
        <tr className="border-b border-[#EFE4F8] text-sm text-[#382A49] last:border-b-0">
            <td className="px-5 py-5 font-bold text-[#1F1730]">
                #{report.code}
            </td>
            <td className="px-5 py-5">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${avatarColor}`}
                    >
                        {initials(report.reporter)}
                    </span>
                    <div>
                        <p className="font-bold text-[#382A49]">
                            {report.reporter}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-[#766B8A]">
                            {report.userId}
                        </p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-5 font-medium">{report.category}</td>
            <td className="px-5 py-5 text-[#766B8A]">{report.date}</td>
            <td className="px-5 py-5">
                <StatusBadge status={report.status} />
            </td>
            <td className="px-5 py-5">
                <div className="flex justify-center">
                    <Link
                        href={`/admin/pengaduan/${report.id}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E7FF] text-[#6610F2] transition hover:bg-[#E4D4FF]"
                        aria-label={`Lihat ${report.code}`}
                    >
                        <Eye className="h-5 w-5" />
                    </Link>
                </div>
            </td>
        </tr>
    );
}
