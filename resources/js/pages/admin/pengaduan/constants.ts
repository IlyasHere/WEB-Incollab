import { CheckCircle2, ClipboardList, Inbox, Timer } from 'lucide-react';
import type { Summary } from './types';

export const avatarColors = [
    'bg-[#DFF0FF] text-[#1A8FE3]',
    'bg-[#FFF2E8] text-[#F37933]',
    'bg-[#FFE3EA] text-[#D11149]',
    'bg-[#F0E7FF] text-[#6610F2]',
    'bg-[#DCFCE7] text-[#15803D]',
];

export function getSummaryCards(summary: Summary) {
    return [
        {
            label: 'Total Laporan',
            value: summary.total,
            icon: ClipboardList,
            accent: 'bg-[#F0E7FF] text-[#6610F2]',
        },
        {
            label: 'Laporan Baru',
            value: summary.baru,
            icon: Inbox,
            accent: 'bg-[#EAF6FF] text-[#1A8FE3]',
        },
        {
            label: 'Sedang Diproses',
            value: summary.diproses,
            icon: Timer,
            accent: 'bg-[#FFF0E0] text-[#F37933]',
        },
        {
            label: 'Selesai',
            value: summary.selesai,
            icon: CheckCircle2,
            accent: 'bg-[#F0E7FF] text-[#6610F2]',
        },
    ];
}
