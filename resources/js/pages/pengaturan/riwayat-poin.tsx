import PointHistoryPanel from '@/components/point-history-panel';
import type { PointHistoryItem } from '@/components/point-history-panel';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageLoading } from '@/hooks/use-page-loading';
import SettingsPageLayout from '@/layouts/SettingsPageLayout';

type PengaturanRiwayatPoinProps = {
    history?: PointHistoryItem[];
};

export default function PengaturanRiwayatPoin({
    history = [],
}: PengaturanRiwayatPoinProps) {
    const isLoading = usePageLoading();

    return (
        <SettingsPageLayout title="Pengaturan">
            {isLoading ? (
                <PointHistorySkeleton />
            ) : (
                <PointHistoryPanel history={history} />
            )}
        </SettingsPageLayout>
    );
}

function PointHistorySkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-[#D8CDE8] pb-6 xl:flex-row xl:items-center xl:justify-between">
                <Skeleton className="h-10 w-56" />
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-10 w-28 rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-10 w-36 rounded-xl" />
                </div>
            </div>
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="grid grid-cols-[4rem_1fr] gap-4 rounded-2xl px-2 py-8 md:grid-cols-[4.5rem_1fr_auto] md:items-center"
                >
                    <Skeleton className="size-12 rounded-full md:size-14" />
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-64 max-w-full" />
                        <Skeleton className="h-4 w-44" />
                        <Skeleton className="h-6 w-52 rounded-full" />
                    </div>
                    <Skeleton className="col-span-2 h-8 w-32 justify-self-end md:col-span-1" />
                </div>
            ))}
        </div>
    );
}
