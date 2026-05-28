import { PackageCheck, ShoppingBag, Sparkles, Trophy } from 'lucide-react';
import type { RewardCategory, Summary, SummaryCardItem } from './types';

export const categoryLabels: Record<RewardCategory, string> = {
    voucher: 'Voucher',
    merch: 'Merch',
};

export const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'habis', label: 'Stok Habis' },
];

export function getSummaryCards(summary: Summary): SummaryCardItem[] {
    return [
        {
            label: 'Total Reward',
            value: summary.total,
            icon: Trophy,
            accent: 'bg-[#F0E7FF] text-[#6610F2]',
        },
        {
            label: 'Reward Aktif',
            value: summary.aktif,
            icon: Sparkles,
            accent: 'bg-[#EAF6FF] text-[#1A8FE3]',
        },
        {
            label: 'Stok Tersedia',
            value: summary.stok,
            icon: PackageCheck,
            accent: 'bg-[#FFF4D6] text-[#A77800]',
        },
        {
            label: 'Reward Ditukar',
            value: summary.ditukar,
            icon: ShoppingBag,
            accent: 'bg-[#FFE3EA] text-[#D11149]',
        },
    ];
}
