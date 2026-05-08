<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display the public event page.
     */
    public function index(Request $request): Response
    {
        $category = $request->string('category')->value() ?: 'Semua';
        $view = $request->string('view')->value() ?: 'list';
        $categories = $this->categories();

        $eventsQuery = Event::query()->orderBy('tanggal_event');

        if ($category !== 'Semua') {
            $eventsQuery->where('kategori_event', $category);
        }

        $events = $eventsQuery->get();
        $upcomingEvents = Event::query()
            ->whereDate('tanggal_event', '>=', now()->toDateString())
            ->orderBy('tanggal_event')
            ->take(4)
            ->get();

        return Inertia::render('event', [
            'categories' => $categories,
            'filters' => [
                'category' => in_array($category, $categories, true) ? $category : 'Semua',
                'view' => in_array($view, ['list', 'calendar'], true) ? $view : 'list',
            ],
            'events' => $events->map(fn (Event $event) => $this->transformEvent($event))->values(),
            'upcomingEvents' => $upcomingEvents
                ->map(fn (Event $event) => $this->transformEvent($event))
                ->values(),
            'canManage' => $request->user()?->role === 'admin',
        ]);
    }

    /**
     * Display the admin event management page.
     */
    public function adminIndex(): Response
    {
        $events = Event::query()->latest('created_at')->get();
        $upcomingCount = Event::query()
            ->whereDate('tanggal_event', '>=', now()->toDateString())
            ->count();
        $publishedCount = Event::query()
            ->where('status_event', 'Published')
            ->count();

        return Inertia::render('admin/event/index', [
            'categories' => array_values(array_filter(
                $this->categories(),
                fn (string $category) => $category !== 'Semua',
            )),
            'events' => $events->map(fn (Event $event) => $this->transformEvent($event))->values(),
            'stats' => [
                'total' => $events->count(),
                'upcoming' => $upcomingCount,
                'published' => $publishedCount,
            ],
        ]);
    }

    /**
     * Display the selected event detail page.
     */
    public function show(Event $event): Response
    {
        return Inertia::render('event-detail', [
            'event' => $this->transformEvent($event),
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(StoreEventRequest $request)
    {
        $validated = $request->validated();

        Event::create([
            ...$validated,
            'admin_id' => $request->user()->getKey(),
            'poin_event' => $request->integer('poin_event'),
            'poster_event' => $request->file('poster_event')?->store('events/cards', 'public'),
            'detail_poster_event' => $request->file('detail_poster_event')?->store('events/details', 'public'),
        ]);

        return redirect()->route('admin.event');
    }

    /**
     * Update the selected event.
     */
    public function update(StoreEventRequest $request, Event $event)
    {
        $validated = $request->validated();

        $event->update([
            ...$validated,
            'poin_event' => $request->integer('poin_event'),
            'poster_event' => $request->file('poster_event')
                ? $this->replaceMedia($event->poster_event, $request->file('poster_event')->store('events/cards', 'public'))
                : $event->poster_event,
            'detail_poster_event' => $request->file('detail_poster_event')
                ? $this->replaceMedia($event->detail_poster_event, $request->file('detail_poster_event')->store('events/details', 'public'))
                : $event->detail_poster_event,
        ]);

        return redirect()->route('admin.event');
    }

    /**
     * Remove the selected event.
     */
    public function destroy(Event $event)
    {
        $this->deleteMedia($event->poster_event);
        $this->deleteMedia($event->detail_poster_event);
        $event->delete();

        return redirect()->route('admin.event');
    }

    /**
     * @return array<int, string>
     */
    private function categories(): array
    {
        return [
            'Semua',
            'Kompetisi',
            'Workshop',
            'Seminar',
            'Hackathon',
        ];
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
            'status' => $event->status_event,
            'poster_url' => $this->resolveMediaUrl($event->poster_event),
            'detail_poster_url' => $this->resolveMediaUrl(
                $event->detail_poster_event ?: $event->poster_event,
            ),
            'organizer' => $event->penyelenggara ?? optional($event->admin)->name,
            'admin_name' => optional($event->admin)->name,
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

        return Storage::disk('public')->url($path);
    }

    private function replaceMedia(?string $currentPath, string $nextPath): string
    {
        $this->deleteMedia($currentPath);

        return $nextPath;
    }

    private function deleteMedia(?string $path): void
    {
        if (! $path) {
            return;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
