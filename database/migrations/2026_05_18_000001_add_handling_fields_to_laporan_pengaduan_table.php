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
        Schema::table('laporan_pengaduan', function (Blueprint $table) {
            if (! Schema::hasColumn('laporan_pengaduan', 'kategori_laporan')) {
                $table->string('kategori_laporan', 100)->nullable()->after('admin_id');
            }

            if (! Schema::hasColumn('laporan_pengaduan', 'catatan_admin')) {
                $table->text('catatan_admin')->nullable()->after('status_laporan');
            }

            if (! Schema::hasColumn('laporan_pengaduan', 'ditangani_pada')) {
                $table->timestamp('ditangani_pada')->nullable()->after('catatan_admin');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('laporan_pengaduan', function (Blueprint $table) {
            foreach (['kategori_laporan', 'catatan_admin', 'ditangani_pada'] as $column) {
                if (Schema::hasColumn('laporan_pengaduan', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
