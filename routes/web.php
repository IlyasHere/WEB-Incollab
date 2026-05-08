<?php

// use Illuminate\Support\Facades\Route;
// use Laravel\Fortify\Features;
// use App\Http\Controllers\Auth\GoogleController;

// Route::inertia('/', 'welcome', [
//     'canRegister' => Features::enabled(Features::registration()),
// ])->name('home');

// Route::middleware(['auth'])->group(function () {
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });

// Route::get('/auth/google', [GoogleController::class, 'redirect']);
// Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

// require __DIR__.'/settings.php';

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\FeedPostController;
use App\Http\Controllers\ProfileSettingController;
use App\Models\FeedPost;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }

    return auth()->user()->role === 'admin'
        ? redirect()->route('admin.dashboard')
        : redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $posts = FeedPost::with(['user.mahasiswa', 'images'])
            ->withCount('komentar')
            ->latest()
            ->get()
            ->map(function (FeedPost $post) {
                $user = $post->user;
                $mahasiswa = $user?->mahasiswa;
                $firstImage = $post->images->first();
                $avatar = $mahasiswa?->foto
                    ? asset('storage/'.$mahasiswa->foto)
                    : ($user?->avatar ?: null);

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
                    'badge' => 'POSTINGAN',
                    'badgeColor' => 'bg-[#F0E7FF] text-[#6610F2]',
                    'title' => $post->title,
                    'description' => $post->content,
                    'hashtags' => $post->tags ?? [],
                    'likes' => 0,
                    'comments' => $post->komentar_count,
                    'image' => $firstImage ? asset('storage/'.$firstImage->image_path) : null,
                ];
            });

        return inertia('dashboard', [
            'posts' => $posts,
        ]);
    })->name('dashboard');
    Route::get('/add-feed', [FeedPostController::class, 'create'])->name('feed.create');
    Route::post('/add-feed', [FeedPostController::class, 'store'])->name('feed.store');
    Route::inertia('eksplorasi', 'eksplorasi')->name('eksplorasi');
    Route::inertia('event', 'event')->name('event');
    Route::inertia('tukar-poin', 'tukar-poin')->name('tukar-poin');
    Route::inertia('tersimpan', 'tersimpan')->name('tersimpan');
    Route::get('pengaturan', [ProfileSettingController::class, 'edit'])->name('pengaturan');
    Route::put('pengaturan', [ProfileSettingController::class, 'update'])->name('pengaturan.update');
    Route::inertia('pengaturan/notifikasi', 'pengaturan/notifikasi')->name('pengaturan.notifikasi');
    Route::inertia('pengaturan/riwayat-poin', 'pengaturan/riwayat-poin')->name('pengaturan.riwayat-poin');
    Route::inertia('pengaturan/bantuan', 'pengaturan/bantuan')->name('pengaturan.bantuan');
    Route::get('post/{post}', [FeedPostController::class, 'show'])->name('post.detail');
    Route::post('post/{post}/comments', [FeedPostController::class, 'storeComment'])->name('post.comments.store');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
        Route::inertia('event', 'admin/event/index')->name('event');
        Route::inertia('event/create', 'admin/event/create')->name('event.create');
        Route::inertia('reward', 'admin/reward/index')->name('reward');
        Route::inertia('pengaduan', 'admin/pengaduan/index')->name('pengaduan');
        Route::inertia('poin', 'admin/poin/index')->name('poin');
        Route::inertia('reminder', 'admin/reminder/index')->name('reminder');
        Route::inertia('pengaturan', 'admin/pengaturan/index')->name('pengaturan');
    });

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

require __DIR__.'/settings.php';
