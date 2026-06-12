<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\KlaimPoin;
use App\Models\LaporanPengaduan;
use App\Models\Reward;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $today = now('Asia/Jakarta')->toDateString();

        return Inertia::render('admin/dashboard', [
            'summary' => [
                'publishedEvents' => Event::where('visibility_status', 'Published')->count(),
                'pendingPointClaims' => KlaimPoin::where('status_klaim', 'Menunggu Verifikasi')->count(),
                'newReports' => LaporanPengaduan::where('status_laporan', 'Baru')->count(),
                'newReportsToday' => LaporanPengaduan::where('status_laporan', 'Baru')
                    ->whereDate('created_at', $today)
                    ->count(),
                'activeRewards' => Reward::where('stok', '>', 0)->count(),
            ],
            'upcomingEvents' => Event::query()
                ->whereDate('tanggal_event', '>=', $today)
                ->orderBy('tanggal_event')
                ->limit(4)
                ->get()
                ->map(fn (Event $event) => [
                    'id' => $event->event_id,
                    'name' => $event->judul_event ?? 'Event',
                    'date' => $event->tanggal_event?->timezone('Asia/Jakarta')->translatedFormat('d M Y') ?? '-',
                    'status' => $this->eventStatusLabel($event->registration_status),
                    'url' => route('admin.event.edit', $event),
                ])
                ->values(),
            'latestReports' => LaporanPengaduan::query()
                ->with('mahasiswa.user')
                ->latest()
                ->limit(4)
                ->get()
                ->map(fn (LaporanPengaduan $report) => [
                    'id' => $report->laporan_id,
                    'category' => $report->kategori_laporan ?? 'Lainnya',
                    'reporter' => $report->mahasiswa?->user?->name ?? 'Mahasiswa',
                    'status' => $report->status_laporan ?? 'Baru',
                    'url' => route('admin.pengaduan.detail', $report),
                ])
                ->values(),
        ]);
    }

    private function eventStatusLabel(?string $status): string
    {
        return match ($status) {
            'Open' => 'Pendaftaran Buka',
            'Closed' => 'Pendaftaran Tutup',
            'Coming Soon' => 'Segera Hadir',
            default => $status ?: 'Draft',
        };
    }
}
