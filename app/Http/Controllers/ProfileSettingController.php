<?php

namespace App\Http\Controllers;

use App\Models\University;
use Closure;
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
            'total_poin' => 0,
        ]);

        $user->load('mahasiswa');

        return Inertia::render('pengaturan', [
            'profileUser' => $user,
            'mahasiswa' => $mahasiswa,
            'universities' => University::query()
                ->orderBy('name')
                ->get(['name', 'lldikti_region']),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'universitas' => [
                'nullable',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail): void {
                    if (! self::isKnownUniversity((string) $value)) {
                        $fail('Universitas yang dipilih tidak valid.');
                    }
                },
            ],
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
            'portfolio' => ['nullable', 'string', 'max:255'],
            'foto' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        $user->update([
            'name' => $validated['name'],
        ]);

        $mahasiswa = $user->mahasiswa()->firstOrCreate([], [
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
            'portfolio' => $validated['portfolio'] ?? null,
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

    private static function isKnownUniversity(string $value): bool
    {
        $name = self::cleanUniversityName($value);

        if ($name === '') {
            return true;
        }

        if (University::query()->where('name', $name)->exists()) {
            return true;
        }

        return isset(self::csvUniversityNames()[mb_strtolower($name)]);
    }

    /**
     * @return array<string, true>
     */
    private static function csvUniversityNames(): array
    {
        static $names = null;

        if (is_array($names)) {
            return $names;
        }

        $names = [];
        $path = database_path('data/perguruan-tinggi.csv');

        if (! file_exists($path)) {
            return $names;
        }

        $handle = fopen($path, 'r');

        if ($handle === false) {
            return $names;
        }

        fgetcsv($handle, 0, ',', '"', '\\');

        while (($record = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
            $name = self::cleanUniversityName($record[1] ?? '');

            if ($name !== '') {
                $names[mb_strtolower($name)] = true;
            }
        }

        fclose($handle);

        return $names;
    }

    private static function cleanUniversityName(string $value): string
    {
        return trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($value), ENT_QUOTES)) ?? '');
    }
}
