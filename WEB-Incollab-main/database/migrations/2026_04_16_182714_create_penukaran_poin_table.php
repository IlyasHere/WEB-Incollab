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
        Schema::create('penukaran_poin', function (Blueprint $table) {
            $table->id('penukaran_id');
            $table->unsignedBigInteger('mhs_id');
            $table->unsignedBigInteger('reward_id');

            $table->date('tanggal_penukaran')->nullable();
            $table->integer('jumlah_poin')->nullable();
            $table->string('status_penukaran', 50)->nullable();
            $table->timestamps();

            $table->foreign('mhs_id')
                ->references('mhs_id')
                ->on('mahasiswa')
                ->onDelete('cascade');

            $table->foreign('reward_id')
                ->references('reward_id')
                ->on('reward')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penukaran_poin');
    }
};
