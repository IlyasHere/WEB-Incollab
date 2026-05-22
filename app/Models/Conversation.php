<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    protected $fillable = [
        'user_one_id',
        'user_two_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public static function between(User $firstUser, User $secondUser): self
    {
        [$firstId, $secondId] = collect([$firstUser->user_id, $secondUser->user_id])
            ->sort()
            ->values()
            ->all();

        return static::firstOrCreate([
            'user_one_id' => $firstId,
            'user_two_id' => $secondId,
        ]);
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        return $query->where(function (Builder $query) use ($user): void {
            $query
                ->where('user_one_id', $user->user_id)
                ->orWhere('user_two_id', $user->user_id);
        });
    }

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id', 'user_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id', 'user_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasMany
    {
        return $this->hasMany(Message::class)->latest();
    }

    public function participantFor(User $user): ?User
    {
        if ($this->user_one_id === $user->user_id) {
            return $this->userTwo;
        }

        if ($this->user_two_id === $user->user_id) {
            return $this->userOne;
        }

        return null;
    }

    public function hasParticipant(User $user): bool
    {
        return in_array($user->user_id, [$this->user_one_id, $this->user_two_id], true);
    }
}
