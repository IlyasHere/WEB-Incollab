<?php

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('non admin users are redirected away from the admin event page', function () {
    $user = User::factory()->create([
        'role' => 'mahasiswa',
    ]);

    $this->actingAs($user)
        ->get(route('admin.event'))
        ->assertRedirect(route('dashboard'));
});

test('admins can open the create and edit event pages', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $event = Event::query()->create([
        'admin_id' => $admin->getKey(),
        'judul_event' => 'Editable Event',
        'deskripsi_event' => 'Editable description',
        'tanggal_event' => '2026-11-15',
        'tanggal_selesai' => '2026-11-16',
        'lokasi' => 'Bandung',
        'kategori_event' => 'Workshop',
        'poin_event' => 50,
        'status_event' => 'Open',
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
        'penyelenggara' => 'DesignHub',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.event.create'))
        ->assertOk();

    $this->actingAs($admin)
        ->get(route('admin.event.edit', $event))
        ->assertOk();
});

test('admins can create events from the admin panel', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $payload = [
        'judul_event' => 'Global Tech & AI Hackathon 2026',
        'deskripsi_event' => 'Kompetisi teknologi nasional untuk mahasiswa.',
        'tanggal_event' => '2026-10-24',
        'tanggal_selesai' => '2026-10-26',
        'lokasi' => 'Online (Discord & Zoom)',
        'kategori_event' => 'Hackathon',
        'poin_event' => 150,
        'link_pendaftaran' => 'https://example.com/events/global-tech-ai',
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
        'poster_event' => UploadedFile::fake()->image('card.jpg'),
        'detail_poster_event' => UploadedFile::fake()->image('detail.jpg'),
        'penyelenggara' => 'Google Developer Student Clubs',
    ];

    $this->actingAs($admin)
        ->post(route('admin.event.store'), $payload)
        ->assertRedirect(route('admin.event'));

    $this->assertDatabaseHas('event', [
        'judul_event' => $payload['judul_event'],
        'admin_id' => $admin->getKey(),
        'kategori_event' => $payload['kategori_event'],
        'penyelenggara' => $payload['penyelenggara'],
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
    ]);

    $event = Event::query()->where('judul_event', $payload['judul_event'])->first();

    expect($event)->not->toBeNull();

    Storage::disk('public')->assertExists($event->poster_event);
    Storage::disk('public')->assertExists($event->detail_poster_event);
});

test('admins can create coming soon events without registration link', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $payload = [
        'judul_event' => 'Coming Soon Event',
        'deskripsi_event' => 'Segera hadir.',
        'tanggal_event' => '2026-12-20',
        'tanggal_selesai' => '',
        'lokasi' => '',
        'kategori_event' => 'Seminar',
        'poin_event' => 0,
        'link_pendaftaran' => '',
        'visibility_status' => 'Draft',
        'registration_status' => 'Coming Soon',
        'poster_event' => UploadedFile::fake()->image('coming-card.jpg'),
        'detail_poster_event' => UploadedFile::fake()->image('coming-detail.jpg'),
        'penyelenggara' => 'InCollab',
    ];

    $this->actingAs($admin)
        ->post(route('admin.event.store'), $payload)
        ->assertRedirect(route('admin.event'));

    $this->assertDatabaseHas('event', [
        'judul_event' => 'Coming Soon Event',
        'visibility_status' => 'Draft',
        'registration_status' => 'Coming Soon',
        'link_pendaftaran' => null,
    ]);
});

test('authenticated users can open the published event detail page', function () {
    $user = User::factory()->create([
        'role' => 'mahasiswa',
    ]);

    $event = Event::query()->create([
        'admin_id' => $user->getKey(),
        'judul_event' => 'UI/UX Design Masterclass',
        'deskripsi_event' => 'Belajar desain produk dari nol.',
        'tanggal_event' => '2026-11-15',
        'tanggal_selesai' => '2026-11-15',
        'lokasi' => 'ITB',
        'kategori_event' => 'Workshop',
        'poin_event' => 50,
        'status_event' => 'Open',
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
        'penyelenggara' => 'DesignHub',
    ]);

    $this->actingAs($user)
        ->get(route('event.show', $event))
        ->assertOk();
});

test('non admin users cannot open draft event detail page', function () {
    $user = User::factory()->create([
        'role' => 'mahasiswa',
    ]);

    $event = Event::query()->create([
        'admin_id' => $user->getKey(),
        'judul_event' => 'Draft Event',
        'tanggal_event' => '2026-12-01',
        'kategori_event' => 'Seminar',
        'status_event' => 'Coming Soon',
        'visibility_status' => 'Draft',
        'registration_status' => 'Coming Soon',
        'penyelenggara' => 'InCollab',
    ]);

    $this->actingAs($user)
        ->get(route('event.show', $event))
        ->assertNotFound();
});

test('admins can update events from the admin panel', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $event = Event::query()->create([
        'admin_id' => $admin->getKey(),
        'judul_event' => 'Old Event',
        'deskripsi_event' => 'Old description',
        'tanggal_event' => '2026-11-10',
        'tanggal_selesai' => '2026-11-11',
        'lokasi' => 'Old location',
        'kategori_event' => 'Seminar',
        'poin_event' => 20,
        'link_pendaftaran' => 'https://example.com/old',
        'status_event' => 'Open',
        'visibility_status' => 'Draft',
        'registration_status' => 'Coming Soon',
        'poster_event' => UploadedFile::fake()->image('old-card.jpg')->store('events/cards', 'public'),
        'detail_poster_event' => UploadedFile::fake()->image('old-detail.jpg')->store('events/details', 'public'),
        'penyelenggara' => 'Old organizer',
    ]);

    $oldPoster = $event->poster_event;
    $oldDetailPoster = $event->detail_poster_event;

    $payload = [
        'judul_event' => 'Updated Event',
        'deskripsi_event' => 'Updated description',
        'tanggal_event' => '2026-12-01',
        'tanggal_selesai' => '2026-12-03',
        'lokasi' => 'New location',
        'kategori_event' => 'Hackathon',
        'poin_event' => 99,
        'link_pendaftaran' => 'https://example.com/new',
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
        'poster_event' => UploadedFile::fake()->image('new-card.jpg'),
        'detail_poster_event' => UploadedFile::fake()->image('new-detail.jpg'),
        'penyelenggara' => 'New organizer',
    ];

    $this->actingAs($admin)
        ->post(route('admin.event.update', $event), $payload)
        ->assertRedirect(route('admin.event'));

    $event->refresh();

    expect($event->judul_event)->toBe('Updated Event');
    expect($event->kategori_event)->toBe('Hackathon');
    expect($event->visibility_status)->toBe('Published');
    expect($event->registration_status)->toBe('Open');

    Storage::disk('public')->assertMissing($oldPoster);
    Storage::disk('public')->assertMissing($oldDetailPoster);
    Storage::disk('public')->assertExists($event->poster_event);
    Storage::disk('public')->assertExists($event->detail_poster_event);
});

test('closed events can only change visibility', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $event = Event::query()->create([
        'admin_id' => $admin->getKey(),
        'judul_event' => 'Closed Event',
        'deskripsi_event' => 'Old description',
        'tanggal_event' => '2026-11-10',
        'tanggal_selesai' => '2026-11-11',
        'lokasi' => 'Old location',
        'kategori_event' => 'Seminar',
        'poin_event' => 20,
        'link_pendaftaran' => 'https://example.com/old',
        'status_event' => 'Closed',
        'visibility_status' => 'Draft',
        'registration_status' => 'Closed',
        'penyelenggara' => 'Old organizer',
    ]);

    $this->actingAs($admin)
        ->from(route('admin.event.edit', $event))
        ->post(route('admin.event.update', $event), [
            'judul_event' => 'Should Not Change',
            'deskripsi_event' => 'New description',
            'tanggal_event' => '2026-12-01',
            'tanggal_selesai' => '2026-12-02',
            'lokasi' => 'New location',
            'kategori_event' => 'Hackathon',
            'poin_event' => 999,
            'link_pendaftaran' => 'https://example.com/new',
            'visibility_status' => 'Published',
            'registration_status' => 'Open',
            'penyelenggara' => 'New organizer',
        ])
        ->assertRedirect(route('admin.event.edit', $event))
        ->assertSessionHasErrors(['judul_event', 'registration_status']);

    $event->refresh();

    expect($event->judul_event)->toBe('Closed Event');
    expect($event->visibility_status)->toBe('Draft');
    expect($event->registration_status)->toBe('Closed');
});

test('closed events can still update visibility only', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $event = Event::query()->create([
        'admin_id' => $admin->getKey(),
        'judul_event' => 'Closed Event Visibility',
        'deskripsi_event' => 'Old description',
        'tanggal_event' => '2026-11-10',
        'tanggal_selesai' => '2026-11-11',
        'lokasi' => 'Old location',
        'kategori_event' => 'Seminar',
        'poin_event' => 20,
        'link_pendaftaran' => null,
        'status_event' => 'Closed',
        'visibility_status' => 'Draft',
        'registration_status' => 'Closed',
        'penyelenggara' => 'Old organizer',
    ]);

    $response = $this->actingAs($admin)
        ->post(route('admin.event.update', $event), [
            'judul_event' => 'Closed Event Visibility',
            'deskripsi_event' => 'Old description',
            'tanggal_event' => '2026-11-10',
            'tanggal_selesai' => '2026-11-11',
            'lokasi' => 'Old location',
            'kategori_event' => 'Seminar',
            'poin_event' => 20,
            'link_pendaftaran' => '',
            'visibility_status' => 'Published',
            'registration_status' => 'Closed',
            'penyelenggara' => 'Old organizer',
        ]);

    $response->assertStatus(302);

    $event->refresh();

    expect($event->visibility_status)->toBe('Published');
    expect($event->registration_status)->toBe('Closed');
    expect($event->judul_event)->toBe('Closed Event Visibility');
});

test('admins can delete events from the admin panel', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    $event = Event::query()->create([
        'admin_id' => $admin->getKey(),
        'judul_event' => 'Delete Me',
        'deskripsi_event' => 'Delete description',
        'tanggal_event' => '2026-11-10',
        'tanggal_selesai' => '2026-11-11',
        'lokasi' => 'Delete location',
        'kategori_event' => 'Seminar',
        'poin_event' => 20,
        'link_pendaftaran' => 'https://example.com/delete',
        'status_event' => 'Open',
        'visibility_status' => 'Published',
        'registration_status' => 'Open',
        'poster_event' => UploadedFile::fake()->image('delete-card.jpg')->store('events/cards', 'public'),
        'detail_poster_event' => UploadedFile::fake()->image('delete-detail.jpg')->store('events/details', 'public'),
        'penyelenggara' => 'Delete organizer',
    ]);

    $poster = $event->poster_event;
    $detailPoster = $event->detail_poster_event;

    $this->actingAs($admin)
        ->delete(route('admin.event.destroy', $event))
        ->assertRedirect(route('admin.event'));

    $this->assertDatabaseMissing('event', [
        'event_id' => $event->getKey(),
    ]);

    Storage::disk('public')->assertMissing($poster);
    Storage::disk('public')->assertMissing($detailPoster);
});
