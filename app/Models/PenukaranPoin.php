<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenukaranPoin extends Model
{
    use HasFactory;

    protected $table = 'penukaran_poin';
    protected $primaryKey = 'penukaran_id';

    protected $fillable = [
        'mhs_id',
        'reward_id',
        'tanggal_penukaran',
        'jumlah_poin',
        'status_penukaran',
        'kode_penukaran',
        'expires_at',
    ];

    // Relasi
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mhs_id', 'mhs_id');
    }

    public function reward()
    {
        return $this->belongsTo(Reward::class, 'reward_id', 'reward_id');
    }

    // Method dari class diagram
    public function prosesPenukaran() {}
    public function batalPenukaran() {}
    public function tampilRiwayat() {}
}
