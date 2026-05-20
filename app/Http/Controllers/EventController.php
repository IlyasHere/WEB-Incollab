<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    private const VISIBILITIES = [
        'Draft',
        'Published',
    ];

    private const REGISTRATION_STATUSES = [
        'Coming Soon',
        'Open',
        'Closed',
    ];

    /**
     * Display the public event page.
     */
    public function index(Request $request): Response
    {
        $category = $request->string('category')->value() ?: 'Semua';
        $view = $request->string('view')->value() ?: 'list';
        $categories = $this->categories();

        $eventsQuery = Event::query()
            ->where('visibility_status', 'Published')
            ->orderBy('tanggal_event');

        if ($category !== 'Semua') {
            $eventsQuery->where('kategori_event', $category);
        }

        $events = $eventsQuery->get();
        $upcomingEvents = Event::query()
            ->where('visibility_status', 'Published')
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
    public function adminIndex(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'category' => ['nullable', 'string'],
            'visibility' => ['nullable', 'string'],
            'registration_status' => ['nullable', 'string'],
        ]);

        $search = trim($filters['search'] ?? '');

        $events = Event::query()
            ->when($search !== '', function ($query) use ($search) {
                $lowerSearch = mb_strtolower($search);
                $normalizedId = preg_replace('/\D+/', '', $search);

                $query->where(function ($query) use ($lowerSearch, $normalizedId) {
                    if ($normalizedId !== '') {
                        $query->orWhere('event_id', (int) $normalizedId);
                    }

                    $query
                        ->orWhereRaw('LOWER(judul_event) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(kategori_event) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(visibility_status) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(registration_status) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(status_event) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(lokasi) LIKE ?', ['%'.$lowerSearch.'%'])
                        ->orWhereRaw('LOWER(penyelenggara) LIKE ?', ['%'.$lowerSearch.'%']);
                });
            })
            ->when(($filters['category'] ?? '') !== '', function ($query) use ($filters) {
                $query->where('kategori_event', $filters['category']);
            })
            ->when(($filters['visibility'] ?? '') !== '', function ($query) use ($filters) {
                $query->where('visibility_status', $filters['visibility']);
            })
            ->when(($filters['registration_status'] ?? '') !== '', function ($query) use ($filters) {
                $query->where('registration_status', $filters['registration_status']);
            })
            ->latest('created_at')
            ->paginate(10)
            ->through(fn (Event $event) => $this->transformEvent($event))
            ->withQueryString();

        $upcomingCount = Event::query()
            ->whereDate('tanggal_event', '>=', now()->toDateString())
            ->count();
        $publishedCount = Event::query()
            ->where('visibility_status', 'Published')
            ->count();
        $eventCategories = array_values(array_filter(
            $this->categories(),
            fn (string $category) => $category !== 'Semua',
        ));

        return Inertia::render('admin/event/index', [
            'categories' => $eventCategories,
            'events' => $events,
            'stats' => [
                'total' => Event::count(),
                'upcoming' => $upcomingCount,
                'published' => $publishedCount,
            ],
            'filters' => [
                'search' => $search,
                'category' => $filters['category'] ?? '',
                'visibility' => $filters['visibility'] ?? '',
                'registration_status' => $filters['registration_status'] ?? '',
            ],
            'visibilities' => self::VISIBILITIES,
            'registrationStatuses' => self::REGISTRATION_STATUSES,
        ]);
    }

    /**
     * Display the create event page.
     */
    public function create(): Response
    {
        return Inertia::render('admin/event/create', [
            'categories' => $this->eventCategories(),
            'visibilities' => self::VISIBILITIES,
            'registrationStatuses' => self::REGISTRATION_STATUSES,
        ]);
    }

    /**
     * Display the edit event page.
     */
    public function edit(Event $event): Response
    {
        return Inertia::render('admin/event/edit', [
            'categories' => $this->eventCategories(),
            'visibilities' => self::VISIBILITIES,
            'registrationStatuses' => self::REGISTRATION_STATUSES,
            'event' => $this->transformEvent($event),
        ]);
    }

    /**
     * Display the selected event detail page.
     */
    public function show(Event $event): Response
    {
        if ($event->visibility_status !== 'Published' && request()->user()?->role !== 'admin') {
            abort(404);
        }

        return Inertia::render('event-detail', [
            'event' => $this->transformEvent($event),
        ]);
    }

    /**
     * Store a newly created event.
     */
    public function store(StoreEventRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Event::create([
            ...$validated,
            'admin_id' => $request->user()->getKey(),
            'poin_event' => $request->integer('poin_event'),
            'status_event' => $validated['registration_status'],
            'poster_event' => $request->file('poster_event')?->store('events/cards', 'public'),
            'detail_poster_event' => $request->file('detail_poster_event')?->store('events/details', 'public'),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Event berhasil ditambahkan.',
        ]);

        return redirect()->route('admin.event');
    }

    /**
     * Update the selected event.
     */
    public function update(StoreEventRequest $request, Event $event): RedirectResponse
    {
        $validated = $request->validated();

        $event->update([
            ...$validated,
            'poin_event' => $request->integer('poin_event'),
            'status_event' => $validated['registration_status'],
            'poster_event' => $request->file('poster_event')
                ? $this->replaceMedia($event->poster_event, $request->file('poster_event')->store('events/cards', 'public'))
                : $event->poster_event,
            'detail_poster_event' => $request->file('detail_poster_event')
                ? $this->replaceMedia($event->detail_poster_event, $request->file('detail_poster_event')->store('events/details', 'public'))
                : $event->detail_poster_event,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Event berhasil diperbarui.',
        ]);

        return redirect()->route('admin.event');
    }

    /**
     * Remove the selected event.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $this->deleteMedia($event->poster_event);
        $this->deleteMedia($event->detail_poster_event);
        $event->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Event berhasil dihapus.',
        ]);

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
     * @return array<int, string>
     */
    private function eventCategories(): array
    {
        return array_values(array_filter(
            $this->categories(),
            fn (string $category) => $category !== 'Semua',
        ));
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
            'created_at' => optional($event->created_at)->toDateTimeString(),
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
