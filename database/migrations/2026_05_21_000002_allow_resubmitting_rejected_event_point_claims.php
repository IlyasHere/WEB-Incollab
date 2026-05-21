<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('klaim_poin', function (Blueprint $table) {
            $table->dropUnique('klaim_poin_mhs_event_unique');
            $table->index(['mhs_id', 'event_id', 'status_klaim'], 'klaim_poin_mhs_event_status_index');
        });
    }

    public function down(): void
    {
        Schema::table('klaim_poin', function (Blueprint $table) {
            $table->dropIndex('klaim_poin_mhs_event_status_index');
            $table->unique(['mhs_id', 'event_id'], 'klaim_poin_mhs_event_unique');
        });
    }
};
