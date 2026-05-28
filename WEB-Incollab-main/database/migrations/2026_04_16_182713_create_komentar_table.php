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
        Schema::create('komentar', function (Blueprint $table) {
            $table->id('komentar_id');
            $table->unsignedBigInteger('mhs_id');
            $table->unsignedBigInteger('event_id');
            $table->text('isi_komentar');
            $table->timestamp('tanggal_komentar')->useCurrent();

            $table->foreign('mhs_id')
                ->references('mhs_id')
                ->on('mahasiswa')
                ->onDelete('cascade');

            $table->foreign('event_id')
                ->references('event_id')
                ->on('event')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('komentar');
    }
};
