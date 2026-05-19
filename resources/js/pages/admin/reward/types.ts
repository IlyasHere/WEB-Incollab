import type { LucideIcon } from 'lucide-react';

export type RewardCategory = 'voucher' | 'merch';
export type RewardStatus = 'Aktif' | 'Stok Habis';

export type Reward = {
    id: number;
    code: string;
    name: string;
    category: RewardCategory;
    categoryLabel: string;
    points: number;
    stock: number;
    status: RewardStatus;
    redeemedCount: number;
    description: string;
    images: string[];
};

export type RewardsPage = {
    data: Reward[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export type Summary = {
    total: number;
    aktif: number;
    stok: number;
    ditukar: number;
};

export type Filters = {
    search: string;
    category: string;
    status: string;
};

export type AdminRewardIndexProps = {
    rewards: RewardsPage;
    summary: Summary;
    filters: Filters;
    categories: RewardCategory[];
};

export type RewardImage = {
    file: File;
    previewUrl: string;
};

export type SummaryCardItem = {
    label: string;
    value: number;
    icon: LucideIcon;
    accent: string;
};
