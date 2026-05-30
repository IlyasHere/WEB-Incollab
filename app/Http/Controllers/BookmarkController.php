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

        return back();
    }

    public function destroy(Event $event)
    {
        Bookmark::where('user_id', Auth::id())
            ->where('event_id', $event->event_id)
            ->delete();

        return back();
    }

    public function index()
    {
        $savedEvents = Bookmark::with('event')
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('tersimpan', [
            'savedEvents' => $savedEvents,
        ]);
    }
}