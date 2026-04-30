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
        'event_id',
        'isi_komentar',
        'tanggal_komentar',
    ];

    // Relasi
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mhs_id', 'mhs_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'event_id');
    }

    // Method dari class diagram
    public function tambahKomentar() {}
    public function editKomentar() {}
    public function hapusKomentar() {}
    public function tampilkanKomentar() {}
}