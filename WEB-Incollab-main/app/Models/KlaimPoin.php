<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KlaimPoin extends Model
{
    use HasFactory;

    protected $table = 'klaim_poin';

    protected $primaryKey = 'klaim_id';

    protected $fillable = [
        'mhs_id',
        'event_id',
        'admin_id',
        'tanggal_klaim',
        'nama_lengkap',
        'nim_user',
        'nama_event',
        'tanggal_mengikuti_event',
        'nama_sertifikat',
        'file_bukti',
        'catatan_user',
        'status_klaim',
        'catatan_admin',
        'alasan_penolakan',
        'poin_diberikan_at',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_klaim' => 'date',
            'tanggal_mengikuti_event' => 'date',
            'poin_diberikan_at' => 'datetime',
        ];
    }

    // Relasi
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mhs_id', 'mhs_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'user_id');
    }

    // Method dari class diagram
    public function submitKlaim() {}

    public function tampilkanKlaim() {}

    public function approvalKlaim() {}
}
