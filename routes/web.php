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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FeedPostController;
use App\Http\Controllers\PointHistoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileSettingController;
use App\Http\Controllers\UserProfileController;
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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/add-feed', [FeedPostController::class, 'create'])->name('feed.create');
    Route::post('/add-feed', [FeedPostController::class, 'store'])->name('feed.store');
    Route::inertia('eksplorasi', 'eksplorasi')->name('eksplorasi');
    Route::get('event', [EventController::class, 'index'])->name('event');
    Route::get('event/{event}', [EventController::class, 'show'])->name('event.show');
    Route::inertia('tukar-poin', 'tukar-poin')->name('tukar-poin');
    Route::inertia('tersimpan', 'tersimpan')->name('tersimpan');
    Route::get('profile/{user}', [UserProfileController::class, 'show'])->name('profile.show');
    Route::get('pengaturan', [ProfileSettingController::class, 'edit'])->name('pengaturan');
    Route::put('pengaturan', [ProfileSettingController::class, 'update'])->name('pengaturan.update');
    Route::inertia('pengaturan/notifikasi', 'pengaturan/notifikasi')->name('pengaturan.notifikasi');
    Route::get('pengaturan/riwayat-poin', [PointHistoryController::class, 'pengaturan'])->name('pengaturan.riwayat-poin');
    Route::inertia('pengaturan/bantuan', 'pengaturan/bantuan')->name('pengaturan.bantuan');
    Route::get('post/{post}', [FeedPostController::class, 'show'])->name('post.detail');
    Route::post('post/{post}/comments', [FeedPostController::class, 'storeComment'])->name('post.comments.store');
    Route::delete('post/{post}', [FeedPostController::class, 'destroy'])->name('post.destroy');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::inertia('dashboard', 'admin/dashboard')->name('dashboard');
        Route::get('event', [EventController::class, 'adminIndex'])->name('event');
        Route::post('event', [EventController::class, 'store'])->name('event.store');
        Route::post('event/{event}/update', [EventController::class, 'update'])->name('event.update');
        Route::delete('event/{event}', [EventController::class, 'destroy'])->name('event.destroy');
        Route::inertia('reward', 'admin/reward/index')->name('reward');
        Route::inertia('pengaduan', 'admin/pengaduan/index')->name('pengaduan');
        Route::inertia('poin', 'admin/poin/index')->name('poin');
        Route::inertia('reminder', 'admin/reminder/index')->name('reminder');
        Route::inertia('pengaturan', 'admin/pengaturan/index')->name('pengaturan');
    });

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

require __DIR__.'/settings.php';
