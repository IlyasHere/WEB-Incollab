import { Head } from '@inertiajs/react';
import PointHistoryPanel, {
    type PointHistoryItem,
} from '@/components/point-history-panel';

type RiwayatPoinProps = {
    history?: PointHistoryItem[];
};

export default function RiwayatPoin({ history = [] }: RiwayatPoinProps) {
    return (
        <>
            <Head title="Riwayat Poin" />

            <h1 className="sr-only">Riwayat Poin</h1>

            <PointHistoryPanel history={history} />
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
