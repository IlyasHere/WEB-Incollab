<?php

use App\Models\FeedPost;
use App\Models\Mahasiswa;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('dashboard search filters only feed posts by title content hashtag or profile text', function () {
    $viewer = User::factory()->create(['role' => 'mahasiswa']);
    Mahasiswa::query()->create([
        'user_id' => $viewer->user_id,
        'total_poin' => 0,
    ]);

    $matchedAuthor = User::factory()->create([
        'name' => 'Penulis Hackathon',
        'role' => 'mahasiswa',
    ]);
    Mahasiswa::query()->create([
        'user_id' => $matchedAuthor->user_id,
        'jurusan' => 'S1 Informatika',
        'universitas' => 'Universitas Telkom',
        'total_poin' => 0,
    ]);

    $unmatchedAuthor = User::factory()->create([
        'name' => 'Penulis Lain',
        'role' => 'mahasiswa',
    ]);
    Mahasiswa::query()->create([
        'user_id' => $unmatchedAuthor->user_id,
        'jurusan' => 'S1 Desain',
        'universitas' => 'Kampus Merdeka',
        'total_poin' => 0,
    ]);

    $matchedPost = FeedPost::query()->create([
        'user_id' => $matchedAuthor->user_id,
        'title' => 'Butuh tim Hackathon kampus',
        'content' => 'Mencari kolaborator untuk aplikasi edukasi.',
        'tags' => ['Hackathon', 'Laravel'],
    ]);

    FeedPost::query()->create([
        'user_id' => $unmatchedAuthor->user_id,
        'title' => 'Diskusi desain poster',
        'content' => 'Membahas layout visual untuk acara komunitas.',
        'tags' => ['Desain'],
    ]);

    $this->actingAs($viewer)
        ->get(route('dashboard', ['search' => 'hackathon']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('filters.search', 'hackathon')
            ->has('posts', 1)
            ->where('posts.0.id', $matchedPost->post_id)
            ->where('posts.0.title', 'Butuh tim Hackathon kampus')
        );
});
