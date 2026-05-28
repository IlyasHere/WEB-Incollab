import {
    AlertTriangle,
    CircleDollarSign,
    Pencil,
    ShoppingBag,
    Ticket,
    Trash2,
} from 'lucide-react';
import type { Reward } from '../types';
import { statusClass } from '../utils';

export function RewardRow({
    reward,
    onEdit,
    onDelete,
}: {
    reward: Reward;
    onEdit: (reward: Reward) => void;
    onDelete: (reward: Reward) => void;
}) {
    const Icon = reward.category === 'merch' ? ShoppingBag : Ticket;
    const isOutOfStock = reward.stock <= 0;
    const isLowStock = reward.stock > 0 && reward.stock < 5;

    return (
        <div
            className={`grid min-w-[980px] grid-cols-[minmax(280px,1.6fr)_130px_120px_110px_130px_120px_120px] items-center px-6 py-4 transition hover:bg-[#FBF7FF] ${
                isOutOfStock ? 'text-[#8B8496]' : ''
            }`}
        >
            <div className="flex min-w-0 items-center gap-4">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F0E7FF]">
                    {reward.images[0] ? (
                        <img
                            src={reward.images[0]}
                            alt={reward.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-[#6610F2]">
                            <Icon className="h-6 w-6" />
                        </span>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-base font-extrabold text-[#1F1730]">
                        {reward.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#6F657F]">
                        {reward.code}
                    </p>
                </div>
            </div>

            <p className="text-sm font-medium text-[#5F5573]">
                {reward.categoryLabel}
            </p>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-[#8B2E0E]">
                <CircleDollarSign className="h-4 w-4" />
                {reward.points.toLocaleString('id-ID')}
            </p>
            <p
                className={`text-sm font-bold ${
                    reward.stock <= 0 || isLowStock
                        ? 'text-[#D11149]'
                        : 'text-[#382A49]'
                }`}
            >
                {reward.stock.toLocaleString('id-ID')}
                {isLowStock && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FFF0E0] px-2 py-0.5 text-[10px] font-extrabold text-[#F37933]">
                        <AlertTriangle className="h-3 w-3" />
                        Remind
                    </span>
                )}
            </p>
            <div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${statusClass(
                        reward.status,
                    )}`}
                >
                    {reward.status}
                </span>
            </div>
            <p className="text-sm font-semibold text-[#5F5573]">
                {reward.redeemedCount.toLocaleString('id-ID')}
            </p>
            <div className="flex justify-end gap-4 text-[#4F465F]">
                <button
                    type="button"
                    aria-label={`Edit ${reward.name}`}
                    onClick={() => onEdit(reward)}
                    className="transition hover:text-[#6610F2]"
                >
                    <Pencil className="h-5 w-5" />
                </button>
                <button
                    type="button"
                    aria-label={`Hapus ${reward.name}`}
                    onClick={() => onDelete(reward)}
                    className="transition hover:text-[#D11149]"
                >
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
