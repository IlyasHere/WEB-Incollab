<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\KlaimPoin;
use App\Models\Mahasiswa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EventPointClaimController extends Controller
{
    private const STATUS_PENDING = 'Menunggu Verifikasi';

    private const STATUS_ACCEPTED = 'Diterima';

    private const STATUS_REJECTED = 'Ditolak';

    private const BLOCKING_STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_ACCEPTED,
    ];

    public function create(Request $request, Event $event): Response
    {
        $mahasiswa = $this->mahasiswaFor($request);

        $existingClaim = KlaimPoin::query()
            ->where('mhs_id', $mahasiswa->mhs_id)
            ->where('event_id', $event->event_id)
            ->whereIn('status_klaim', self::BLOCKING_STATUSES)
            ->first();

        return Inertia::render('event-point-claim/create', [
            'event' => $this->formatEvent($event),
            'mahasiswa' => [
                'name' => $request->user()->name,
                'nim' => $mahasiswa->nim,
            ],
            'existingClaim' => $existingClaim
                ? $this->formatClaim($existingClaim->load('event', 'mahasiswa.user'))
                : null,
            'eventOptions' => $this->eventOptions(),
        ]);
    }

    public function createGeneral(Request $request): Response
    {
        $mahasiswa = $this->mahasiswaFor($request);

        return Inertia::render('event-point-claim/create', [
            'event' => null,
            'mahasiswa' => [
                'name' => $request->user()->name,
                'nim' => $mahasiswa->nim,
            ],
            'existingClaim' => null,
            'eventOptions' => $this->eventOptions(),
        ]);
    }

    public function store(Request $request, Event $event): RedirectResponse
    {
        return $this->storeClaim($request, $event, redirect()->route('event.show', $event));
    }

    public function storeGeneral(Request $request): RedirectResponse
    {
        $eventName = trim((string) $request->input('nama_event'));
        $event = Event::query()
            ->where('visibility_status', 'Published')
            ->whereRaw('LOWER(judul_event) = ?', [mb_strtolower($eventName)])
            ->first();

        if (! $event) {
            return back()->withErrors([
                'nama_event' => 'Nama event tidak ditemukan. Pastikan sama dengan event yang tersedia di InCollab.',
            ])->withInput();
        }

        return $this->storeClaim($request, $event, redirect()->route('event-point-claim.create'));
    }

    public function adminIndex(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in([
                self::STATUS_PENDING,
                self::STATUS_ACCEPTED,
                self::STATUS_REJECTED,
            ])],
        ]);

        $search = trim($filters['search'] ?? '');

        $claims = KlaimPoin::query()
            ->with(['event', 'mahasiswa.user', 'admin'])
            ->when($search !== '', function ($query) use ($search) {
                $lowerSearch = mb_strtolower($search);

                $query->where(function ($query) use ($lowerSearch) {
                    $query
                        ->whereRaw('LOWER(nama_lengkap) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(nim_user) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(nama_event) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(nama_sertifikat) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereHas('event', fn ($eventQuery) => $eventQuery
                            ->whereRaw('LOWER(judul_event) LIKE ?', ['%'.$lowerSearch.'%']));
                });
            })
            ->when(($filters['status'] ?? '') !== '', fn ($query) => $query->where('status_klaim', $filters['status']))
            ->latest()
            ->paginate(10)
            ->through(fn (KlaimPoin $claim) => $this->formatClaim($claim))
            ->withQueryString();

        return Inertia::render('admin/poin/index', [
            'claims' => $claims,
            'filters' => [
                'search' => $search,
                'status' => $filters['status'] ?? '',
            ],
            'statuses' => [
                self::STATUS_PENDING,
                self::STATUS_ACCEPTED,
                self::STATUS_REJECTED,
            ],
            'summary' => [
                'total' => KlaimPoin::count(),
                'pending' => KlaimPoin::where('status_klaim', self::STATUS_PENDING)->count(),
                'accepted' => KlaimPoin::where('status_klaim', self::STATUS_ACCEPTED)->count(),
                'rejected' => KlaimPoin::where('status_klaim', self::STATUS_REJECTED)->count(),
            ],
        ]);
    }

    private function storeClaim(Request $request, Event $event, RedirectResponse $successRedirect): RedirectResponse
    {
        $mahasiswa = $this->mahasiswaFor($request);

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:150'],
            'nim_user' => ['required', 'string', 'max:30'],
            'tanggal_mengikuti_event' => ['required', 'date'],
            'nama_sertifikat' => ['required', 'string', 'max:150'],
            'file_bukti' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
            'catatan_user' => ['nullable', 'string', 'max:1000'],
        ]);

        $alreadyClaimed = KlaimPoin::query()
            ->where('mhs_id', $mahasiswa->mhs_id)
            ->where('event_id', $event->event_id)
            ->whereIn('status_klaim', self::BLOCKING_STATUSES)
            ->exists();

        if ($alreadyClaimed) {
            return back()->withErrors([
                'event' => 'Kamu sudah punya klaim yang sedang diverifikasi atau sudah diterima untuk event ini.',
            ]);
        }

        $path = Storage::disk('public')->putFile('event-point-claims', $validated['file_bukti']);

        KlaimPoin::create([
            'mhs_id' => $mahasiswa->mhs_id,
            'event_id' => $event->event_id,
            'tanggal_klaim' => now()->toDateString(),
            'nama_lengkap' => $validated['nama_lengkap'],
            'nim_user' => $validated['nim_user'],
            'nama_event' => $event->judul_event,
            'tanggal_mengikuti_event' => $validated['tanggal_mengikuti_event'],
            'nama_sertifikat' => $validated['nama_sertifikat'],
            'file_bukti' => $path,
            'catatan_user' => $validated['catatan_user'] ?? null,
            'status_klaim' => self::STATUS_PENDING,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Klaim poin berhasil dikirim dan menunggu verifikasi admin.',
        ]);

        return $successRedirect;
    }

    public function approve(Request $request, KlaimPoin $klaimPoin): RedirectResponse
    {
        DB::transaction(function () use ($request, $klaimPoin) {
            $claim = KlaimPoin::query()
                ->whereKey($klaimPoin->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            if ($claim->status_klaim === self::STATUS_ACCEPTED || $claim->poin_diberikan_at) {
                return;
            }

            $event = Event::query()
                ->whereKey($claim->event_id)
                ->lockForUpdate()
                ->firstOrFail();

            $mahasiswa = Mahasiswa::query()
                ->whereKey($claim->mhs_id)
                ->lockForUpdate()
                ->firstOrFail();

            $points = max(0, (int) $event->poin_event);

            if ($points > 0) {
                $mahasiswa->increment('total_poin', $points);
            }

            $claim->update([
                'admin_id' => $request->user()->user_id,
                'status_klaim' => self::STATUS_ACCEPTED,
                'catatan_admin' => null,
                'alasan_penolakan' => null,
                'poin_diberikan_at' => now(),
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Klaim diterima dan poin event sudah ditambahkan satu kali.',
        ]);

        return redirect()->route('admin.poin');
    }

    public function reject(Request $request, KlaimPoin $klaimPoin): RedirectResponse
    {
        $validated = $request->validate([
            'alasan_penolakan' => ['required', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($request, $klaimPoin, $validated) {
            $claim = KlaimPoin::query()
                ->whereKey($klaimPoin->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            if ($claim->status_klaim === self::STATUS_ACCEPTED || $claim->poin_diberikan_at) {
                return;
            }

            $claim->update([
                'admin_id' => $request->user()->user_id,
                'status_klaim' => self::STATUS_REJECTED,
                'catatan_admin' => $validated['alasan_penolakan'],
                'alasan_penolakan' => $validated['alasan_penolakan'],
            ]);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Klaim ditolak dan alasan penolakan sudah disimpan.',
        ]);

        return redirect()->route('admin.poin');
    }

    private function formatEvent(Event $event): array
    {
        return [
            'id' => $event->event_id,
            'title' => $event->judul_event,
            'date' => optional($event->tanggal_event)->toDateString(),
            'points' => (int) $event->poin_event,
            'category' => $event->kategori_event,
        ];
    }

    private function mahasiswaFor(Request $request): Mahasiswa
    {
        $user = $request->user();

        return $user->mahasiswa()->firstOrCreate([], [
            'nim' => 'USER-'.$user->user_id,
            'total_poin' => 0,
        ]);
    }

    private function eventOptions(): array
    {
        return Event::query()
            ->where('visibility_status', 'Published')
            ->where('poin_event', '>', 0)
            ->orderBy('judul_event')
            ->get()
            ->map(fn (Event $event) => [
                'id' => $event->event_id,
                'title' => $event->judul_event,
                'points' => (int) $event->poin_event,
            ])
            ->values()
            ->all();
    }

    private function formatClaim(KlaimPoin $claim): array
    {
        return [
            'id' => $claim->klaim_id,
            'event_id' => $claim->event_id,
            'nama_lengkap' => $claim->nama_lengkap,
            'nim_user' => $claim->nim_user,
            'nama_event' => $claim->nama_event ?: $claim->event?->judul_event,
            'tanggal_mengikuti_event' => optional($claim->tanggal_mengikuti_event)->toDateString(),
            'nama_sertifikat' => $claim->nama_sertifikat,
            'catatan_user' => $claim->catatan_user,
            'status_klaim' => $claim->status_klaim,
            'alasan_penolakan' => $claim->alasan_penolakan ?: $claim->catatan_admin,
            'file_bukti_url' => $claim->file_bukti ? Storage::disk('public')->url($claim->file_bukti) : null,
            'points' => (int) ($claim->event?->poin_event ?? 0),
            'submitted_at' => optional($claim->created_at)->toDateTimeString(),
            'reviewed_by' => $claim->admin?->name,
            'poin_diberikan_at' => optional($claim->poin_diberikan_at)->toDateTimeString(),
        ];
    }
}
