<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public Message $message)
    {
        $this->message->loadMissing('sender');
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('conversation.'.$this->message->conversation_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => [
                'id' => $this->message->id,
                'conversation_id' => $this->message->conversation_id,
                'sender_id' => $this->message->sender_id,
                'body' => $this->message->body,
                'attachment' => $this->message->attachment_path ? [
                    'url' => asset('storage/'.$this->message->attachment_path),
                    'path' => $this->message->attachment_path,
                    'original_name' => $this->message->attachment_original_name,
                    'mime' => $this->message->attachment_mime,
                    'size' => $this->message->attachment_size,
                ] : null,
                'read_at' => $this->message->read_at?->toISOString(),
                'created_at' => $this->message->created_at?->toISOString(),
                'sender' => [
                    'id' => $this->message->sender->user_id,
                    'name' => $this->message->sender->name,
                    'avatar' => $this->message->sender->avatar,
                ],
            ],
        ];
    }
}
