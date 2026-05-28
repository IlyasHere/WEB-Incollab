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
        Schema::table('mahasiswa', function (Blueprint $table) {
            foreach (['behance', 'tersedia_kolaborasi'] as $column) {
                if (Schema::hasColumn('mahasiswa', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            if (! Schema::hasColumn('mahasiswa', 'behance')) {
                $table->string('behance')->nullable()->after('github');
            }

            if (! Schema::hasColumn('mahasiswa', 'tersedia_kolaborasi')) {
                $table->boolean('tersedia_kolaborasi')->default(true)->after('portfolio');
            }
        });
    }
};
