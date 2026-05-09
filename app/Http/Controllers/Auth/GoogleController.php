<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;

class GoogleController extends Controller
{
    public function redirect()
    {
        // return Socialite::driver('google')->redirect();
        return Socialite::driver('google')
            ->redirectUrl(config('services.google.redirect'))
            ->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                if (! $user->google_id) {
                    $user->google_id = $googleUser->getId();
                    $user->avatar = $googleUser->getAvatar();
                    $user->save();
                }
            } else {
                $user = User::create([
                    'name' => $googleUser->getName() ?? 'User Google',
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(Str::random(16)),
                    'role' => 'mahasiswa',
                ]);
            }

            if ($user->role === 'mahasiswa') {
                $user->mahasiswa()->firstOrCreate([]);
            }

            Auth::login($user, true);
            request()->session()->regenerate();

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'Login berhasil. Selamat datang kembali!',
            ]);

            return redirect()->route('dashboard');
        } catch (InvalidStateException $e) {
            return redirect('/login')->with('error', 'Login Google dibatalkan atau sesi sudah tidak valid.');
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Gagal login dengan Google.');
        }
    }
}
