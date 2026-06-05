<?php

namespace App\Http\Controllers;

use App\Models\FeedPost;
use App\Models\User;
use App\Support\FeedPostFormatter;
use App\Support\TrendingTopicFinder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
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
        if (! Schema::hasTable('feed_posts')) {
            return collect();
        }

        $query = FeedPost::with('user.mahasiswa');

        $hasImagesTable = Schema::hasTable('feed_post_images');
        $hasCommentsTable = Schema::hasTable('komentar') && Schema::hasColumn('komentar', 'post_id');

        if ($hasImagesTable) {
            $query->with('images');
        }

        if ($hasCommentsTable) {
            $query->withCount('komentar');
        }

        $posts = $query
            ->latest()
            ->get();

        $posts->each(function (FeedPost $post) use ($hasImagesTable, $hasCommentsTable) {
            if (! $hasImagesTable) {
                $post->setRelation('images', collect());
            }

            if (! $hasCommentsTable) {
                $post->setAttribute('komentar_count', 0);
            }
        });

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
