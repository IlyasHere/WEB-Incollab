<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('event', function (Blueprint $table) {
            $table->string('visibility_status', 20)->default('Published')->after('status_event');
            $table->string('registration_status', 20)->default('Open')->after('visibility_status');
        });

        DB::table('event')->update([
            'visibility_status' => DB::raw("
                CASE
                    WHEN status_event IS NULL OR status_event = '' THEN 'Draft'
                    ELSE 'Published'
                END
            "),
            'registration_status' => DB::raw("
                CASE
                    WHEN status_event = 'Coming Soon' THEN 'Coming Soon'
                    WHEN status_event = 'Registration Closing' THEN 'Closed'
                    WHEN status_event IS NULL OR status_event = '' THEN 'Coming Soon'
                    ELSE 'Open'
                END
            "),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event', function (Blueprint $table) {
            $table->dropColumn(['visibility_status', 'registration_status']);
        });
    }
};
