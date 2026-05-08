<?php

namespace App\Http\Controllers;

use App\Models\FeedPost;
use App\Models\User;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function show(User $user)
    {
        abort_unless($user->role === 'mahasiswa', 404);

        $user->load([
            'mahasiswa',
            'feedPosts' => fn ($query) => $query
                ->with(['images'])
                ->withCount('komentar')
                ->latest(),
        ]);

        $mahasiswa = $user->mahasiswa;

        return Inertia::render('profile/show', [
            'profile' => [
                'id' => $user->user_id,
                'name' => $user->name,
                'avatar' => $this->resolveAvatar($mahasiswa?->foto, $user->avatar),
                'bio' => $mahasiswa?->bio,
                'universitas' => $mahasiswa?->universitas,
                'jurusan' => $mahasiswa?->jurusan,
                'angkatan' => $mahasiswa?->angkatan,
                'semester' => $mahasiswa?->semester,
                'totalPoin' => $mahasiswa?->total_poin ?? 0,
                'postCount' => $user->feedPosts->count(),
                'skills' => $mahasiswa?->skill ?? [],
                'interests' => $mahasiswa?->minat ?? [],
                'contacts' => [
                    'instagram' => $mahasiswa?->instagram,
                    'linkedin' => $mahasiswa?->linkedin,
                    'github' => $mahasiswa?->github,
                    'portfolio' => $mahasiswa?->portfolio,
                ],
            ],
            'posts' => $user->feedPosts->map(fn (FeedPost $post) => $this->formatPost($post)),
        ]);
    }

    private function formatPost(FeedPost $post): array
    {
        $firstImage = $post->images->first();

        return [
            'id' => $post->post_id,
            'title' => $post->title,
            'description' => $post->content,
            'hashtags' => $post->tags ?? [],
            'likes' => 0,
            'comments' => $post->komentar_count,
            'image' => $firstImage ? asset('storage/'.$firstImage->image_path) : null,
        ];
    }

    private function resolveAvatar(?string $foto, ?string $avatar): ?string
    {
        if ($foto) {
            return str_starts_with($foto, 'http') ? $foto : asset('storage/'.$foto);
        }

        return $avatar;
    }
}
