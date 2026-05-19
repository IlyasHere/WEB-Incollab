<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('pengaturan/notifikasi', [
            'notifications' => Notification::query()
                ->where('user_id', $user->user_id)
                ->latest()
                ->get()
                ->map(fn (Notification $notification) => $this->formatNotification($notification))
                ->values(),
            'unreadCount' => Notification::where('user_id', $user->user_id)
                ->whereNull('read_at')
                ->count(),
        ]);
    }

    public function markAsRead(Request $request, Notification $notification): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->user_id, 403);

        if (! $notification->read_at) {
            $notification->forceFill(['read_at' => now()])->save();
        }

        return back();
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        Notification::query()
            ->where('user_id', $request->user()->user_id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    private function formatNotification(Notification $notification): array
    {
        $createdAt = $notification->created_at?->copy()->timezone('Asia/Jakarta');

        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'title' => $notification->title,
            'body' => $notification->body,
            'url' => $notification->url,
            'readAt' => $notification->read_at?->copy()->timezone('Asia/Jakarta')->toIso8601String(),
            'createdAt' => $createdAt?->toIso8601String(),
            'timeLabel' => $createdAt?->diffForHumans(),
        ];
    }
}
