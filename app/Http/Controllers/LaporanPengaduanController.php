<?php

namespace App\Http\Controllers;

use App\Models\LaporanPengaduan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LaporanPengaduanController extends Controller
{
    private const STATUSES = ['Baru', 'Diproses', 'Selesai', 'Ditolak'];

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kategori_laporan' => ['required', 'string', 'max:100'],
            'isi_laporan' => ['required', 'string', 'max:2000'],
            'images' => ['nullable', 'array', 'max:3'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $mahasiswa = $request->user()->mahasiswa()->firstOrCreate([], [
            'total_poin' => 0,
        ]);

        $laporan = LaporanPengaduan::create([
            'mhs_id' => $mahasiswa->mhs_id,
            'kategori_laporan' => $validated['kategori_laporan'],
            'isi_laporan' => $validated['isi_laporan'],
            'status_laporan' => 'Baru',
        ]);

        foreach ($request->file('images', []) as $image) {
            $path = Storage::disk('public')->putFile('laporan-pengaduan', $image);

            $laporan->attachments()->create([
                'file_path' => $path,
                'original_name' => $image->getClientOriginalName(),
                'mime_type' => $image->getClientMimeType(),
                'file_size' => $image->getSize(),
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Laporan berhasil terkirim!',
            'description' => 'Admin akan meninjau laporanmu maksimal 2x24 jam.',
        ]);

        return back();
    }

    public function adminIndex(): Response
    {
        $filters = request()->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(self::STATUSES)],
        ]);

        $search = trim($filters['search'] ?? '');

        $reports = LaporanPengaduan::query()
            ->with(['mahasiswa.user'])
            ->withCount('attachments')
            ->when($search !== '', function ($query) use ($search) {
                $normalizedId = preg_replace('/\D+/', '', $search);
                $lowerSearch = mb_strtolower($search);

                $query->where(function ($query) use ($normalizedId, $lowerSearch) {
                    if ($normalizedId !== '') {
                        $query->orWhere('laporan_id', (int) $normalizedId);
                    }

                    $query
                        ->orWhereRaw('LOWER(kategori_laporan) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(isi_laporan) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereHas('mahasiswa.user', function ($query) use ($lowerSearch) {
                            $query
                                ->whereRaw('LOWER(name) LIKE ?', ['%'.$lowerSearch.'%'])
                                ->orWhereRaw('LOWER(email) LIKE ?', ['%'.$lowerSearch.'%']);
                        });
                });
            })
            ->when(($filters['category'] ?? '') !== '', function ($query) use ($filters) {
                $query->where('kategori_laporan', $filters['category']);
            })
            ->when(($filters['status'] ?? '') !== '', function ($query) use ($filters) {
                $query->where('status_laporan', $filters['status']);
            })
            ->latest()
            ->paginate(10)
            ->through(fn (LaporanPengaduan $laporan) => $this->formatReportRow($laporan))
            ->withQueryString();

        $categories = LaporanPengaduan::query()
            ->whereNotNull('kategori_laporan')
            ->distinct()
            ->orderBy('kategori_laporan')
            ->pluck('kategori_laporan')
            ->values();

        $summary = [
            'total' => LaporanPengaduan::count(),
            'baru' => LaporanPengaduan::where('status_laporan', 'Baru')->count(),
            'diproses' => LaporanPengaduan::where('status_laporan', 'Diproses')->count(),
            'selesai' => LaporanPengaduan::where('status_laporan', 'Selesai')->count(),
        ];

        return Inertia::render('admin/pengaduan/index', [
            'reports' => $reports,
            'summary' => $summary,
            'filters' => [
                'search' => $search,
                'category' => $filters['category'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
            'categories' => $categories,
            'statuses' => self::STATUSES,
        ]);
    }

    public function adminShow(LaporanPengaduan $laporan): Response
    {
        $laporan->load(['mahasiswa.user', 'attachments', 'admin']);

        return Inertia::render('admin/pengaduan/detail', [
            'report' => $this->formatReportDetail($laporan),
            'statuses' => self::STATUSES,
        ]);
    }

    public function update(Request $request, LaporanPengaduan $laporan): RedirectResponse
    {
        $validated = $request->validate([
            'status_laporan' => ['required', Rule::in(self::STATUSES)],
            'catatan_admin' => ['nullable', 'string', 'max:2000'],
        ]);

        $currentStatus = $laporan->status_laporan ?? 'Baru';
        $allowedStatuses = $this->allowedNextStatuses($currentStatus);

        if (in_array($currentStatus, ['Selesai', 'Ditolak'], true)) {
            throw ValidationException::withMessages([
                'status_laporan' => 'Laporan yang sudah final tidak bisa diubah lagi.',
            ]);
        }

        if (! in_array($validated['status_laporan'], $allowedStatuses, true)) {
            throw ValidationException::withMessages([
                'status_laporan' => 'Status laporan tidak bisa dikembalikan atau diubah setelah final.',
            ]);
        }

        $changes = [
            'admin_id' => $request->user()->user_id,
            'status_laporan' => $validated['status_laporan'],
            'catatan_admin' => $validated['catatan_admin'] ?? null,
        ];

        if ($validated['status_laporan'] !== $currentStatus || $validated['status_laporan'] !== 'Baru') {
            $changes['ditangani_pada'] = now();
        }

        $laporan->update($changes);

        return back()->with('success', 'Laporan berhasil diperbarui.');
    }

    private function formatReportRow(LaporanPengaduan $laporan): array
    {
        $user = $laporan->mahasiswa?->user;

        return [
            'id' => $laporan->laporan_id,
            'code' => $this->reportCode($laporan),
            'reporter' => $user?->name ?? 'Mahasiswa',
            'userId' => $user ? 'USR-'.str_pad((string) $user->user_id, 4, '0', STR_PAD_LEFT) : 'USR-0000',
            'category' => $laporan->kategori_laporan ?? 'Lainnya',
            'date' => $laporan->created_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y') ?? '-',
            'status' => $laporan->status_laporan ?? 'Baru',
            'attachmentsCount' => $laporan->attachments_count,
        ];
    }

    private function formatReportDetail(LaporanPengaduan $laporan): array
    {
        $mahasiswa = $laporan->mahasiswa;
        $user = $mahasiswa?->user;
        $avatar = $this->resolveAvatar($mahasiswa?->foto, $user?->avatar);

        return [
            'id' => $laporan->laporan_id,
            'code' => $this->reportCode($laporan),
            'category' => $laporan->kategori_laporan ?? 'Lainnya',
            'description' => $laporan->isi_laporan ?? '',
            'status' => $laporan->status_laporan ?? 'Baru',
            'adminNote' => $laporan->catatan_admin ?? '',
            'createdAt' => $laporan->created_at?->timezone('Asia/Jakarta')->translatedFormat('d M Y') ?? '-',
            'createdAtDetail' => $this->formatDateTime($laporan->created_at),
            'handledAtDetail' => $this->formatDateTime($laporan->ditangani_pada),
            'reporter' => [
                'name' => $user?->name ?? 'Mahasiswa',
                'username' => $user?->email ? '@'.(string) str($user->email)->before('@') : '@mahasiswa',
                'userId' => $user ? 'USR-'.str_pad((string) $user->user_id, 4, '0', STR_PAD_LEFT) : 'USR-0000',
                'avatar' => $avatar,
            ],
            'attachments' => $laporan->attachments->map(fn ($attachment) => [
                'id' => $attachment->attachment_id,
                'type' => str_starts_with((string) $attachment->mime_type, 'image/') ? 'image' : 'file',
                'name' => $attachment->original_name,
                'url' => asset('storage/'.$attachment->file_path),
            ])->values(),
        ];
    }

    private function reportCode(LaporanPengaduan $laporan): string
    {
        return 'PG-'.str_pad((string) $laporan->laporan_id, 3, '0', STR_PAD_LEFT);
    }

    private function allowedNextStatuses(string $currentStatus): array
    {
        return match ($currentStatus) {
            'Baru' => ['Baru', 'Diproses', 'Ditolak'],
            'Diproses' => ['Diproses', 'Selesai', 'Ditolak'],
            'Selesai' => ['Selesai'],
            'Ditolak' => ['Ditolak'],
            default => ['Baru'],
        };
    }

    private function formatDateTime($date): ?string
    {
        if (! $date) {
            return null;
        }

        return $date->timezone('Asia/Jakarta')->translatedFormat('d M Y, H:i').' WIB';
    }

    private function resolveAvatar(?string $foto, ?string $avatar): ?string
    {
        if ($foto) {
            return str_starts_with($foto, 'http') ? $foto : asset('storage/'.$foto);
        }

        return $avatar;
    }
}
