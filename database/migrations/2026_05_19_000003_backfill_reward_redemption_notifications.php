<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('penukaran_poin')
            ->join('mahasiswa', 'penukaran_poin.mhs_id', '=', 'mahasiswa.mhs_id')
            ->join('reward', 'penukaran_poin.reward_id', '=', 'reward.reward_id')
            ->select([
                'penukaran_poin.penukaran_id',
                'penukaran_poin.created_at',
                'mahasiswa.user_id',
                'reward.nama_reward',
            ])
            ->orderBy('penukaran_poin.penukaran_id')
            ->get()
            ->each(function (object $redemption): void {
                $alreadyExists = DB::table('notifications')
                    ->where('user_id', $redemption->user_id)
                    ->where('type', 'reward')
                    ->where('url', '/pengaturan/riwayat-poin')
                    ->where('title', 'Reward berhasil ditukar')
                    ->where('created_at', $redemption->created_at)
                    ->exists();

                if ($alreadyExists) {
                    return;
                }

                DB::table('notifications')->insert([
                    'user_id' => $redemption->user_id,
                    'type' => 'reward',
                    'title' => 'Reward berhasil ditukar',
                    'body' => 'Penukaran '.$redemption->nama_reward.' berhasil. Kode penukaran sudah tersedia di riwayat poin.',
                    'url' => '/pengaturan/riwayat-poin',
                    'read_at' => null,
                    'created_at' => $redemption->created_at,
                    'updated_at' => $redemption->created_at,
                ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('notifications')
            ->where('type', 'reward')
            ->where('title', 'Reward berhasil ditukar')
            ->where('url', '/pengaturan/riwayat-poin')
            ->delete();
    }
};
