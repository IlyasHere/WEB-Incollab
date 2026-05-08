<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedPost extends Model
{
    protected $primaryKey = 'post_id';

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function images()
    {
        return $this->hasMany(FeedPostImage::class, 'post_id', 'post_id')
            ->orderBy('sort_order');
    }

    public function komentar()
    {
        return $this->hasMany(Komentar::class, 'post_id', 'post_id')
            ->orderByDesc('tanggal_komentar');
    }
}
