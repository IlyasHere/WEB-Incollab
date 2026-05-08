import {
    CheckCircle2,
    Gift,
    ShoppingBag,
    Trophy,
    type LucideIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type PointHistoryType = 'klaim' | 'penukaran' | 'bonus';
type PointDirectionFilter = 'semua' | 'masuk' | 'keluar';

export type PointHistoryItem = {
    id: number;
    type: PointHistoryType;
    title: string;
    date: string;
    points: number;
    category: string;
    source?: string;
};

type PointHistoryPanelProps = {
    history?: PointHistoryItem[];
    className?: string;
};

const itemsPerPage = 3;

const directionFilters: { label: string; value: PointDirectionFilter }[] = [
    { label: 'Semua', value: 'semua' },
    { label: 'Poin Masuk', value: 'masuk' },
    { label: 'Poin Keluar', value: 'keluar' },
];

const historyTypeMeta: Record<
    PointHistoryType,
    {
        icon: LucideIcon;
        iconClassName: string;
        badgeClassName: string;
    }
> = {
    klaim: {
        icon: CheckCircle2,
        iconClassName: 'bg-[#CFFBE6] text-[#009B6A]',
        badgeClassName: 'bg-[#CFE6FF] text-[#2E6C9F]',
    },
    penukaran: {
        icon: ShoppingBag,
        iconClassName: 'bg-[#FFE0E2] text-[#D11149]',
        badgeClassName: 'bg-[#E9DFF2] text-[#6F647A]',
    },
    bonus: {
        icon: Trophy,
        iconClassName: 'bg-[#D5FBE6] text-[#009B6A]',
        badgeClassName: 'bg-[#E8D8FF] text-[#6610F2]',
    },
};

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

function formatMonthLabel(date: Date) {
    return new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
    }).format(date);
}

function formatMonthValue(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getRecentMonths() {
    const today = new Date();

    return Array.from({ length: 6 }, (_, index) => {
        const date = new Date(today.getFullYear(), today.getMonth() - index, 1);

        return {
            label: index === 0 ? 'Bulan ini' : formatMonthLabel(date),
            value: formatMonthValue(date),
        };
    });
}

function formatPoints(points: number) {
    const sign = points > 0 ? '+' : points < 0 ? '-' : '';
    const absolutePoints = Math.abs(points).toLocaleString('id-ID');

    return `${sign}${absolutePoints} Poin`;
}

function isSameMonth(date: string, monthValue: string) {
    const parsedDate = new Date(date);

    return (
        !Number.isNaN(parsedDate.getTime()) &&
        formatMonthValue(parsedDate) === monthValue
    );
}

function HistoryItem({ item }: { item: PointHistoryItem }) {
    const meta = historyTypeMeta[item.type];
    const Icon = meta.icon;
    const isPositive = item.points >= 0;

    return (
        <li className="grid grid-cols-[4rem_1fr] gap-4 py-8 md:grid-cols-[4.5rem_1fr_auto] md:items-center">
            <div
                className={cn(
                    'flex size-12 items-center justify-center rounded-full md:size-14',
                    meta.iconClassName,
                )}
            >
                <Icon className="size-6" />
            </div>

            <div className="min-w-0">
                <h3 className="text-base font-bold text-[#1F1730]">
                    {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#8A7FA2]">
                    {formatDate(item.date)}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                        variant="secondary"
                        className={cn(
                            'rounded-full border-0 px-3 py-1 text-xs font-bold uppercase tracking-normal',
                            meta.badgeClassName,
                        )}
                    >
                        {item.category}
                    </Badge>
                    {item.source && (
                        <span className="text-xs font-semibold text-[#8A7FA2]">
                            {item.source}
                        </span>
                    )}
                </div>
            </div>

            <p
                className={cn(
                    'col-span-2 pl-16 text-right text-2xl font-bold tabular-nums md:col-span-1 md:pl-8 md:text-3xl',
                    isPositive ? 'text-[#009B6A]' : 'text-[#D11149]',
                )}
            >
                {formatPoints(item.points)}
            </p>
        </li>
    );
}

export default function PointHistoryPanel({
    history = [],
    className,
}: PointHistoryPanelProps) {
    const monthOptions = useMemo(getRecentMonths, []);
    const [activeDirection, setActiveDirection] =
        useState<PointDirectionFilter>('semua');
    const [activeMonth, setActiveMonth] = useState(monthOptions[0].value);
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const matchesDirection =
                activeDirection === 'semua' ||
                (activeDirection === 'masuk' && item.points > 0) ||
                (activeDirection === 'keluar' && item.points < 0);

            return matchesDirection && isSameMonth(item.date, activeMonth);
        });
    }, [activeDirection, activeMonth, history]);

    const shownHistory = filteredHistory.slice(0, visibleItems);
    const canLoadMore = visibleItems < filteredHistory.length;

    function selectDirection(filter: PointDirectionFilter) {
        setActiveDirection(filter);
        setVisibleItems(itemsPerPage);
    }

    function selectMonth(month: string) {
        setActiveMonth(month);
        setVisibleItems(itemsPerPage);
    }

    return (
        <div className={cn('space-y-6', className)}>
            <div className="flex flex-col gap-4 border-b border-[#D8CDE8] pb-6 xl:flex-row xl:items-center xl:justify-between">
                <h2 className="text-3xl font-bold text-[#1F1730] md:text-4xl">
                    Riwayat Poin
                </h2>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                    <div className="flex flex-wrap gap-2">
                        {directionFilters.map((filter) => (
                            <Button
                                key={filter.value}
                                type="button"
                                variant="ghost"
                                className={cn(
                                    'h-10 rounded-full bg-[#F3ECFF] px-6 text-sm font-bold text-[#5E5873] shadow-none hover:bg-[#E8D8FF] hover:text-[#6610F2]',
                                    activeDirection === filter.value &&
                                        'bg-[#6610F2] text-white hover:bg-[#6610F2] hover:text-white',
                                )}
                                onClick={() => selectDirection(filter.value)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </div>

                    <div className="hidden h-10 w-px bg-[#D8CDE8] sm:block" />

                    <Select value={activeMonth} onValueChange={selectMonth}>
                        <SelectTrigger className="h-10 min-w-36 rounded-xl border-[#CFC2E2] !bg-white px-4 text-sm font-bold text-[#1F1730] shadow-none hover:!bg-white focus:!bg-white data-[state=open]:!bg-white [&_svg]:size-3.5 [&_svg]:stroke-[3] [&_svg]:text-[#1F1730] [&_svg]:opacity-100">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-[#E2D7F0]">
                            {monthOptions.map((month) => (
                                <SelectItem
                                    key={month.value}
                                    value={month.value}
                                >
                                    {month.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {shownHistory.length > 0 ? (
                <ul className="divide-y divide-transparent">
                    {shownHistory.map((item) => (
                        <HistoryItem key={item.id} item={item} />
                    ))}
                </ul>
            ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-xl py-12 text-center">
                    <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#F3ECFF] text-[#6610F2]">
                        <Gift className="size-7" />
                    </div>
                    <p className="text-lg font-bold text-[#1F1730]">
                        Belum ada poin
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#8A7FA2]">
                        Riwayat poin akan muncul di sini.
                    </p>
                </div>
            )}

            {canLoadMore && (
                <div className="border-t border-[#D8CDE8] pt-6">
                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 rounded-xl border-2 border-[#6610F2] px-8 text-sm font-bold text-[#6610F2] shadow-none hover:bg-[#F3ECFF] hover:text-[#6610F2]"
                            onClick={() =>
                                setVisibleItems(
                                    (current) => current + itemsPerPage,
                                )
                            }
                        >
                            Muat Lebih Banyak
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
