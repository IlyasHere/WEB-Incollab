<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPengaduan extends Model
{
    use HasFactory;

    protected $table = 'laporan_pengaduan';
    protected $primaryKey = 'laporan_id';

    protected $fillable = [
        'mhs_id',
        'admin_id',
        'isi_laporan',
        'status_laporan',
    ];

    // Relasi
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mhs_id', 'mhs_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'user_id');
    }

    // Method dari class diagram
    public function buatLaporan() {}
    public function tampilLaporan() {}
    public function updateStatus() {}
}