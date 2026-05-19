import type { Filters, RewardStatus } from './types';

export function statusClass(status: RewardStatus) {
    return status === 'Aktif'
        ? 'bg-[#DDEEFF] text-[#1A8FE3]'
        : 'bg-[#FFE2E2] text-[#D11149]';
}

export function cleanFilters(filters: Filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
    );
}

export function hasActiveFilter(filters: Filters) {
    return Object.values(filters).some((value) => value.trim() !== '');
}

export function pageHref(page: number, filters: Filters) {
    const params = new URLSearchParams({
        ...cleanFilters(filters),
        page: String(page),
    });

    return `/admin/reward?${params.toString()}`;
}
