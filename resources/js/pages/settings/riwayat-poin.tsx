import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    Coins,
    Star,
    Trash2,
    type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PointHistoryType = 'klaim' | 'penukaran' | 'bonus';
type PointHistoryFilter = 'semua' | 'masuk' | 'keluar' | 'bulan-ini';

type PointHistoryItem = {
    id: number;
    type: PointHistoryType;
    title: string;
    date: string;
    points: number;
    category: string;
};

type RiwayatPoinProps = {
    history?: PointHistoryItem[];
    total_points?: number;
};

const filters: {
    label: string;
    value: PointHistoryFilter;
    activeClassName?: string;
}[] = [
    { label: 'Semua', value: 'semua' },
    {
        label: 'Poin Masuk',
        value: 'masuk',
        activeClassName: 'bg-green-600 text-white hover:bg-green-600',
    },
    {
        label: 'Poin Keluar',
        value: 'keluar',
        activeClassName: 'bg-red-600 text-white hover:bg-red-600',
    },
    { label: 'Bulan ini', value: 'bulan-ini' },
];

const historyTypeMeta: Record<
    PointHistoryType,
    {
        icon: LucideIcon;
        className: string;
    }
> = {
    klaim: {
        icon: CheckCircle2,
        className: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    },
    penukaran: {
        icon: Trash2,
        className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    },
    bonus: {
        icon: Star,
        className:
            'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
};

const itemsPerPage = 6;

function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(parsedDate);
}

function formatPoints(points: number) {
    const sign = points > 0 ? '+' : '';

    return `${sign}${points.toLocaleString('id-ID')} poin`;
}

function isThisMonth(date: string) {
    const parsedDate = new Date(date);
    const today = new Date();

    return (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.getMonth() === today.getMonth() &&
        parsedDate.getFullYear() === today.getFullYear()
    );
}

function HistoryItem({ item }: { item: PointHistoryItem }) {
    const meta = historyTypeMeta[item.type];
    const Icon = meta.icon;
    const isPositive = item.points >= 0;

    return (
        <li className="flex gap-4 border-b py-4 last:border-b-0">
            <div
                className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
                    meta.className,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                            {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(item.date)}
                        </p>
                    </div>

                    <p
                        className={cn(
                            'shrink-0 text-sm font-semibold tabular-nums',
                            isPositive ? 'text-green-600' : 'text-red-600',
                        )}
                    >
                        {formatPoints(item.points)}
                    </p>
                </div>

                <Badge variant="secondary" className="uppercase">
                    {item.category}
                </Badge>
            </div>
        </li>
    );
}

export default function RiwayatPoin({
    history = [],
    total_points = 0,
}: RiwayatPoinProps) {
    const [activeFilter, setActiveFilter] =
        useState<PointHistoryFilter>('semua');
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            if (activeFilter === 'masuk') {
                return item.points > 0;
            }

            if (activeFilter === 'keluar') {
                return item.points < 0;
            }

            if (activeFilter === 'bulan-ini') {
                return isThisMonth(item.date);
            }

            return true;
        });
    }, [activeFilter, history]);

    const shownHistory = filteredHistory.slice(0, visibleItems);
    const canLoadMore = visibleItems < filteredHistory.length;

    function selectFilter(filter: PointHistoryFilter) {
        setActiveFilter(filter);
        setVisibleItems(itemsPerPage);
    }

    return (
        <>
            <Head title="Riwayat Poin" />

            <h1 className="sr-only">Riwayat Poin</h1>

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        variant="small"
                        title="Riwayat Poin"
                        description="Lihat aktivitas poin masuk, penukaran, dan bonus akun Anda."
                    />

                    <div className="flex w-fit items-center gap-3 rounded-md border px-3 py-2">
                        <Coins className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Total poin
                            </p>
                            <p className="text-sm font-semibold tabular-nums">
                                {total_points.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {filters.map((filter) => (
                        <Button
                            key={filter.value}
                            type="button"
                            variant={
                                activeFilter === filter.value
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            className={cn(
                                activeFilter === filter.value &&
                                    filter.activeClassName,
                            )}
                            onClick={() => selectFilter(filter.value)}
                        >
                            {filter.label}
                        </Button>
                    ))}
                </div>

                <div className="rounded-md border bg-background">
                    {shownHistory.length > 0 ? (
                        <ul className="px-4">
                            {shownHistory.map((item) => (
                                <HistoryItem key={item.id} item={item} />
                            ))}
                        </ul>
                    ) : (
                        <div className="px-4 py-12 text-center">
                            <p className="text-sm font-medium text-foreground">
                                Belum ada riwayat poin
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Transaksi poin akan muncul di sini.
                            </p>
                        </div>
                    )}
                </div>

                {canLoadMore && (
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                setVisibleItems(
                                    (current) => current + itemsPerPage,
                                )
                            }
                        >
                            Muat Lebih Banyak
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

RiwayatPoin.layout = {
    breadcrumbs: [
        {
            title: 'Riwayat Poin',
            href: '/settings/riwayat-poin',
        },
    ],
};
