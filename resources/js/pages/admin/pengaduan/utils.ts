import type { Filters } from './types';

export function cleanFilters(filters: Filters) {
    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value.trim() !== ''),
    );
}

export function pageHref(page: number, filters: Filters) {
    const params = new URLSearchParams({
        ...cleanFilters(filters),
        page: String(page),
    });

    return `/admin/pengaduan?${params.toString()}`;
}

export function initials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
