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
        Schema::create('klaim_poin', function (Blueprint $table) {
            $table->id('klaim_id');
            $table->unsignedBigInteger('mhs_id');
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('admin_id')->nullable();

            $table->date('tanggal_klaim');
            $table->string('file_bukti', 255)->nullable();
            $table->string('status_klaim', 50)->nullable();
            $table->text('catatan_admin')->nullable();
            $table->timestamps();

            $table->foreign('mhs_id')
                ->references('mhs_id')
                ->on('mahasiswa')
                ->onDelete('cascade');

            $table->foreign('event_id')
                ->references('event_id')
                ->on('event')
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
        Schema::dropIfExists('klaim_poin');
    }
};
