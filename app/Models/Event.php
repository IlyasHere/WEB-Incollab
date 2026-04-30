<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'event';
    protected $primaryKey = 'event_id';

    protected $fillable = [
        'admin_id',
        'judul_event',
        'deskripsi_event',
        'tanggal_event',
        'lokasi',
        'kategori_event',
        'poin_event',
        'link_pendaftaran',
        'status_event',
    ];

    // Relasi
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'user_id');
    }

    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'event_id', 'event_id');
    }

    public function klaimPoin()
    {
        return $this->hasMany(KlaimPoin::class, 'event_id', 'event_id');
    }

    public function tampilkanEvent() {}
    public function tampilkanDetailEvent() {}
    public function ubahStatusEvent() {}
    public function tampilkanPerBulan(int $bulan, int $tahun): array { return []; }
    public function tampilkanPerTanggal(string $tanggal): array { return []; }
}