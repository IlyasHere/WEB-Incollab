<?php

namespace App\Http\Controllers;

use App\Models\KlaimPoin;
use App\Models\PenukaranPoin;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class PointHistoryController extends Controller
{
    public function pengaturan(Request $request): Response
    {
        return Inertia::render('pengaturan/riwayat-poin', [
            'history' => $this->historyFor($request),
        ]);
    }

    public function settings(Request $request): Response
    {
        return Inertia::render('settings/riwayat-poin', [
            'history' => $this->historyFor($request),
        ]);
    }

    private function historyFor(Request $request): array
    {
        $mahasiswa = $request->user()->mahasiswa;

        if (! $mahasiswa) {
            return [];
        }

        return $this->claimHistory($mahasiswa->mhs_id)
            ->concat($this->redemptionHistory($mahasiswa->mhs_id))
            ->sortByDesc('sort_date')
            ->values()
            ->map(fn (array $item) => collect($item)->except('sort_date')->all())
            ->all();
    }

    private function claimHistory(int $mahasiswaId): Collection
    {
        return KlaimPoin::query()
            ->with('event')
            ->where('mhs_id', $mahasiswaId)
            ->get()
            ->map(function (KlaimPoin $claim): array {
                $date = $claim->tanggal_klaim ?? $claim->created_at;
                $event = $claim->event;
                $points = (int) ($event?->poin_event ?? 0);

                return [
                    'id' => "claim-{$claim->klaim_id}",
                    'type' => 'klaim',
                    'title' => $event?->judul_event
                        ? "Klaim Poin {$event->judul_event}"
                        : 'Klaim Poin Event',
                    'date' => $this->formatDateTime($date),
                    'points' => $points,
                    'category' => 'Dari Event',
                    'status' => $claim->status_klaim,
                    'source' => $claim->status_klaim
                        ? "Status: {$claim->status_klaim}"
                        : null,
                    'sort_date' => $this->sortDate($date),
                ];
            });
    }

    private function redemptionHistory(int $mahasiswaId): Collection
    {
        return PenukaranPoin::query()
            ->with('reward')
            ->where('mhs_id', $mahasiswaId)
            ->get()
            ->map(function (PenukaranPoin $redemption): array {
                $date = $redemption->created_at ?? $redemption->tanggal_penukaran;
                $reward = $redemption->reward;
                $points = (int) ($redemption->jumlah_poin ?? $reward?->poin_dibutuhkan ?? 0);
                $status = $redemption->status_penukaran ?? 'Berhasil';

                return [
                    'id' => "redemption-{$redemption->penukaran_id}",
                    'type' => 'penukaran',
                    'title' => $reward?->nama_reward
                        ? "Redeem {$reward->nama_reward}"
                        : 'Redeem Reward',
                    'date' => $this->formatDateTime($date),
                    'points' => -abs($points),
                    'category' => 'Penukaran Reward',
                    'rewardCategory' => $reward?->kategori_reward ?? 'voucher',
                    'status' => $status,
                    'redemptionCode' => $redemption->kode_penukaran,
                    'redemptionExpiresAt' => $this->formatDateTime(
                        $redemption->expires_at
                            ?: $this->fallbackExpiryDate($date, $reward?->berlaku_hari),
                    ),
                    'redemptionLocation' => $reward?->lokasi_penukaran
                        ?: $this->defaultRedemptionLocation($reward?->kategori_reward),
                    'redemptionGuide' => $this->redemptionGuide($reward?->kategori_reward),
                    'redemptionInstructions' => $reward?->instruksi_penukaran
                        ?: $this->redemptionGuide($reward?->kategori_reward),
                    'sort_date' => $this->sortDate($date),
                ];
            });
    }

    private function formatDateTime(mixed $date): string
    {
        if (! $date) {
            return '';
        }

        $datetime = $date instanceof CarbonInterface
            ? $date->copy()
            : Carbon::parse((string) $date, config('app.timezone'));

        return $datetime->timezone('Asia/Jakarta')->toIso8601String();
    }

    private function redemptionGuide(?string $category): string
    {
        return match ($category) {
            'merch' => 'Tunjukkan kode ini ke admin/panitia untuk verifikasi pengambilan merchandise.',
            default => 'Gunakan kode ini sebelum tanggal expired. Jangan bagikan kode ke orang lain.',
        };
    }

    private function defaultRedemptionLocation(?string $category): string
    {
        return match ($category) {
            'merch' => 'Ambil di booth/admin InCollab saat jam operasional.',
            default => 'Gunakan di merchant atau kanal penukaran yang tertera pada voucher.',
        };
    }

    private function fallbackExpiryDate(mixed $date, ?int $validityDays): ?CarbonInterface
    {
        if (! $date) {
            return null;
        }

        $datetime = $date instanceof CarbonInterface
            ? $date->copy()
            : Carbon::parse((string) $date, config('app.timezone'));

        return $datetime->addDays($validityDays ?: 30);
    }

    private function sortDate(mixed $date): int
    {
        return $date ? strtotime((string) $date) ?: 0 : 0;
    }
}
