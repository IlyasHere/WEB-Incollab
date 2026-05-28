<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('penukaran_poin', function (Blueprint $table) {
            if (! Schema::hasColumn('penukaran_poin', 'kode_penukaran')) {
                $table
                    ->string('kode_penukaran', 32)
                    ->nullable()
                    ->unique()
                    ->after('status_penukaran');
            }
        });

        DB::table('penukaran_poin')
            ->whereNull('kode_penukaran')
            ->orderBy('penukaran_id')
            ->get(['penukaran_id'])
            ->each(function (object $redemption): void {
                do {
                    $code = 'RDM-'.now()->format('ymd').'-'.Str::upper(Str::random(6));
                } while (DB::table('penukaran_poin')->where('kode_penukaran', $code)->exists());

                DB::table('penukaran_poin')
                    ->where('penukaran_id', $redemption->penukaran_id)
                    ->update(['kode_penukaran' => $code]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('penukaran_poin', function (Blueprint $table) {
            if (Schema::hasColumn('penukaran_poin', 'kode_penukaran')) {
                $table->dropUnique('penukaran_poin_kode_penukaran_unique');
                $table->dropColumn('kode_penukaran');
            }
        });
    }
};
