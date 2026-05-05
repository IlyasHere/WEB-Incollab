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
        if (Schema::hasColumn('mahasiswa', 'nim')) {
            Schema::table('mahasiswa', function (Blueprint $table) {
                $table->dropUnique('mahasiswa_nim_unique');
            });

            Schema::table('mahasiswa', function (Blueprint $table) {
                $table->dropColumn('nim');
            });
        }

        Schema::table('mahasiswa', function (Blueprint $table) {
            if (! Schema::hasColumn('mahasiswa', 'universitas')) {
                $table->string('universitas', 100)->nullable()->after('foto');
            }

            if (! Schema::hasColumn('mahasiswa', 'jurusan')) {
                $table->string('jurusan', 100)->nullable()->after('universitas');
            }

            if (! Schema::hasColumn('mahasiswa', 'angkatan')) {
                $table->string('angkatan', 10)->nullable()->after('jurusan');
            }

            if (! Schema::hasColumn('mahasiswa', 'semester')) {
                $table->unsignedTinyInteger('semester')->nullable()->after('angkatan');
            }

            if (! Schema::hasColumn('mahasiswa', 'skill')) {
                $table->json('skill')->nullable()->after('semester');
            }

            if (! Schema::hasColumn('mahasiswa', 'minat')) {
                $table->json('minat')->nullable()->after('skill');
            }

            if (! Schema::hasColumn('mahasiswa', 'instagram')) {
                $table->string('instagram')->nullable()->after('minat');
            }

            if (! Schema::hasColumn('mahasiswa', 'linkedin')) {
                $table->string('linkedin')->nullable()->after('instagram');
            }

            if (! Schema::hasColumn('mahasiswa', 'github')) {
                $table->string('github')->nullable()->after('linkedin');
            }

            if (! Schema::hasColumn('mahasiswa', 'behance')) {
                $table->string('behance')->nullable()->after('github');
            }

            if (! Schema::hasColumn('mahasiswa', 'portfolio')) {
                $table->string('portfolio')->nullable()->after('behance');
            }

            if (! Schema::hasColumn('mahasiswa', 'tersedia_kolaborasi')) {
                $table->boolean('tersedia_kolaborasi')->default(true)->after('portfolio');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            foreach ([
                'universitas',
                'jurusan',
                'angkatan',
                'semester',
                'skill',
                'minat',
                'instagram',
                'linkedin',
                'github',
                'behance',
                'portfolio',
                'tersedia_kolaborasi',
            ] as $column) {
                if (Schema::hasColumn('mahasiswa', $column)) {
                    $table->dropColumn($column);
                }
            }
        });

        if (! Schema::hasColumn('mahasiswa', 'nim')) {
            Schema::table('mahasiswa', function (Blueprint $table) {
                $table->string('nim', 20)->nullable()->unique()->after('user_id');
            });
        }
    }
};
