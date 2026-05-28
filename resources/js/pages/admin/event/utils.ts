import type { EventFilters } from './types';

export function cleanFilters(filters: EventFilters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
    );
}

export function hasActiveFilter(filters: EventFilters) {
    return Object.values(filters).some((value) => value.trim() !== '');
}

export function pageHref(page: number, filters: EventFilters) {
    const params = new URLSearchParams({
        ...cleanFilters(filters),
        page: String(page),
    });

    return `/admin/event?${params.toString()}`;
}

export function formatDateRange(
    startDate: string | null,
    endDate: string | null,
) {
    if (!startDate) {
        return 'Tanggal menyusul';
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    if (!endDate || endDate === startDate) {
        return formatter.format(new Date(startDate));
    }

    return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}
