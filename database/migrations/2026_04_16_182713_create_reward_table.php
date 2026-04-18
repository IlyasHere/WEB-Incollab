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
        Schema::create('reward', function (Blueprint $table) {
            $table->id('reward_id');
            $table->unsignedBigInteger('admin_id');
            $table->string('nama_reward', 100)->nullable();
            $table->integer('poin_dibutuhkan')->nullable();
            $table->integer('stok')->nullable();

            $table->foreign('admin_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reward');
    }
};
