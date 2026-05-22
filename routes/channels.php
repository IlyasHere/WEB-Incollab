<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('conversation.{conversationId}', function ($user, int $conversationId) {
    return Conversation::whereKey($conversationId)
        ->forUser($user)
        ->exists();
});

Broadcast::channel('conversation.presence.{conversationId}', function ($user, int $conversationId) {
    $allowed = Conversation::whereKey($conversationId)
        ->forUser($user)
        ->exists();

    if (! $allowed) {
        return false;
    }

    return [
        'id' => $user->user_id,
        'name' => $user->name,
        'avatar' => $user->avatar,
    ];
});
