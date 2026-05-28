import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Filters } from '../types';
import { pageHref } from '../utils';

export function Pagination({
    currentPage,
    lastPage,
    filters,
}: {
    currentPage: number;
    lastPage: number;
    filters: Filters;
}) {
    const pages = Array.from({ length: Math.min(lastPage, 3) }, (_, index) =>
        String(index + 1),
    );

    if (lastPage > 4) {
        pages.push('...', String(lastPage));
    } else if (lastPage === 4) {
        pages.push('4');
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href={pageHref(Math.max(currentPage - 1, 1), filters)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766B8A] transition hover:bg-[#F7F1FF]"
                aria-label="Halaman sebelumnya"
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>
            {pages.map((page) =>
                page === '...' ? (
                    <span
                        key="ellipsis"
                        className="flex h-9 min-w-9 items-center justify-center px-2 text-sm font-bold text-[#382A49]"
                    >
                        ...
                    </span>
                ) : (
                    <Link
                        key={page}
                        href={pageHref(Number(page), filters)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-bold transition ${
                            Number(page) === currentPage
                                ? 'bg-[#6610F2] text-white shadow-[0_10px_18px_rgba(102,16,242,0.22)]'
                                : 'text-[#382A49] hover:bg-[#F7F1FF]'
                        }`}
                    >
                        {page}
                    </Link>
                ),
            )}
            <Link
                href={pageHref(
                    Math.min(currentPage + 1, lastPage || 1),
                    filters,
                )}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#766B8A] transition hover:bg-[#F7F1FF]"
                aria-label="Halaman berikutnya"
            >
                <ChevronRight className="h-4 w-4" />
            </Link>
        </div>
    );
}
