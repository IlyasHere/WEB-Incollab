<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitySeeder extends Seeder
{
    /**
     * Seed Indonesian higher education institution names from local CSV data.
     */
    public function run(): void
    {
        $path = database_path('data/perguruan-tinggi.csv');

        if (! file_exists($path)) {
            return;
        }

        $handle = fopen($path, 'r');

        if ($handle === false) {
            return;
        }

        fgetcsv($handle, 0, ',', '"', '\\');

        $now = now();
        $rows = [];
        $seen = [];

        while (($record = fgetcsv($handle, 0, ',', '"', '\\')) !== false) {
            $name = trim($record[1] ?? '');

            if ($name === '') {
                continue;
            }

            $key = mb_strtolower($name);

            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;

            $rows[] = [
                'name' => $name,
                'lldikti_region' => filled($record[2] ?? null) ? trim($record[2]) : null,
                'source' => 'joearton/perguruan-tinggi',
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        fclose($handle);

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('universities')->upsert(
                $chunk,
                ['name'],
                ['lldikti_region', 'source', 'updated_at'],
            );
        }
    }
}
