<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use App\Models\PenukaranPoin;
use App\Models\Reward;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RewardController extends Controller
{
    private const CATEGORIES = ['voucher', 'merch'];

    public function index(Request $request): Response
    {
        $mahasiswa = $request->user()->mahasiswa()->firstOrCreate([], [
            'total_poin' => 0,
        ]);

        return Inertia::render('tukar-poin', [
            'rewards' => Reward::query()
                ->withCount('penukaranPoin')
                ->where('stok', '>=', 0)
                ->latest()
                ->get()
                ->map(fn (Reward $reward) => $this->formatRewardRow($reward))
                ->values(),
            'currentPoints' => (int) $mahasiswa->total_poin,
            'summary' => [
                'availableRewards' => Reward::where('stok', '>', 0)->count(),
                'redeemedRewards' => PenukaranPoin::where('mhs_id', $mahasiswa->mhs_id)->count(),
                'spentPoints' => (int) PenukaranPoin::where('mhs_id', $mahasiswa->mhs_id)->sum('jumlah_poin'),
            ],
            'pointEvents' => Event::query()
                ->where('poin_event', '>', 0)
                ->latest('tanggal_event')
                ->limit(3)
                ->get()
                ->map(fn (Event $event) => [
                    'id' => $event->event_id,
                    'title' => $event->judul_event,
                    'date' => optional($event->tanggal_event)->format('d M Y'),
                    'points' => (int) $event->poin_event,
                    'category' => $event->kategori_event ?? 'Event',
                ])
                ->values(),
        ]);
    }

    public function adminIndex(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', Rule::in(self::CATEGORIES)],
            'status' => ['nullable', Rule::in(['aktif', 'habis'])],
        ]);

        $search = trim($filters['search'] ?? '');

        $rewards = Reward::query()
            ->withCount('penukaranPoin')
            ->when($search !== '', function ($query) use ($search) {
                $lowerSearch = mb_strtolower($search);
                $normalizedId = preg_replace('/\D+/', '', $search);

                $query->where(function ($query) use ($lowerSearch, $normalizedId) {
                    if ($normalizedId !== '') {
                        $query->orWhere('reward_id', (int) $normalizedId);
                    }

                    $query
                        ->orWhereRaw('LOWER(nama_reward) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(kategori_reward) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(deskripsi) LIKE ?', ['%'.$lowerSearch.'%']);
                });
            })
            ->when(($filters['category'] ?? '') !== '', function ($query) use ($filters) {
                $query->where('kategori_reward', $filters['category']);
            })
            ->when(($filters['status'] ?? '') === 'aktif', function ($query) {
                $query->where('stok', '>', 0);
            })
            ->when(($filters['status'] ?? '') === 'habis', function ($query) {
                $query->where('stok', '<=', 0);
            })
            ->latest()
            ->paginate(10)
            ->through(fn (Reward $reward) => $this->formatRewardRow($reward))
            ->withQueryString();

        return Inertia::render('admin/reward/index', [
            'rewards' => $rewards,
            'summary' => [
                'total' => Reward::count(),
                'aktif' => Reward::where('stok', '>', 0)->count(),
                'stok' => (int) Reward::sum('stok'),
                'ditukar' => PenukaranPoin::count(),
            ],
            'filters' => [
                'search' => $search,
                'category' => $filters['category'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_reward' => ['required', 'string', 'max:100'],
            'kategori_reward' => ['required', Rule::in(self::CATEGORIES)],
            'poin_dibutuhkan' => ['required', 'integer', 'min:1', 'max:1000000'],
            'stok' => ['required', 'integer', 'min:0', 'max:1000000'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            'images' => ['nullable', 'array', 'max:2'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $imagePaths = [];

        foreach ($request->file('images', []) as $image) {
            $imagePaths[] = Storage::disk('public')->putFile('reward', $image);
        }

        Reward::create([
            'admin_id' => $request->user()->user_id,
            'nama_reward' => $validated['nama_reward'],
            'kategori_reward' => $validated['kategori_reward'],
            'poin_dibutuhkan' => $validated['poin_dibutuhkan'],
            'stok' => $validated['stok'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'gambar' => $imagePaths,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Reward berhasil ditambahkan.',
        ]);

        return redirect()->route('admin.reward');
    }

    public function update(Request $request, Reward $reward): RedirectResponse
    {
        $validated = $request->validate([
            'nama_reward' => ['required', 'string', 'max:100'],
            'kategori_reward' => ['required', Rule::in(self::CATEGORIES)],
            'poin_dibutuhkan' => ['required', 'integer', 'min:1', 'max:1000000'],
            'stok' => ['required', 'integer', 'min:0', 'max:1000000'],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
            'images' => ['nullable', 'array', 'max:2'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $changes = [
            'nama_reward' => $validated['nama_reward'],
            'kategori_reward' => $validated['kategori_reward'],
            'poin_dibutuhkan' => $validated['poin_dibutuhkan'],
            'stok' => $validated['stok'],
            'deskripsi' => $validated['deskripsi'] ?? null,
        ];

        if ($request->hasFile('images')) {
            foreach ($reward->gambar ?? [] as $path) {
                Storage::disk('public')->delete($path);
            }

            $changes['gambar'] = collect($request->file('images'))
                ->map(fn ($image) => Storage::disk('public')->putFile('reward', $image))
                ->values()
                ->all();
        }

        $reward->update($changes);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Reward berhasil diperbarui.',
        ]);

        return redirect()->route('admin.reward');
    }

    public function destroy(Reward $reward): RedirectResponse
    {
        foreach ($reward->gambar ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }

        $reward->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Reward berhasil dihapus.',
        ]);

        return redirect()->route('admin.reward');
    }

    public function redeem(Request $request, Reward $reward): RedirectResponse
    {
        $mahasiswa = $request->user()->mahasiswa()->firstOrCreate([], [
            'total_poin' => 0,
        ]);

        $result = DB::transaction(function () use ($mahasiswa, $reward) {
            $lockedReward = Reward::query()
                ->whereKey($reward->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $lockedMahasiswa = $mahasiswa->newQuery()
                ->whereKey($mahasiswa->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $points = (int) ($lockedReward->poin_dibutuhkan ?? 0);
            $stock = (int) ($lockedReward->stok ?? 0);
            $currentPoints = (int) ($lockedMahasiswa->total_poin ?? 0);

            if ($stock <= 0) {
                return [
                    'ok' => false,
                    'message' => 'Stok reward sudah habis.',
                ];
            }

            if ($currentPoints < $points) {
                return [
                    'ok' => false,
                    'message' => 'Poin kamu belum cukup untuk menukar reward ini.',
                ];
            }

            $lockedReward->decrement('stok');
            $lockedMahasiswa->decrement('total_poin', $points);

            PenukaranPoin::create([
                'mhs_id' => $lockedMahasiswa->mhs_id,
                'reward_id' => $lockedReward->reward_id,
                'tanggal_penukaran' => now()->toDateString(),
                'jumlah_poin' => $points,
                'status_penukaran' => 'Berhasil',
                'kode_penukaran' => $this->generateRedemptionCode($lockedReward),
            ]);

            Notification::create([
                'user_id' => $lockedMahasiswa->user_id,
                ...$this->rewardNotificationPayload($lockedReward),
            ]);

            return [
                'ok' => true,
                'message' => 'Reward berhasil ditukar. Riwayat penukaran sudah dicatat.',
            ];
        });

        Inertia::flash('toast', [
            'type' => $result['ok'] ? 'success' : 'error',
            'message' => $result['message'],
        ]);

        return redirect()->route('tukar-poin');
    }

    private function formatRewardRow(Reward $reward): array
    {
        $stock = (int) ($reward->stok ?? 0);

        return [
            'id' => $reward->reward_id,
            'code' => 'RWD-'.str_pad((string) $reward->reward_id, 3, '0', STR_PAD_LEFT),
            'name' => $reward->nama_reward ?? 'Reward',
            'category' => $reward->kategori_reward ?? 'voucher',
            'categoryLabel' => $this->categoryLabel($reward->kategori_reward),
            'points' => (int) ($reward->poin_dibutuhkan ?? 0),
            'stock' => $stock,
            'status' => $stock > 0 ? 'Aktif' : 'Stok Habis',
            'redeemedCount' => $reward->penukaran_poin_count,
            'description' => $reward->deskripsi ?? '',
            'images' => collect($reward->gambar ?? [])
                ->map(fn (string $path) => asset('storage/'.$path))
                ->values(),
        ];
    }

    private function categoryLabel(?string $category): string
    {
        return match ($category) {
            'merch' => 'Merch',
            default => 'Voucher',
        };
    }

    private function rewardNotificationPayload(Reward $reward): array
    {
        if ($reward->kategori_reward === 'merch') {
            return [
                'type' => 'reward',
                'title' => 'Reward berhasil ditukar',
                'body' => "Penukaran {$reward->nama_reward} berhasil. Detail status merchandise tersedia di riwayat poin.",
                'url' => route('pengaturan.riwayat-poin'),
            ];
        }

        return [
            'type' => 'reward',
            'title' => 'Reward berhasil ditukar',
            'body' => "Penukaran {$reward->nama_reward} berhasil. Kode penukaran sudah tersedia di riwayat poin.",
            'url' => route('pengaturan.riwayat-poin'),
        ];
    }

    private function generateRedemptionCode(Reward $reward): string
    {
        $prefix = strtoupper($reward->kategori_reward === 'merch' ? 'MERCH' : 'VCHR');

        do {
            $code = $prefix.'-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
        } while (PenukaranPoin::where('kode_penukaran', $code)->exists());

        return $code;
    }
}
