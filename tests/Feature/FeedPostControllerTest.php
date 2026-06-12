<?php

use App\Models\FeedPost;
use App\Models\FeedPostImage;
use App\Models\Komentar;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function createFeedPostControllerMahasiswaUser(): User
{
    $user = User::factory()->create([
        'role' => 'mahasiswa',
    ]);

    Mahasiswa::query()->create([
        'user_id' => $user->user_id,
        'total_poin' => 0,
    ]);

    return $user;
}

test('menyimpan posting feed dengan maksimal tiga gambar', function () {
    Storage::fake('public');

    $user = createFeedPostControllerMahasiswaUser();

    $this->actingAs($user)
        ->post(route('feed.store'), [
            'title' => 'Kolaborasi UI UX',
            'content' => 'Mencari teman untuk membangun prototype aplikasi kampus.',
            'tags' => ['uiux', 'prototype'],
            'images' => [
                UploadedFile::fake()->image('feed-1.jpg')->size(400),
                UploadedFile::fake()->image('feed-2.png')->size(500),
                UploadedFile::fake()->image('feed-3.webp')->size(600),
            ],
        ])
        ->assertRedirect(route('dashboard'));

    $post = FeedPost::query()->firstOrFail();

    expect($post->user_id)->toBe($user->user_id);
    expect($post->title)->toBe('Kolaborasi UI UX');
    expect($post->content)->toBe('Mencari teman untuk membangun prototype aplikasi kampus.');
    expect($post->tags)->toBe(['uiux', 'prototype']);
    expect(FeedPostImage::query()->count())->toBe(3);

    $post->images->each(function (FeedPostImage $image, int $index): void {
        expect($image->sort_order)->toBe($index);
        Storage::disk('public')->assertExists($image->image_path);
    });
});

test('menolak komentar kosong dan tidak menyimpan komentar', function () {
    $author = createFeedPostControllerMahasiswaUser();
    $commenter = createFeedPostControllerMahasiswaUser();

    $post = FeedPost::query()->create([
        'user_id' => $author->user_id,
        'title' => 'Diskusi Backend',
        'content' => 'Butuh masukan untuk API Laravel.',
        'tags' => null,
    ]);

    $this->actingAs($commenter)
        ->from(route('post.detail', $post))
        ->post(route('post.comments.store', $post), [
            'content' => '',
        ])
        ->assertRedirect(route('post.detail', $post))
        ->assertSessionHasErrors('content');

    expect(Komentar::query()->count())->toBe(0);
});
