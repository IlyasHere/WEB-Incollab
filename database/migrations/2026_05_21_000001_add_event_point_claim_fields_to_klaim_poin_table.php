<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('klaim_poin', function (Blueprint $table) {
            $table->string('nama_lengkap', 150)->nullable()->after('tanggal_klaim');
            $table->string('nim_user', 30)->nullable()->after('nama_lengkap');
            $table->string('nama_event', 150)->nullable()->after('nim_user');
            $table->date('tanggal_mengikuti_event')->nullable()->after('nama_event');
            $table->string('nama_sertifikat', 150)->nullable()->after('tanggal_mengikuti_event');
            $table->text('catatan_user')->nullable()->after('file_bukti');
            $table->text('alasan_penolakan')->nullable()->after('catatan_admin');
            $table->timestamp('poin_diberikan_at')->nullable()->after('alasan_penolakan');
            $table->unique(['mhs_id', 'event_id'], 'klaim_poin_mhs_event_unique');
        });
    }

    public function down(): void
    {
        Schema::table('klaim_poin', function (Blueprint $table) {
            $table->dropUnique('klaim_poin_mhs_event_unique');
            $table->dropColumn([
                'nama_lengkap',
                'nim_user',
                'nama_event',
                'tanggal_mengikuti_event',
                'nama_sertifikat',
                'catatan_user',
                'alasan_penolakan',
                'poin_diberikan_at',
            ]);
        });
    }
};
