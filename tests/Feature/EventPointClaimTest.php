<?php

use App\Models\Event;
use App\Models\KlaimPoin;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

function createClaimEvent(User $admin): Event
{
    return Event::query()->create([
        'admin_id' => $admin->getKey(),
        'judul_event' => 'Seminar UI/UX',
        'deskripsi_event' => 'Belajar UI/UX bersama praktisi.',
        'tanggal_event' => '2026-06-10',
        'tanggal_selesai' => '2026-06-10',
        'lokasi' => 'Online',
        'kategori_event' => 'Seminar',
        'poin_event' => 50,
        'link_pendaftaran' => 'https://example.com/register',
        'status_event' => 'Open',
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
        'penyelenggara' => 'InCollab',
    ]);
}

function createMahasiswaUser(array $mahasiswaOverrides = []): User
{
    $user = User::factory()->create([
        'role' => 'mahasiswa',
        'name' => 'Budi Santoso',
    ]);

    Mahasiswa::query()->create([
        'user_id' => $user->user_id,
        'nim' => $mahasiswaOverrides['nim'] ?? '1234567890',
        'total_poin' => $mahasiswaOverrides['total_poin'] ?? 0,
    ]);

    return $user;
}

test('mahasiswa can submit one event point claim with certificate proof', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $user = createMahasiswaUser();
    $event = createClaimEvent($admin);

    $this->actingAs($user)
        ->post(route('event-point-claim.event.store', $event), [
            'nama_lengkap' => 'Budi Santoso',
            'nim_user' => '1234567890',
            'tanggal_mengikuti_event' => '2026-06-10',
            'nama_sertifikat' => 'Budi Santoso',
            'file_bukti' => UploadedFile::fake()->create('sertifikat.pdf', 500, 'application/pdf'),
            'catatan_user' => 'Saya mengikuti sesi sampai selesai.',
        ])
        ->assertRedirect(route('event.show', $event));

    $claim = KlaimPoin::query()->firstOrFail();

    expect($claim->status_klaim)->toBe('Menunggu Verifikasi');
    expect($claim->nama_event)->toBe('Seminar UI/UX');
    Storage::disk('public')->assertExists($claim->file_bukti);
});

test('mahasiswa cannot submit duplicate claims for the same event', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $user = createMahasiswaUser();
    $event = createClaimEvent($admin);
    $mahasiswa = $user->mahasiswa;

    KlaimPoin::query()->create([
        'mhs_id' => $mahasiswa->mhs_id,
        'event_id' => $event->event_id,
        'tanggal_klaim' => now()->toDateString(),
        'nama_lengkap' => 'Budi Santoso',
        'nim_user' => '1234567890',
        'nama_event' => $event->judul_event,
        'tanggal_mengikuti_event' => '2026-06-10',
        'nama_sertifikat' => 'Budi Santoso',
        'file_bukti' => 'event-point-claims/old.pdf',
        'status_klaim' => 'Menunggu Verifikasi',
    ]);

    $this->actingAs($user)
        ->from(route('event-point-claim.event.create', $event))
        ->post(route('event-point-claim.event.store', $event), [
            'nama_lengkap' => 'Budi Santoso',
            'nim_user' => '1234567890',
            'tanggal_mengikuti_event' => '2026-06-10',
            'nama_sertifikat' => 'Budi Santoso',
            'file_bukti' => UploadedFile::fake()->image('sertifikat.png'),
        ])
        ->assertRedirect(route('event-point-claim.event.create', $event))
        ->assertSessionHasErrors('event');

    expect(KlaimPoin::count())->toBe(1);
});

test('mahasiswa can resubmit claim after previous claim was rejected', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => 'admin']);
    $user = createMahasiswaUser();
    $event = createClaimEvent($admin);
    $mahasiswa = $user->mahasiswa;

    KlaimPoin::query()->create([
        'mhs_id' => $mahasiswa->mhs_id,
        'event_id' => $event->event_id,
        'tanggal_klaim' => now()->toDateString(),
        'nama_lengkap' => 'Budi Santoso',
        'nim_user' => '1234567890',
        'nama_event' => $event->judul_event,
        'tanggal_mengikuti_event' => '2026-06-10',
        'nama_sertifikat' => 'Budi Santoso',
        'file_bukti' => 'event-point-claims/rejected.pdf',
        'status_klaim' => 'Ditolak',
        'alasan_penolakan' => 'File tidak terbaca.',
    ]);

    $this->actingAs($user)
        ->post(route('event-point-claim.event.store', $event), [
            'nama_lengkap' => 'Budi Santoso',
            'nim_user' => '1234567890',
            'tanggal_mengikuti_event' => '2026-06-10',
            'nama_sertifikat' => 'Budi Santoso',
            'file_bukti' => UploadedFile::fake()->image('sertifikat-baru.png'),
        ])
        ->assertRedirect(route('event.show', $event));

    expect(KlaimPoin::count())->toBe(2);
    expect(KlaimPoin::latest('klaim_id')->first()->status_klaim)->toBe('Menunggu Verifikasi');
});

test('admin approval adds event points only once', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = createMahasiswaUser();
    $event = createClaimEvent($admin);
    $mahasiswa = $user->mahasiswa;

    $claim = KlaimPoin::query()->create([
        'mhs_id' => $mahasiswa->mhs_id,
        'event_id' => $event->event_id,
        'tanggal_klaim' => now()->toDateString(),
        'nama_lengkap' => 'Budi Santoso',
        'nim_user' => '1234567890',
        'nama_event' => $event->judul_event,
        'tanggal_mengikuti_event' => '2026-06-10',
        'nama_sertifikat' => 'Budi Santoso',
        'file_bukti' => 'event-point-claims/sertifikat.pdf',
        'status_klaim' => 'Menunggu Verifikasi',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.poin.approve', $claim))
        ->assertRedirect(route('admin.poin'));

    $this->actingAs($admin)
        ->post(route('admin.poin.approve', $claim))
        ->assertRedirect(route('admin.poin'));

    $mahasiswa->refresh();
    $claim->refresh();

    expect($mahasiswa->total_poin)->toBe(50);
    expect($claim->status_klaim)->toBe('Diterima');
    expect($claim->poin_diberikan_at)->not->toBeNull();
});

test('admin must provide rejection reason and accepted claims cannot be rejected', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = createMahasiswaUser();
    $event = createClaimEvent($admin);
    $mahasiswa = $user->mahasiswa;

    $claim = KlaimPoin::query()->create([
        'mhs_id' => $mahasiswa->mhs_id,
        'event_id' => $event->event_id,
        'tanggal_klaim' => now()->toDateString(),
        'nama_lengkap' => 'Budi Santoso',
        'nim_user' => '1234567890',
        'nama_event' => $event->judul_event,
        'tanggal_mengikuti_event' => '2026-06-10',
        'nama_sertifikat' => 'Budi Santoso',
        'file_bukti' => 'event-point-claims/sertifikat.pdf',
        'status_klaim' => 'Menunggu Verifikasi',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.poin.reject', $claim), [
            'alasan_penolakan' => '',
        ])
        ->assertSessionHasErrors('alasan_penolakan');

    $this->actingAs($admin)
        ->post(route('admin.poin.reject', $claim), [
            'alasan_penolakan' => 'Nama di sertifikat tidak sesuai.',
        ])
        ->assertRedirect(route('admin.poin'));

    $claim->refresh();

    expect($claim->status_klaim)->toBe('Ditolak');
    expect($claim->alasan_penolakan)->toBe('Nama di sertifikat tidak sesuai.');
});
