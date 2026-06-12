<?php

use App\Models\Mahasiswa;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createDashboardPartner(string $name, array $mahasiswa = [], array $user = []): User
{
    $partner = User::factory()->create([
        'name' => $name,
        'role' => $user['role'] ?? 'mahasiswa',
        'avatar' => $user['avatar'] ?? null,
        ...$user,
    ]);

    if (($mahasiswa['skip'] ?? false) === true) {
        return $partner;
    }

    Mahasiswa::query()->create([
        'user_id' => $partner->user_id,
        'universitas' => $mahasiswa['universitas'] ?? 'Universitas Telkom',
        'jurusan' => $mahasiswa['jurusan'] ?? 'S1 Informatika',
        'skill' => $mahasiswa['skill'] ?? [],
        'minat' => $mahasiswa['minat'] ?? [],
        'foto' => $mahasiswa['foto'] ?? null,
        'total_poin' => $mahasiswa['total_poin'] ?? 0,
    ]);

    return $partner->refresh();
}

test('dashboard recommends partners by matching skills and interests', function () {
    $currentUser = createDashboardPartner('Current User', [
        'skill' => [' UIUX ', 'Frontend', 'MEMBACA', 'UIUX'],
        'minat' => ['Teknologi', 'Desain', 'Bisnis'],
    ]);

    $bestMatch = createDashboardPartner('Alya Match', [
        'skill' => ['uiux', 'frontend'],
        'minat' => ['teknologi', 'desain'],
        'jurusan' => 'S1 Data Sains',
        'universitas' => 'Universitas Indonesia',
        'foto' => 'profile/alya.jpg',
    ]);

    $skillAndInterestMatch = createDashboardPartner('Bima Match', [
        'skill' => ['DevOps', 'UIUX'],
        'minat' => ['Bisnis'],
    ]);

    $skillOnlyMatch = createDashboardPartner('Citra Match', [
        'skill' => ['membaca'],
        'minat' => ['Sains'],
    ]);

    $interestOnlyMatch = createDashboardPartner('Dimas Match', [
        'skill' => ['Backend'],
        'minat' => ['Teknologi'],
    ]);

    $olderNoMatch = createDashboardPartner('Eka No Match', [
        'skill' => ['Mobile'],
        'minat' => ['Seni'],
    ]);

    $newerNoMatch = createDashboardPartner('Fajar No Match', [
        'skip' => true,
    ]);

    createDashboardPartner('Admin Hidden', [
        'skill' => ['UIUX', 'Frontend'],
        'minat' => ['Teknologi', 'Desain', 'Bisnis'],
    ], [
        'role' => 'admin',
    ]);

    $response = $this->actingAs($currentUser)->get(route('dashboard'));

    $response
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('partners', 5)
            ->where('partners.0.id', $bestMatch->user_id)
            ->where('partners.0.name', 'Alya Match')
            ->where('partners.0.role', 'S1 Data Sains')
            ->where('partners.0.campus', 'Universitas Indonesia')
            ->where('partners.0.avatar', asset('storage/profile/alya.jpg'))
            ->where('partners.0.profileUrl', route('profile.show', $bestMatch))
            ->where('partners.1.id', $skillAndInterestMatch->user_id)
            ->where('partners.2.id', $skillOnlyMatch->user_id)
            ->where('partners.3.id', $interestOnlyMatch->user_id)
            ->where('partners.4.id', $newerNoMatch->user_id)
        );

    $partnerNames = collect($response->viewData('page')['props']['partners'])
        ->pluck('name')
        ->all();

    expect($partnerNames)->toBe([
        'Alya Match',
        'Bima Match',
        'Citra Match',
        'Dimas Match',
        'Fajar No Match',
    ]);

    expect($olderNoMatch->user_id)->toBeLessThan($newerNoMatch->user_id);
});

test('dashboard partner recommendations exclude the signed in user and admins', function () {
    $currentUser = createDashboardPartner('Current User', [
        'skill' => ['UIUX'],
        'minat' => ['Teknologi'],
    ]);

    $partner = createDashboardPartner('Visible Partner', [
        'skill' => ['UIUX'],
        'minat' => ['Teknologi'],
    ]);

    $admin = createDashboardPartner('Hidden Admin', [
        'skill' => ['UIUX'],
        'minat' => ['Teknologi'],
    ], [
        'role' => 'admin',
    ]);

    $response = $this->actingAs($currentUser)->get(route('dashboard'));

    $response->assertOk();

    $partnerIds = collect($response->viewData('page')['props']['partners'])
        ->pluck('id')
        ->all();

    expect($partnerIds)
        ->toContain($partner->user_id)
        ->not->toContain($currentUser->user_id)
        ->not->toContain($admin->user_id);
});

test('dashboard partner recommendations use fallback profile text when mahasiswa data is missing', function () {
    $currentUser = createDashboardPartner('Current User', [
        'skill' => ['UIUX'],
        'minat' => ['Teknologi'],
    ]);

    $partnerWithoutProfile = createDashboardPartner('Incomplete Partner', [
        'skip' => true,
    ], [
        'avatar' => 'https://example.com/avatar.jpg',
    ]);

    $this->actingAs($currentUser)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('partners.0.id', $partnerWithoutProfile->user_id)
            ->where('partners.0.role', 'Mahasiswa')
            ->where('partners.0.campus', 'Kampus belum diisi')
            ->where('partners.0.avatar', 'https://example.com/avatar.jpg')
        );
});
