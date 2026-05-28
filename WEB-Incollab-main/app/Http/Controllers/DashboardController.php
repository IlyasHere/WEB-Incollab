<?php

namespace App\Http\Controllers;

use App\Models\FeedPost;
use App\Models\User;
use App\Support\FeedPostFormatter;
use App\Support\TrendingTopicFinder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(
        Request $request,
        FeedPostFormatter $feedPostFormatter,
        TrendingTopicFinder $trendingTopicFinder
    ) {
        return Inertia::render('dashboard', [
            'posts' => $this->feedPosts($request, $feedPostFormatter),
            'partners' => $this->partners($request),
            'topics' => $trendingTopicFinder->get(4),
        ]);
    }

    private function feedPosts(Request $request, FeedPostFormatter $feedPostFormatter)
    {
        $posts = FeedPost::with(['user.mahasiswa', 'images'])
            ->withCount('komentar')
            ->latest()
            ->get();

        return $feedPostFormatter->formatMany($posts, $request->user());
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
