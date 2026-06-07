import {
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    ClipboardCheck,
    Copy,
    Gift,
    Info,
    PackageCheck,
    ShoppingBag,
    Trophy,
    Truck,
    X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PointHistoryType = 'klaim' | 'penukaran' | 'bonus';
type PointDirectionFilter = 'semua' | 'masuk' | 'keluar';

export type PointHistoryItem = {
    id: number | string;
    type: PointHistoryType;
    title: string;
    date: string;
    points: number;
    category: string;
    rewardCategory?: 'voucher' | 'merch' | string;
    source?: string;
    status?: string | null;
    redemptionCode?: string | null;
    redemptionExpiresAt?: string | null;
    redemptionLocation?: string | null;
    redemptionGuide?: string | null;
    redemptionInstructions?: string | null;
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

const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
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
        timeZone: 'Asia/Jakarta',
    }).format(parsedDate);
}

function formatTime(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return '';
    }

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(parsedDate);
}

function formatMonthValue(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getYearOptions() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const firstYear = currentYear - 5;

    return Array.from(
        { length: currentYear - firstYear + 1 },
        (_, index) => firstYear + index,
    );
}

function getCurrentMonthValue() {
    return formatMonthValue(new Date());
}

function getYearFromMonthValue(monthValue: string) {
    return Number(monthValue.split('-')[0]);
}

function getMonthIndexFromMonthValue(monthValue: string) {
    return Number(monthValue.split('-')[1]) - 1;
}

function getMonthYearLabel(monthValue: string) {
    const year = getYearFromMonthValue(monthValue);
    const monthIndex = getMonthIndexFromMonthValue(monthValue);

    if (!Number.isFinite(year) || !monthNames[monthIndex]) {
        return monthValue;
    }

    const currentMonthValue = getCurrentMonthValue();
    const label = `${monthNames[monthIndex]} ${year}`;

    return monthValue === currentMonthValue ? `Bulan ini (${label})` : label;
}

function getMonthValueFromDate(date: string) {
    if (/^\d{4}-\d{2}/.test(date)) {
        return date.slice(0, 7);
    }

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
        ? null
        : formatMonthValue(parsedDate);
}

function isSelectableMonth(monthValue: string) {
    const yearOptions = getYearOptions();
    const year = getYearFromMonthValue(monthValue);

    return (
        year >= yearOptions[0]! && year <= yearOptions[yearOptions.length - 1]!
    );
}

function hasHistoryInMonth(history: PointHistoryItem[], monthValue: string) {
    return history.some(
        (item) => getMonthValueFromDate(item.date) === monthValue,
    );
}

function getDefaultMonthValue(history: PointHistoryItem[]) {
    const currentMonthValue = getCurrentMonthValue();

    if (hasHistoryInMonth(history, currentMonthValue)) {
        return currentMonthValue;
    }

    const latestHistoryMonth = history
        .map((item) => getMonthValueFromDate(item.date))
        .find((monthValue) => monthValue && isSelectableMonth(monthValue));

    return latestHistoryMonth ?? currentMonthValue;
}

function formatPoints(points: number) {
    const sign = points > 0 ? '+' : points < 0 ? '-' : '';
    const absolutePoints = Math.abs(points).toLocaleString('id-ID');

    return `${sign}${absolutePoints} Poin`;
}

function isSameMonth(date: string, monthValue: string) {
    return getMonthValueFromDate(date) === monthValue;
}

function HistoryItem({
    item,
    onOpenRedemption,
}: {
    item: PointHistoryItem;
    onOpenRedemption: (item: PointHistoryItem) => void;
}) {
    const meta = historyTypeMeta[item.type];
    const Icon = meta.icon;
    const isPositive = item.points >= 0;
    const time = formatTime(item.date);
    const isMerchRedemption = item.rewardCategory === 'merch';
    const hasRedemptionInfo =
        item.type === 'penukaran' && (isMerchRedemption || item.redemptionCode);

    return (
        <li className="group relative grid grid-cols-[4rem_1fr] gap-4 rounded-2xl px-2 py-8 transition hover:bg-[#FBF7FF] md:grid-cols-[4.5rem_1fr_auto] md:items-center">
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
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#8A7FA2]">
                    <Clock3 className="size-4" />
                    <span>
                        {formatDate(item.date)}
                        {time && `, ${time} WIB`}
                    </span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge
                        variant="secondary"
                        className={cn(
                            'rounded-full border-0 px-3 py-1 text-xs font-bold tracking-normal uppercase',
                            meta.badgeClassName,
                        )}
                    >
                        {item.category}
                    </Badge>
                    <StatusBadge status={item.status} />
                    {item.source && !item.status && (
                        <span className="text-xs font-semibold text-[#8A7FA2]">
                            {item.source}
                        </span>
                    )}
                    {hasRedemptionInfo && (
                        <button
                            type="button"
                            onClick={() => onOpenRedemption(item)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#FFF6D8] px-3 py-1 text-xs font-bold text-[#746000] transition hover:bg-[#FFECA8] hover:text-[#5F4E00]"
                        >
                            <Info className="size-3.5" />
                            {isMerchRedemption ? 'Lihat status' : 'Lihat kode'}
                        </button>
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

function StatusBadge({ status }: { status?: string | null }) {
    if (!status) {
        return null;
    }

    const normalizedStatus = status.toLowerCase();
    const className =
        normalizedStatus === 'berhasil' ||
        normalizedStatus === 'selesai' ||
        normalizedStatus === 'disetujui'
            ? 'bg-[#DCFCE7] text-[#15803D]'
            : normalizedStatus === 'ditolak' || normalizedStatus === 'gagal'
              ? 'bg-[#FFE3EA] text-[#D11149]'
              : 'bg-[#FFF0E0] text-[#A77800]';

    return (
        <span
            className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-extrabold uppercase',
                className,
            )}
        >
            {status}
        </span>
    );
}

function MonthYearPicker({
    value,
    onChange,
}: {
    value: string;
    onChange: (month: string) => void;
}) {
    const yearOptions = useMemo(() => getYearOptions(), []);
    const minYear = yearOptions[0]!;
    const maxYear = yearOptions[yearOptions.length - 1]!;
    const [isOpen, setIsOpen] = useState(false);
    const [viewYear, setViewYear] = useState(() =>
        Math.min(maxYear, Math.max(minYear, getYearFromMonthValue(value))),
    );
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function closePicker(event: MouseEvent) {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', closePicker);

        return () => document.removeEventListener('mousedown', closePicker);
    }, []);

    function changeYear(direction: -1 | 1) {
        setViewYear((current) =>
            Math.min(maxYear, Math.max(minYear, current + direction)),
        );
    }

    function selectMonth(monthIndex: number) {
        onChange(`${viewYear}-${String(monthIndex + 1).padStart(2, '0')}`);
        setIsOpen(false);
    }

    function togglePicker() {
        setViewYear(
            Math.min(maxYear, Math.max(minYear, getYearFromMonthValue(value))),
        );
        setIsOpen((current) => !current);
    }

    return (
        <div ref={pickerRef} className="relative min-w-56">
            <label htmlFor="point-month-picker" className="sr-only">
                Pilih bulan dan tahun riwayat poin
            </label>
            <div className="relative">
                <CalendarDays className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#6610F2]" />
                <input
                    id="point-month-picker"
                    type="text"
                    readOnly
                    value={getMonthYearLabel(value)}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    className="h-10 w-full cursor-pointer rounded-xl border border-[#CFC2E2] bg-white py-2 pr-10 pl-11 text-sm font-bold text-[#1F1730] shadow-none transition outline-none hover:border-[#BBA6D7] focus:border-[#6610F2] focus:ring-2 focus:ring-[#E8D8FF]"
                    onClick={togglePicker}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            togglePicker();
                        }
                    }}
                />
                <ChevronDown
                    className={cn(
                        'pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#1F1730] transition-transform',
                        isOpen && 'rotate-180',
                    )}
                    strokeWidth={3}
                />
            </div>

            {isOpen && (
                <div
                    role="dialog"
                    aria-label="Pilih bulan dan tahun"
                    className="absolute right-0 z-50 mt-3 w-80 rounded-xl border border-[#E2D7F0] bg-white p-4 shadow-[0_18px_40px_rgba(31,23,48,0.16)]"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-full text-[#1F1730] hover:bg-[#F3ECFF] hover:text-[#6610F2] disabled:opacity-35"
                            disabled={viewYear <= minYear}
                            onClick={() => changeYear(-1)}
                            aria-label="Tahun sebelumnya"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>

                        <div className="text-lg font-extrabold text-[#1F1730] tabular-nums">
                            {viewYear}
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-full text-[#1F1730] hover:bg-[#F3ECFF] hover:text-[#6610F2] disabled:opacity-35"
                            disabled={viewYear >= maxYear}
                            onClick={() => changeYear(1)}
                            aria-label="Tahun berikutnya"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {monthNames.map((month, index) => {
                            const monthValue = `${viewYear}-${String(index + 1).padStart(2, '0')}`;
                            const isSelected = monthValue === value;

                            return (
                                <button
                                    key={month}
                                    type="button"
                                    className={cn(
                                        'flex h-14 items-center justify-center rounded-lg border border-transparent text-sm font-bold text-[#1F1730] transition hover:border-[#D8CDE8] hover:bg-[#F3ECFF] hover:text-[#6610F2]',
                                        isSelected &&
                                            'border-[#B996FF] bg-[#EFE3FF] text-[#6610F2] shadow-[inset_0_0_0_1px_rgba(102,16,242,0.16)]',
                                    )}
                                    onClick={() => selectMonth(index)}
                                >
                                    {month.slice(0, 3)}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PointHistoryPanel({
    history = [],
    className,
}: PointHistoryPanelProps) {
    const [activeDirection, setActiveDirection] =
        useState<PointDirectionFilter>('semua');
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const defaultMonth = useMemo(
        () => getDefaultMonthValue(history),
        [history],
    );
    const activeMonth = selectedMonth ?? defaultMonth;
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);
    const [selectedRedemption, setSelectedRedemption] =
        useState<PointHistoryItem | null>(null);

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
        setSelectedMonth(month);
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

                    <MonthYearPicker
                        value={activeMonth}
                        onChange={selectMonth}
                    />
                </div>
            </div>

            {shownHistory.length > 0 ? (
                <ul className="divide-y divide-transparent">
                    {shownHistory.map((item) => (
                        <HistoryItem
                            key={item.id}
                            item={item}
                            onOpenRedemption={setSelectedRedemption}
                        />
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

            {selectedRedemption && (
                <RedemptionCodeModal
                    item={selectedRedemption}
                    onClose={() => setSelectedRedemption(null)}
                />
            )}
        </div>
    );
}

function RedemptionCodeModal({
    item,
    onClose,
}: {
    item: PointHistoryItem;
    onClose: () => void;
}) {
    const time = formatTime(item.date);
    const isMerchRedemption = item.rewardCategory === 'merch';
    const expiryDate = item.redemptionExpiresAt
        ? formatDate(item.redemptionExpiresAt)
        : null;
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>(
        'idle',
    );

    const copyCode = async () => {
        const code = item.redemptionCode ?? '';

        if (!code) {
            return;
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(code);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = code;
                textArea.setAttribute('readonly', '');
                textArea.style.position = 'fixed';
                textArea.style.top = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            setCopyState('copied');
            window.setTimeout(() => setCopyState('idle'), 2200);
        } catch {
            setCopyState('failed');
            window.setTimeout(() => setCopyState('idle'), 2200);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/45 px-4 py-8 backdrop-blur-sm">
            <section className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                <div className="flex items-center justify-between border-b border-[#EFE4F8] px-5 py-4">
                    <div>
                        <p className="text-xs font-extrabold tracking-wide text-[#8A7FA2] uppercase">
                            Bukti Penukaran
                        </p>
                        <h2 className="mt-1 text-xl font-extrabold text-[#1F1730]">
                            {item.title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-full text-[#766B8A] transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                        aria-label="Tutup kode penukaran"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    {!isMerchRedemption && (
                        <div className="rounded-2xl border border-[#EFE4F8] bg-[#FBF7FF] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold text-[#8A7FA2]">
                                        Kode Kupon
                                    </p>
                                    {expiryDate && (
                                        <p className="mt-1 text-xs font-extrabold text-[#D11149]">
                                            Expired {expiryDate}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={copyCode}
                                    className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-extrabold transition ${
                                        copyState === 'copied'
                                            ? 'bg-[#DCFCE7] text-[#15803D]'
                                            : 'bg-[#FFF6D8] text-[#A77800] hover:bg-[#FFECA8] hover:text-[#746000]'
                                    }`}
                                    aria-label="Salin kode penukaran"
                                >
                                    <Copy className="size-4" />
                                    {copyState === 'copied'
                                        ? 'Tersalin'
                                        : 'Salin'}
                                </button>
                            </div>
                            <div className="mt-3 rounded-xl bg-white px-4 py-4">
                                <p className="font-mono text-2xl font-extrabold tracking-wide break-all text-[#6610F2]">
                                    {item.redemptionCode}
                                </p>
                            </div>
                            {copyState !== 'idle' && (
                                <div
                                    className={`mt-3 rounded-xl px-3 py-2 text-sm font-bold ${
                                        copyState === 'copied'
                                            ? 'bg-[#DCFCE7] text-[#15803D]'
                                            : 'bg-[#FFE3EA] text-[#D11149]'
                                    }`}
                                >
                                    {copyState === 'copied'
                                        ? 'Kode berhasil disalin.'
                                        : 'Gagal menyalin kode. Silakan salin manual.'}
                                </div>
                            )}
                        </div>
                    )}

                    {isMerchRedemption && <MerchRedemptionTimeline />}

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-[#EFE4F8] p-3">
                            <p className="text-xs font-bold text-[#8A7FA2]">
                                Waktu Penukaran
                            </p>
                            <p className="mt-2 text-sm font-extrabold text-[#1F1730]">
                                {formatDate(item.date)}
                                {time && `, ${time} WIB`}
                            </p>
                        </div>
                        <div className="rounded-xl border border-[#EFE4F8] p-3">
                            <p className="text-xs font-bold text-[#8A7FA2]">
                                Status
                            </p>
                            <div className="mt-2">
                                <StatusBadge status={item.status} />
                            </div>
                        </div>
                        <div className="rounded-xl border border-[#EFE4F8] p-3">
                            <p className="text-xs font-bold text-[#8A7FA2]">
                                Expired Kupon
                            </p>
                            <p className="mt-2 text-sm font-extrabold text-[#1F1730]">
                                {expiryDate ?? '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function MerchRedemptionTimeline() {
    const steps = [
        {
            label: 'Penukaran diterima',
            description: 'Poin sudah dipotong dan data reward tercatat.',
            icon: ClipboardCheck,
            active: true,
        },
        {
            label: 'Sedang disiapkan',
            description: 'Tim menyiapkan merchandise untuk dikirim/diambil.',
            icon: PackageCheck,
            active: true,
        },
        {
            label: 'Estimasi 2-4 hari kerja',
            description:
                'Timeline ini masih berupa gambaran karena fitur pengiriman belum aktif.',
            icon: Truck,
            active: false,
        },
    ];

    return (
        <div className="rounded-2xl border border-[#D7EAFE] bg-[#F5FBFF] p-4">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-[#1A8FE3]">
                <Clock3 className="size-3.5" />
                Timeline merchandise
            </div>
            <div className="space-y-3">
                {steps.map((step, index) => {
                    const StepIcon = step.icon;

                    return (
                        <div key={step.label} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <span
                                    className={cn(
                                        'flex size-8 items-center justify-center rounded-full',
                                        step.active
                                            ? 'bg-[#1A8FE3] text-white'
                                            : 'bg-white text-[#8A7FA2]',
                                    )}
                                >
                                    <StepIcon className="size-4" />
                                </span>
                                {index < steps.length - 1 && (
                                    <span className="mt-1 h-7 w-px bg-[#C8DFF7]" />
                                )}
                            </div>
                            <div className="min-w-0 pb-1">
                                <p className="text-sm font-extrabold text-[#1F1730]">
                                    {step.label}
                                </p>
                                <p className="mt-0.5 text-xs leading-5 text-[#5F5573]">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
