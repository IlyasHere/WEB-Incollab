<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $table = 'users';

    protected $primaryKey = 'user_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'google_id',
        'avatar',
        'onboarding_completed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'onboarding_completed_at' => 'datetime',
        ];
    }

    // Relasi ke Mahasiswa
    public function mahasiswa()
    {
        return $this->hasOne(Mahasiswa::class, 'user_id', 'user_id');
    }

    public function feedPosts()
    {
        return $this->hasMany(FeedPost::class, 'user_id', 'user_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id', 'user_id');
    }

    public function conversationsAsUserOne()
    {
        return $this->hasMany(Conversation::class, 'user_one_id', 'user_id');
    }

    public function conversationsAsUserTwo()
    {
        return $this->hasMany(Conversation::class, 'user_two_id', 'user_id');
    public function bookmarks()
    {
    return $this->hasMany(Bookmark::class, 'user_id', 'user_id');
    }

    // Helper cek role
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isMahasiswa(): bool
    {
        return $this->role === 'mahasiswa';
    }

    // Method dari class diagram
    public function login() {}

    public function logout() {}
}
