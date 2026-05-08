<?php

namespace App\Http\Controllers;

use App\Models\KlaimPoin;
use App\Models\PenukaranPoin;
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
                    'date' => $this->formatDate($date),
                    'points' => $points,
                    'category' => 'Dari Event',
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
                $date = $redemption->tanggal_penukaran ?? $redemption->created_at;
                $reward = $redemption->reward;
                $points = (int) ($redemption->jumlah_poin ?? $reward?->poin_dibutuhkan ?? 0);

                return [
                    'id' => "redemption-{$redemption->penukaran_id}",
                    'type' => 'penukaran',
                    'title' => $reward?->nama_reward
                        ? "Redeem {$reward->nama_reward}"
                        : 'Redeem Reward',
                    'date' => $this->formatDate($date),
                    'points' => -abs($points),
                    'category' => 'Penukaran Reward',
                    'source' => $redemption->status_penukaran
                        ? "Status: {$redemption->status_penukaran}"
                        : null,
                    'sort_date' => $this->sortDate($date),
                ];
            });
    }

    private function formatDate(mixed $date): string
    {
        return $date ? date('Y-m-d', strtotime((string) $date)) : '';
    }

    private function sortDate(mixed $date): int
    {
        return $date ? strtotime((string) $date) ?: 0 : 0;
    }
}
