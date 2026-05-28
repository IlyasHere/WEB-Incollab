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
        Schema::create('laporan_pengaduan', function (Blueprint $table) {
            $table->id('laporan_id');
            $table->unsignedBigInteger('mhs_id');
            $table->unsignedBigInteger('admin_id')->nullable();

            $table->text('isi_laporan')->nullable();
            $table->string('status_laporan', 50)->nullable();
            $table->timestamps();

            $table->foreign('mhs_id')
                ->references('mhs_id')
                ->on('mahasiswa')
                ->onDelete('cascade');

            $table->foreign('admin_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_pengaduan');
    }
};
