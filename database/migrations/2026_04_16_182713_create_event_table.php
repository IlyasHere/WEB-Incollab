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
        Schema::create('event', function (Blueprint $table) {
            $table->id('event_id');
            $table->unsignedBigInteger('admin_id');

            $table->string('judul_event', 150);
            $table->text('deskripsi_event')->nullable();
            $table->date('tanggal_event');
            $table->string('lokasi', 100)->nullable();
            $table->string('kategori_event', 50)->nullable();
            $table->integer('poin_event')->default(0);
            $table->string('link_pendaftaran', 255)->nullable();
            $table->string('status_event', 50)->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('admin_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event');
    }
};
