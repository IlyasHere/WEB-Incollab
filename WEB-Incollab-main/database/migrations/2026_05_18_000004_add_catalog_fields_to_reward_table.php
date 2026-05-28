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
            if (! Schema::hasColumn('reward', 'kategori_reward')) {
                $table->string('kategori_reward', 50)->nullable()->after('nama_reward');
            }

            if (! Schema::hasColumn('reward', 'deskripsi')) {
                $table->text('deskripsi')->nullable()->after('stok');
            }

            if (! Schema::hasColumn('reward', 'gambar')) {
                $table->json('gambar')->nullable()->after('deskripsi');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reward', function (Blueprint $table) {
            foreach (['kategori_reward', 'deskripsi', 'gambar'] as $column) {
                if (Schema::hasColumn('reward', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
