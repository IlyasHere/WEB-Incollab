<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('admin/pengaturan/index', [
            'profileUser' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $this->resolveAvatar($user->avatar),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ]);

        $user = $request->user();
        $user->name = $validated['name'];

        if ($request->hasFile('avatar')) {
            if ($user->avatar && ! str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->avatar = $request->file('avatar')
                ->store('profile/admin', 'public');
        }

        $user->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Profil admin berhasil diperbarui.',
        ]);

        return back();
    }

    private function resolveAvatar(?string $avatar): ?string
    {
        if (! $avatar || str_starts_with($avatar, 'http') || str_starts_with($avatar, '/')) {
            return $avatar;
        }

        return asset('storage/'.$avatar);
    }
}
