<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedPostImage extends Model
{
    protected $primaryKey = 'image_id';

    protected $fillable = [
        'post_id',
        'image_path',
        'sort_order',
    ];

    public function post()
    {
        return $this->belongsTo(FeedPost::class, 'post_id', 'post_id');
    }
}
