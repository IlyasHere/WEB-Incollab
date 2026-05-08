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
        Schema::create('feed_post_images', function (Blueprint $table) {
            $table->id('image_id');
            $table->unsignedBigInteger('post_id');
            $table->string('image_path');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('post_id')
                ->references('post_id')
                ->on('feed_posts')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feed_post_images');
    }
};
