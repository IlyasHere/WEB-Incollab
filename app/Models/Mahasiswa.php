<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected $primaryKey = 'mhs_id';

    protected $fillable = [
        'user_id',
        'bio',
        'foto',
        'universitas',
        'jurusan',
        'angkatan',
        'semester',
        'skill',
        'minat',
        'instagram',
        'linkedin',
        'github',
        'portfolio',
        'total_poin',
    ];

    protected function casts(): array
    {
        return [
            'skill' => 'array',
            'minat' => 'array',
        ];
    }

    // Relasi ke User (parent)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    // Relasi ke tabel lain
    public function klaimPoin()
    {
        return $this->hasMany(KlaimPoin::class, 'mhs_id', 'mhs_id');
    }

    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'mhs_id', 'mhs_id');
    }

    public function penukaranPoin()
    {
        return $this->hasMany(PenukaranPoin::class, 'mhs_id', 'mhs_id');
    }

    public function laporanPengaduan()
    {
        return $this->hasMany(LaporanPengaduan::class, 'mhs_id', 'mhs_id');
    }

    // Method dari class diagram
    public function register() {}

    public function lihatFeed() {}

    public function lihatDetailEvent() {}

    public function lihatProfil() {}

    public function ajukanKlaimPoin() {}

    public function ubahProfil() {}

    public function addKomentar() {}

    public function tukarPoin() {}

    public function buatLaporan() {}
}
