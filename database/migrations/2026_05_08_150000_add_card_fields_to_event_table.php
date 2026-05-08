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
        Schema::table('event', function (Blueprint $table) {
            $table->string('poster_event', 255)->nullable()->after('status_event');
            $table->string('penyelenggara', 150)->nullable()->after('poster_event');
            $table->date('tanggal_selesai')->nullable()->after('tanggal_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event', function (Blueprint $table) {
            $table->dropColumn([
                'poster_event',
                'penyelenggara',
                'tanggal_selesai',
            ]);
        });
    }
};
