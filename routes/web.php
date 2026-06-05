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

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventPointClaimController;
use App\Http\Controllers\FeedPostController;
use App\Http\Controllers\LaporanPengaduanController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\PointHistoryController;
use App\Http\Controllers\ProfileSettingController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\TrendingTopicController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\BookmarkController;
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
    Route::post('/onboarding/complete', [OnboardingController::class, 'complete'])->name('onboarding.complete');
    Route::inertia('eksplorasi', 'eksplorasi')->name('eksplorasi');
    Route::get('event', [EventController::class, 'index'])->name('event');
    Route::get('event/{event}', [EventController::class, 'show'])->name('event.show');
    Route::get('profile/{user}', [UserProfileController::class, 'show'])->name('profile.show');
    Route::get('post/{post}', [FeedPostController::class, 'show'])->name('post.detail');
    Route::get('trending', [TrendingTopicController::class, 'index'])->name('trending.index');
    Route::get('trending/{topic}', [TrendingTopicController::class, 'show'])->name('trending.show');
    Route::get('chat', [ChatController::class, 'index'])->name('chat');
    Route::get('chat/{conversation}', [ChatController::class, 'index'])->name('chat.show');
    Route::post('chat', [ChatController::class, 'start'])->name('chat.start');
    Route::post('chat/{conversation}/messages', [ChatController::class, 'store'])->name('chat.messages.store');
    Route::post('chat/{conversation}/read', [ChatController::class, 'read'])->name('chat.read');
});

Route::middleware(['auth', 'mahasiswa'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/add-feed', [FeedPostController::class, 'create'])->name('feed.create');
    Route::post('/add-feed', [FeedPostController::class, 'store'])->name('feed.store');
    Route::get('tukar-poin', [RewardController::class, 'index'])->name('tukar-poin');
    Route::post('tukar-poin/{reward}', [RewardController::class, 'redeem'])->name('tukar-poin.redeem');
    Route::get('klaim-poin-event', [EventPointClaimController::class, 'createGeneral'])->name('event-point-claim.create');
    Route::post('klaim-poin-event', [EventPointClaimController::class, 'storeGeneral'])->name('event-point-claim.store');
    Route::get('event/{event}/klaim-poin', [EventPointClaimController::class, 'create'])->name('event-point-claim.event.create');
    Route::post('event/{event}/klaim-poin', [EventPointClaimController::class, 'store'])->name('event-point-claim.event.store');
    Route::get('tersimpan',[BookmarkController::class, 'index'])->name('tersimpan');
    Route::get('pengaturan', [ProfileSettingController::class, 'edit'])->name('pengaturan');
    Route::put('pengaturan', [ProfileSettingController::class, 'update'])->name('pengaturan.update');
    Route::get('pengaturan/notifikasi', [NotificationController::class, 'index'])->name('pengaturan.notifikasi');
    Route::post('pengaturan/notifikasi/{notification}/read', [NotificationController::class, 'markAsRead'])->name('pengaturan.notifikasi.read');
    Route::post('pengaturan/notifikasi/read-all', [NotificationController::class, 'markAllAsRead'])->name('pengaturan.notifikasi.read-all');
    Route::get('pengaturan/riwayat-poin', [PointHistoryController::class, 'pengaturan'])->name('pengaturan.riwayat-poin');
    Route::inertia('pengaturan/bantuan', 'pengaturan/bantuan')->name('pengaturan.bantuan');
    Route::post('pengaturan/bantuan/laporan', [LaporanPengaduanController::class, 'store'])->name('pengaturan.bantuan.laporan.store');
    Route::post('post/{post}/comments', [FeedPostController::class, 'storeComment'])->name('post.comments.store');
    Route::delete('post/{post}', [FeedPostController::class, 'destroy'])->name('post.destroy');
    Route::post('event/{event}/bookmark',[BookmarkController::class, 'store'])->name('bookmark.store');
    Route::delete('event/{event}/bookmark',[BookmarkController::class, 'destroy'])->name('bookmark.destroy');
});

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('event', [EventController::class, 'adminIndex'])->name('event');
        Route::get('event/create', [EventController::class, 'create'])->name('event.create');
        Route::post('event', [EventController::class, 'store'])->name('event.store');
        Route::get('event/{event}/edit', [EventController::class, 'edit'])->name('event.edit');
        Route::post('event/{event}/update', [EventController::class, 'update'])->name('event.update');
        Route::delete('event/{event}', [EventController::class, 'destroy'])->name('event.destroy');
        Route::get('reward', [RewardController::class, 'adminIndex'])->name('reward');
        Route::post('reward', [RewardController::class, 'store'])->name('reward.store');
        Route::post('reward/{reward}/update', [RewardController::class, 'update'])->name('reward.update');
        Route::delete('reward/{reward}', [RewardController::class, 'destroy'])->name('reward.destroy');
        Route::get('pengaduan', [LaporanPengaduanController::class, 'adminIndex'])->name('pengaduan');
        Route::get('pengaduan/{laporan}', [LaporanPengaduanController::class, 'adminShow'])->name('pengaduan.detail');
        Route::put('pengaduan/{laporan}', [LaporanPengaduanController::class, 'update'])->name('pengaduan.update');
        Route::get('poin', [EventPointClaimController::class, 'adminIndex'])->name('poin');
        Route::post('poin/{klaimPoin}/approve', [EventPointClaimController::class, 'approve'])->name('poin.approve');
        Route::post('poin/{klaimPoin}/reject', [EventPointClaimController::class, 'reject'])->name('poin.reject');
        Route::inertia('reminder', 'admin/reminder/index')->name('reminder');
        Route::get('pengaturan', [AdminProfileController::class, 'edit'])->name('pengaturan');
        Route::post('pengaturan', [AdminProfileController::class, 'update'])->name('pengaturan.update');
    });

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

require __DIR__.'/settings.php';
