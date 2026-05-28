import SettingsPageLayout from '@/layouts/SettingsPageLayout';
import PointHistoryPanel, {
    type PointHistoryItem,
} from '@/components/point-history-panel';

type PengaturanRiwayatPoinProps = {
    history?: PointHistoryItem[];
};

export default function PengaturanRiwayatPoin({
    history = [],
}: PengaturanRiwayatPoinProps) {
    return (
        <SettingsPageLayout title="Pengaturan">
            <PointHistoryPanel history={history} />
        </SettingsPageLayout>
    );
}
