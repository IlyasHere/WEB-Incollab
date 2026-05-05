<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileSettingController extends Controller
{
    /**
     * Show the standalone profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $mahasiswa = $user->mahasiswa()->firstOrCreate([], [
            'tersedia_kolaborasi' => true,
            'total_poin' => 0,
        ]);

        $user->load('mahasiswa');

        return Inertia::render('pengaturan', [
            'profileUser' => $user,
            'mahasiswa' => $mahasiswa,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:50'],
            'universitas' => ['nullable', 'string', 'max:100'],
            'jurusan' => ['nullable', 'string', 'max:100'],
            'angkatan' => ['nullable', 'string', 'max:10'],
            'semester' => ['nullable', 'integer', 'min:1', 'max:14'],
            'bio' => ['nullable', 'string', 'max:300'],
            'skill' => ['nullable', 'array', 'max:5'],
            'skill.*' => ['nullable', 'string', 'max:50'],
            'minat' => ['nullable', 'array'],
            'minat.*' => ['nullable', 'string', 'max:50'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'linkedin' => ['nullable', 'string', 'max:255'],
            'github' => ['nullable', 'string', 'max:255'],
            'behance' => ['nullable', 'string', 'max:255'],
            'portfolio' => ['nullable', 'string', 'max:255'],
            'tersedia_kolaborasi' => ['boolean'],
            'foto' => ['nullable', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        $user->update([
            'name' => $validated['name'],
        ]);

        $mahasiswa = $user->mahasiswa()->firstOrCreate([], [
            'tersedia_kolaborasi' => true,
            'total_poin' => 0,
        ]);

        $profileData = [
            'bio' => $validated['bio'] ?? null,
            'universitas' => $validated['universitas'] ?? null,
            'jurusan' => $validated['jurusan'] ?? null,
            'angkatan' => $validated['angkatan'] ?? null,
            'semester' => $validated['semester'] ?? null,
            'skill' => $validated['skill'] ?? [],
            'minat' => $validated['minat'] ?? [],
            'instagram' => $validated['instagram'] ?? null,
            'linkedin' => $validated['linkedin'] ?? null,
            'github' => $validated['github'] ?? null,
            'behance' => $validated['behance'] ?? null,
            'portfolio' => $validated['portfolio'] ?? null,
            'tersedia_kolaborasi' => $request->boolean('tersedia_kolaborasi'),
        ];

        if ($request->hasFile('foto')) {
            if ($mahasiswa->foto) {
                Storage::disk('public')->delete($mahasiswa->foto);
            }

            $profileData['foto'] = $request->file('foto')->store('profile', 'public');
        }

        $mahasiswa->update($profileData);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profil berhasil diperbarui.']);

        return back();
    }
}
