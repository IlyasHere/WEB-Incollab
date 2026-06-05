<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! $this->hasIndex('klaim_poin', 'klaim_poin_mhs_event_status_index')) {
            Schema::table('klaim_poin', function ($table) {
                $table->index(['mhs_id', 'event_id', 'status_klaim'], 'klaim_poin_mhs_event_status_index');
            });
        }

        if ($this->hasIndex('klaim_poin', 'klaim_poin_mhs_event_unique')) {
            Schema::table('klaim_poin', function ($table) {
                $table->dropUnique('klaim_poin_mhs_event_unique');
            });
        }
    }

    public function down(): void
    {
        if (! $this->hasIndex('klaim_poin', 'klaim_poin_mhs_event_unique')) {
            Schema::table('klaim_poin', function ($table) {
                $table->unique(['mhs_id', 'event_id'], 'klaim_poin_mhs_event_unique');
            });
        }

        if ($this->hasIndex('klaim_poin', 'klaim_poin_mhs_event_status_index')) {
            Schema::table('klaim_poin', function ($table) {
                $table->dropIndex('klaim_poin_mhs_event_status_index');
            });
        }
    }

    private function hasIndex(string $table, string $index): bool
    {
        return Schema::hasIndex($table, $index);
    }
};
