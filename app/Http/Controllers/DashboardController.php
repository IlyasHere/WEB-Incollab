<?php

namespace App\Http\Controllers;

use App\Models\FeedPost;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('dashboard', [
            'posts' => $this->feedPosts($request),
            'partners' => $this->partners($request),
        ]);
    }

    private function feedPosts(Request $request)
    {
        return FeedPost::with(['user.mahasiswa', 'images'])
            ->withCount('komentar')
            ->latest()
            ->get()
            ->map(function (FeedPost $post) use ($request) {
                $user = $post->user;
                $mahasiswa = $user?->mahasiswa;
                $images = $post->images
                    ->map(fn ($image) => asset('storage/'.$image->image_path))
                    ->values();

                return [
                    'id' => $post->post_id,
                    'user' => [
                        'name' => $user?->name ?? 'Mahasiswa',
                        'major' => collect([$mahasiswa?->jurusan, $mahasiswa?->universitas])
                            ->filter()
                            ->join(' • ') ?: 'Mahasiswa',
                        'avatar' => $this->resolveAvatar($mahasiswa?->foto, $user?->avatar),
                    ],
                    'postedAt' => $post->created_at?->diffForHumans() ?? 'Baru saja',
                    'badge' => 'POSTINGAN',
                    'badgeColor' => 'bg-[#F0E7FF] text-[#6610F2]',
                    'title' => $post->title,
                    'description' => $post->content,
                    'hashtags' => $post->tags ?? [],
                    'likes' => 0,
                    'comments' => $post->komentar_count,
                    'image' => $images->first(),
                    'images' => $images,
                    'canDelete' => $post->user_id === $request->user()->user_id,
                ];
            });
    }

    private function partners(Request $request)
    {
        return User::query()
            ->with('mahasiswa')
            ->where('role', 'mahasiswa')
            ->where('user_id', '!=', $request->user()->user_id)
            ->latest('user_id')
            ->limit(5)
            ->get()
            ->map(function (User $user) {
                $mahasiswa = $user->mahasiswa;

                return [
                    'id' => $user->user_id,
                    'name' => $user->name,
                    'role' => $mahasiswa?->jurusan ?: 'Mahasiswa',
                    'campus' => $mahasiswa?->universitas ?: 'Kampus belum diisi',
                    'avatar' => $this->resolveAvatar($mahasiswa?->foto, $user->avatar),
                    'profileUrl' => route('profile.show', $user),
                ];
            });
    }

    private function resolveAvatar(?string $foto, ?string $avatar): ?string
    {
        if ($foto) {
            return str_starts_with($foto, 'http') ? $foto : asset('storage/'.$foto);
        }

        return $avatar;
    }
}
