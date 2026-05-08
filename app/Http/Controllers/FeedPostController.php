<?php

namespace App\Http\Controllers;

use App\Models\FeedPost;
use App\Models\Komentar;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FeedPostController extends Controller
{
    public function create()
    {
        $user = auth()->user();

        if ($user->role === 'mahasiswa') {
            $user->mahasiswa()->firstOrCreate([]);
        }

        $user->load('mahasiswa');

        return Inertia::render('add-feed', [
            'user' => [
                'user_id' => $user->user_id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'mahasiswa' => $user->mahasiswa ? [
                    'foto' => $user->mahasiswa->foto,
                    'universitas' => $user->mahasiswa->universitas,
                    'jurusan' => $user->mahasiswa->jurusan,
                ] : null,
            ],
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role === 'mahasiswa') {
            $request->user()->mahasiswa()->firstOrCreate([]);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['nullable', 'string', 'max:50'],
            'images' => ['nullable', 'array', 'max:3'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp,gif', 'max:2048'],
        ]);

        $post = FeedPost::create([
            'user_id' => auth()->user()->user_id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'tags' => $validated['tags'] ?? null,
        ]);

        foreach ($request->file('images', []) as $index => $image) {
            $path = Storage::disk('public')->putFile('feed-images', $image);

            $post->images()->create([
                'image_path' => $path,
                'sort_order' => $index,
            ]);
        }

        return redirect()
            ->route('dashboard')
            ->with('success', 'Postingan berhasil dibuat.');
    }

    public function show(FeedPost $post)
    {
        $post->load([
            'user.mahasiswa',
            'images',
            'komentar.mahasiswa.user',
        ]);

        return Inertia::render('post/detail', [
            'post' => $this->formatPostDetail($post),
            'comments' => $post->komentar->map(fn (Komentar $comment) => $this->formatComment($comment)),
            'currentUser' => $this->formatCurrentUser(),
        ]);
    }

    public function storeComment(Request $request, FeedPost $post)
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:1000'],
        ]);

        $mahasiswa = $request->user()
            ->mahasiswa()
            ->firstOrCreate([]);

        Komentar::create([
            'mhs_id' => $mahasiswa->mhs_id,
            'post_id' => $post->post_id,
            'isi_komentar' => $validated['content'],
            'tanggal_komentar' => now('Asia/Jakarta'),
        ]);

        return back()->with('success', 'Komentar berhasil dikirim.');
    }

    private function formatPostDetail(FeedPost $post): array
    {
        $user = $post->user;
        $mahasiswa = $user?->mahasiswa;
        $avatar = $this->resolveAvatar($mahasiswa?->foto, $user?->avatar);

        return [
            'id' => $post->post_id,
            'user' => [
                'name' => $user?->name ?? 'Mahasiswa',
                'major' => collect([$mahasiswa?->jurusan, $mahasiswa?->universitas])
                    ->filter()
                    ->join(' • ') ?: 'Mahasiswa',
                'avatar' => $avatar,
            ],
            'postedAt' => $post->created_at?->diffForHumans() ?? 'Baru saja',
            'title' => $post->title,
            'description' => $post->content,
            'hashtags' => $post->tags ?? [],
            'likes' => 0,
            'comments' => $post->komentar->count(),
            'images' => $post->images
                ->map(fn ($image) => asset('storage/'.$image->image_path))
                ->values(),
        ];
    }

    private function formatComment(Komentar $comment): array
    {
        $mahasiswa = $comment->mahasiswa;
        $user = $mahasiswa?->user;

        return [
            'id' => $comment->komentar_id,
            'user' => [
                'name' => $user?->name ?? 'Mahasiswa',
                'avatar' => $this->resolveAvatar($mahasiswa?->foto, $user?->avatar),
            ],
            'content' => $comment->isi_komentar,
            'time' => $comment->tanggal_komentar
                ? $this->formatKomentarTime($comment)
                : 'Baru saja',
            'likes' => 0,
        ];
    }

    private function formatCurrentUser(): array
    {
        $user = auth()->user()->load('mahasiswa');
        $mahasiswa = $user->mahasiswa;

        return [
            'name' => $user->name,
            'avatar' => $this->resolveAvatar($mahasiswa?->foto, $user->avatar),
        ];
    }

    private function resolveAvatar(?string $foto, ?string $avatar): ?string
    {
        if ($foto) {
            return str_starts_with($foto, 'http') ? $foto : asset('storage/'.$foto);
        }

        return $avatar;
    }

    private function formatKomentarTime(Komentar $comment): string
    {
        $rawTimestamp = $comment->getRawOriginal('tanggal_komentar');

        if (! $rawTimestamp) {
            return 'Baru saja';
        }

        return Carbon::parse($rawTimestamp, 'Asia/Jakarta')
            ->diffForHumans(now('Asia/Jakarta'));
    }
}
