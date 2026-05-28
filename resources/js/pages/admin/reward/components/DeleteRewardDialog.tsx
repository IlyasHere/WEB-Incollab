import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Reward } from '../types';

export function DeleteRewardDialog({
    reward,
    onClose,
}: {
    reward: Reward;
    onClose: () => void;
}) {
    const [processing, setProcessing] = useState(false);

    const destroyReward = () => {
        if (processing) {
            return;
        }

        setProcessing(true);
        router.delete(`/admin/reward/${reward.id}`, {
            preserveScroll: true,
            onSuccess: onClose,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1730]/40 px-4 py-8 backdrop-blur-sm">
            <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_30px_90px_rgba(31,23,48,0.24)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE3EA] text-[#D11149]">
                    <Trash2 className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-extrabold text-[#1F1730]">
                    Hapus Reward?
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                    Apakah kamu yakin mau menghapus reward{' '}
                    <span className="font-bold text-[#382A49]">
                        {reward.name}
                    </span>
                    ? Data reward dan gambar yang terkait akan dihapus.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="h-10 rounded-full border border-[#D8CDE8] px-5 text-sm font-bold text-[#382A49] transition hover:bg-[#F7F1FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={destroyReward}
                        disabled={processing}
                        className="h-10 rounded-full bg-[#D11149] px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(209,17,73,0.22)] transition hover:bg-[#B80F40] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Menghapus...' : 'Ya, Hapus'}
                    </button>
                </div>
            </section>
        </div>
    );
}
