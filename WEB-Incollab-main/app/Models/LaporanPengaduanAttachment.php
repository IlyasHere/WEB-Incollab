<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanPengaduanAttachment extends Model
{
    protected $table = 'laporan_pengaduan_attachments';

    protected $primaryKey = 'attachment_id';

    protected $fillable = [
        'laporan_id',
        'file_path',
        'original_name',
        'mime_type',
        'file_size',
    ];

    public function laporan()
    {
        return $this->belongsTo(LaporanPengaduan::class, 'laporan_id', 'laporan_id');
    }
}
