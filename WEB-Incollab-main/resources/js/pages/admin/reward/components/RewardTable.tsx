import type { Filters, Reward, RewardsPage } from '../types';
import { hasActiveFilter } from '../utils';
import { EmptyRewardState } from './EmptyRewardState';
import { Pagination } from './Pagination';
import { RewardRow } from './RewardRow';

export function RewardTable({
    rewards,
    filters,
    isFiltering,
    onEdit,
    onDelete,
}: {
    rewards: RewardsPage;
    filters: Filters;
    isFiltering: boolean;
    onEdit: (reward: Reward) => void;
    onDelete: (reward: Reward) => void;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(56,42,73,0.06)]">
            {isFiltering && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
                    <div className="rounded-2xl border border-[#EFE4F8] bg-white px-5 py-4 text-sm font-bold text-[#382A49] shadow-[0_18px_45px_rgba(102,16,242,0.14)]">
                        Menyaring reward...
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <div className="grid min-w-[980px] grid-cols-[minmax(280px,1.6fr)_130px_120px_110px_130px_120px_120px] bg-[#F0E7FF] px-6 py-4 text-xs font-extrabold tracking-wide text-[#4F465F] uppercase">
                    <span>Reward</span>
                    <span>Kategori</span>
                    <span>Poin</span>
                    <span>Stok</span>
                    <span>Status</span>
                    <span>Ditukar</span>
                    <span className="text-right">Action</span>
                </div>

                <div className="divide-y divide-[#EFE4F8]">
                    {rewards.data.length > 0 ? (
                        rewards.data.map((reward) => (
                            <RewardRow
                                key={reward.id}
                                reward={reward}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <EmptyRewardState
                            hasFilter={hasActiveFilter(filters)}
                        />
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#EFE4F8] px-5 py-4 text-sm text-[#766B8A] sm:flex-row sm:items-center sm:justify-between">
                <p>
                    Menampilkan {rewards.from ?? 0}-{rewards.to ?? 0} dari{' '}
                    {rewards.total} reward
                </p>
                <Pagination
                    currentPage={rewards.current_page}
                    lastPage={rewards.last_page}
                    filters={filters}
                />
            </div>
        </section>
    );
}
