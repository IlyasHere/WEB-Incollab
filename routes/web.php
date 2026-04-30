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

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Auth\GoogleController;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : redirect()->route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/auth/google', [GoogleController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleController::class, 'callback']);

require __DIR__.'/settings.php';
