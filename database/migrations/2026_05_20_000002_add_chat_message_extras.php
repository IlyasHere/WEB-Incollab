<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('attachment_path')->nullable()->after('body');
            $table->string('attachment_original_name')->nullable()->after('attachment_path');
            $table->string('attachment_mime')->nullable()->after('attachment_original_name');
            $table->unsignedInteger('attachment_size')->nullable()->after('attachment_mime');
        });

        $this->setBodyNullable();
    }

    public function down(): void
    {
        DB::table('messages')->whereNull('body')->update(['body' => '']);
        $this->setBodyRequired();

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn([
                'attachment_path',
                'attachment_original_name',
                'attachment_mime',
                'attachment_size',
            ]);
        });
    }

    private function setBodyNullable(): void
    {
        match (DB::getDriverName()) {
            'pgsql' => DB::statement('ALTER TABLE messages ALTER COLUMN body DROP NOT NULL'),
            'mysql' => DB::statement('ALTER TABLE messages MODIFY body TEXT NULL'),
            default => null,
        };
    }

    private function setBodyRequired(): void
    {
        match (DB::getDriverName()) {
            'pgsql' => DB::statement('ALTER TABLE messages ALTER COLUMN body SET NOT NULL'),
            'mysql' => DB::statement('ALTER TABLE messages MODIFY body TEXT NOT NULL'),
            default => null,
        };
    }
};
