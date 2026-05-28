<?php

namespace App\Support;

use App\Models\FeedPost;
use App\Models\User;
use Illuminate\Support\Collection;

class FeedPostFormatter
{
    public function format(FeedPost $post, ?User $viewer = null): array
    {
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
            'comments' => $post->komentar_count ?? $post->komentar()->count(),
            'image' => $images->first(),
            'images' => $images,
            'canDelete' => $viewer ? $post->user_id === $viewer->user_id : false,
        ];
    }

    public function formatMany(Collection $posts, ?User $viewer = null): Collection
    {
        return $posts->map(fn (FeedPost $post) => $this->format($post, $viewer));
    }

    private function resolveAvatar(?string $foto, ?string $avatar): ?string
    {
        if ($foto) {
            return str_starts_with($foto, 'http') ? $foto : asset('storage/'.$foto);
        }

        return $avatar;
    }
}
