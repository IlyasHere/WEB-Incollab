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
        Schema::table('komentar', function (Blueprint $table) {
            $table->dropForeign(['event_id']);
            $table->dropColumn('event_id');
        });

        Schema::table('komentar', function (Blueprint $table) {
            $table->unsignedBigInteger('post_id')->after('mhs_id');

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
        Schema::table('komentar', function (Blueprint $table) {
            $table->dropForeign(['post_id']);
            $table->dropColumn('post_id');
        });

        Schema::table('komentar', function (Blueprint $table) {
            $table->unsignedBigInteger('event_id')->nullable()->after('mhs_id');

            $table->foreign('event_id')
                ->references('event_id')
                ->on('event')
                ->onDelete('cascade');
        });
    }
};
