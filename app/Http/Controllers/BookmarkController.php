<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Event;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function store(Event $event)
    {
        Bookmark::firstOrCreate([
            'user_id' => Auth::id(),
            'event_id' => $event->event_id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Event berhasil disimpan.',
        ]);

        return back();
    }

    public function destroy(Event $event)
    {
        Bookmark::where('user_id', Auth::id())
            ->where('event_id', $event->event_id)
            ->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Event dihapus dari tersimpan.',
        ]);

        return back();
    }

    public function index()
    {
        $savedEvents = Bookmark::with('event.admin')
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('tersimpan', [
            'savedEvents' => $savedEvents
                ->filter(fn (Bookmark $bookmark) => $bookmark->event !== null)
                ->map(fn (Bookmark $bookmark) => $this->transformEvent($bookmark->event))
                ->values(),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformEvent(Event $event): array
    {
        return [
            'id' => $event->getKey(),
            'title' => $event->judul_event,
            'description' => $event->deskripsi_event,
            'date' => optional($event->tanggal_event)->toDateString(),
            'end_date' => optional($event->tanggal_selesai)->toDateString(),
            'location' => $event->lokasi,
            'category' => $event->kategori_event,
            'points' => $event->poin_event,
            'registration_url' => $event->link_pendaftaran,
            'status' => $event->registration_status,
            'visibility_status' => $event->visibility_status,
            'registration_status' => $event->registration_status,
            'poster_url' => $this->resolveMediaUrl($event->poster_event),
            'detail_poster_url' => $this->resolveMediaUrl(
                $event->detail_poster_event ?: $event->poster_event,
            ),
            'organizer' => $event->penyelenggara ?? optional($event->admin)->name,
            'admin_name' => optional($event->admin)->name,
            'isBookmarked' => true,
        ];
    }

    private function resolveMediaUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'storage/')) {
            return '/'.$path;
        }

        return '/storage/'.$path;
    }
}
