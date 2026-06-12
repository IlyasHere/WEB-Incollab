<?php

use App\Models\Mahasiswa;
use App\Models\PenukaranPoin;
use App\Models\Reward;
use App\Models\User;
use Inertia\Support\SessionKey;

function createRewardRedeemMahasiswa(int $points): array
{
    $user = User::factory()->create([
        'role' => 'mahasiswa',
    ]);

    $mahasiswa = Mahasiswa::query()->create([
        'user_id' => $user->user_id,
        'total_poin' => $points,
    ]);

    return [$user, $mahasiswa];
}

function createRewardRedeemReward(array $overrides = []): Reward
{
    $admin = User::factory()->create([
        'role' => 'admin',
    ]);

    return Reward::query()->create([
        'admin_id' => $admin->user_id,
        'nama_reward' => 'Voucher Kopi InCollab',
        'kategori_reward' => 'voucher',
        'poin_dibutuhkan' => 100,
        'stok' => 3,
        'deskripsi' => 'Voucher untuk white box test redeem reward.',
        'gambar' => [],
        'lokasi_penukaran' => 'Kantin Kampus',
        'instruksi_penukaran' => 'Tunjukkan kode penukaran ke kasir.',
        'berlaku_hari' => 14,
        ...$overrides,
    ]);
}

test('mahasiswa berhasil redeem reward saat poin cukup dan stok tersedia', function () {
    [$user, $mahasiswa] = createRewardRedeemMahasiswa(points: 150);
    $reward = createRewardRedeemReward([
        'poin_dibutuhkan' => 100,
        'stok' => 2,
    ]);

    $this->actingAs($user)
        ->post(route('tukar-poin.redeem', $reward))
        ->assertRedirect(route('tukar-poin'))
        ->assertSessionHas(SessionKey::FLASH_DATA, [
            'toast' => [
                'type' => 'success',
                'message' => 'Reward berhasil ditukar. Riwayat penukaran sudah dicatat.',
            ],
        ]);

    $mahasiswa->refresh();
    $reward->refresh();

    expect($mahasiswa->total_poin)->toBe(50);
    expect($reward->stok)->toBe(1);
    expect(PenukaranPoin::query()->count())->toBe(1);

    $redemption = PenukaranPoin::query()->firstOrFail();

    expect($redemption->mhs_id)->toBe($mahasiswa->mhs_id);
    expect($redemption->reward_id)->toBe($reward->reward_id);
    expect($redemption->jumlah_poin)->toBe(100);
    expect($redemption->status_penukaran)->toBe('Berhasil');
    expect($redemption->kode_penukaran)->toStartWith('VCHR-'.now()->format('ymd').'-');
    expect($redemption->expires_at)->toBe(now()->addDays(14)->toDateString());

    $this->assertDatabaseHas('notifications', [
        'user_id' => $user->user_id,
        'type' => 'reward',
        'title' => 'Reward berhasil ditukar',
    ]);
});

test('redeem ditolak saat stok reward habis', function () {
    [$user, $mahasiswa] = createRewardRedeemMahasiswa(points: 150);
    $reward = createRewardRedeemReward([
        'poin_dibutuhkan' => 100,
        'stok' => 0,
    ]);

    $this->actingAs($user)
        ->post(route('tukar-poin.redeem', $reward))
        ->assertRedirect(route('tukar-poin'))
        ->assertSessionHas(SessionKey::FLASH_DATA, [
            'toast' => [
                'type' => 'error',
                'message' => 'Stok reward sudah habis.',
            ],
        ]);

    $mahasiswa->refresh();
    $reward->refresh();

    expect($mahasiswa->total_poin)->toBe(150);
    expect($reward->stok)->toBe(0);
    expect(PenukaranPoin::query()->count())->toBe(0);

    $this->assertDatabaseMissing('notifications', [
        'user_id' => $user->user_id,
        'type' => 'reward',
    ]);
});

test('redeem ditolak saat poin mahasiswa kurang', function () {
    [$user, $mahasiswa] = createRewardRedeemMahasiswa(points: 75);
    $reward = createRewardRedeemReward([
        'poin_dibutuhkan' => 100,
        'stok' => 2,
    ]);

    $this->actingAs($user)
        ->post(route('tukar-poin.redeem', $reward))
        ->assertRedirect(route('tukar-poin'))
        ->assertSessionHas(SessionKey::FLASH_DATA, [
            'toast' => [
                'type' => 'error',
                'message' => 'Poin kamu belum cukup untuk menukar reward ini.',
            ],
        ]);

    $mahasiswa->refresh();
    $reward->refresh();

    expect($mahasiswa->total_poin)->toBe(75);
    expect($reward->stok)->toBe(2);
    expect(PenukaranPoin::query()->count())->toBe(0);

    $this->assertDatabaseMissing('notifications', [
        'user_id' => $user->user_id,
        'type' => 'reward',
    ]);
});
