<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    use HasFactory;

    protected $table = 'reward';
    protected $primaryKey = 'reward_id';

    protected $fillable = [
        'admin_id',
        'nama_reward',
        'kategori_reward',
        'poin_dibutuhkan',
        'stok',
        'deskripsi',
        'gambar',
        'lokasi_penukaran',
        'instruksi_penukaran',
        'berlaku_hari',
    ];

    protected function casts(): array
    {
        return [
            'gambar' => 'array',
        ];
    }

    // Relasi
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'user_id');
    }

    public function penukaranPoin()
    {
        return $this->hasMany(PenukaranPoin::class, 'reward_id', 'reward_id');
    }

    // Method dari class diagram
    public function tampilkanReward() {}
    public function updateReward() {}
}
