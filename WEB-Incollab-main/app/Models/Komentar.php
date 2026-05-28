<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Komentar extends Model
{
    use HasFactory;

    protected $table = 'komentar';

    protected $primaryKey = 'komentar_id';

    public $timestamps = false;

    protected $fillable = [
        'mhs_id',
        'post_id',
        'parent_id',
        'isi_komentar',
        'tanggal_komentar',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_komentar' => 'datetime',
        ];
    }

    // Relasi
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mhs_id', 'mhs_id');
    }

    public function post()
    {
        return $this->belongsTo(FeedPost::class, 'post_id', 'post_id');
    }

    public function parent()
    {
        return $this->belongsTo(Komentar::class, 'parent_id', 'komentar_id');
    }

    public function replies()
    {
        return $this->hasMany(Komentar::class, 'parent_id', 'komentar_id')
            ->orderBy('tanggal_komentar');
    }

    // Method dari class diagram
    public function tambahKomentar() {}

    public function editKomentar() {}

    public function hapusKomentar() {}

    public function tampilkanKomentar() {}
}
