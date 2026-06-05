<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reward', function (Blueprint $table) {
            if (! Schema::hasColumn('reward', 'lokasi_penukaran')) {
                $table->string('lokasi_penukaran', 255)->nullable()->after('gambar');
            }

            if (! Schema::hasColumn('reward', 'instruksi_penukaran')) {
                $table->text('instruksi_penukaran')->nullable()->after('lokasi_penukaran');
            }

            if (! Schema::hasColumn('reward', 'berlaku_hari')) {
                $table->unsignedSmallInteger('berlaku_hari')->default(30)->after('instruksi_penukaran');
            }
        });

        Schema::table('penukaran_poin', function (Blueprint $table) {
            if (! Schema::hasColumn('penukaran_poin', 'expires_at')) {
                $table->date('expires_at')->nullable()->after('kode_penukaran');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penukaran_poin', function (Blueprint $table) {
            if (Schema::hasColumn('penukaran_poin', 'expires_at')) {
                $table->dropColumn('expires_at');
            }
        });

        Schema::table('reward', function (Blueprint $table) {
            foreach (['lokasi_penukaran', 'instruksi_penukaran', 'berlaku_hari'] as $column) {
                if (Schema::hasColumn('reward', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
