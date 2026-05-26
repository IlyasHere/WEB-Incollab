<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\MessagesRead;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ChatController extends Controller
{
    public function index(Request $request, ?Conversation $conversation = null): Response|RedirectResponse
    {
        $user = $request->user();

        if ($conversation && ! $conversation->hasParticipant($user)) {
            abort(403);
        }

        $conversation ??= Conversation::forUser($user)
            ->latest('last_message_at')
            ->latest()
            ->first();

        if ($conversation) {
            $conversation->loadMissing(['userOne', 'userTwo']);
            $this->markConversationRead($conversation, $user);
        }

        return Inertia::render('chat', [
            'conversations' => $this->conversationList($user),
            'activeConversation' => $conversation ? $this->conversationPayload($conversation, $user) : null,
            'messages' => $conversation
                ? $this->messageList($conversation)
                : [],
            'users' => $this->availableUsers($user),
            'realtime' => [
                'enabled' => (bool) config('broadcasting.connections.pusher.key'),
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
                'host' => config('broadcasting.connections.pusher.options.host'),
                'port' => config('broadcasting.connections.pusher.options.port'),
                'scheme' => config('broadcasting.connections.pusher.options.scheme'),
            ],
        ]);
    }

    public function start(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,user_id'],
        ]);

        $user = $request->user();

        abort_if((int) $data['user_id'] === $user->user_id, 422);

        $targetUser = User::whereKey($data['user_id'])->firstOrFail();
        $conversation = Conversation::between($user, $targetUser);

        return redirect()->route('chat.show', $conversation);
    }

    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        abort_unless($conversation->hasParticipant($user), 403);

        $data = $request->validate([
            'body' => [
                Rule::requiredIf(! $request->hasFile('attachment')),
                'nullable',
                'string',
                'max:2000',
            ],
            'attachment' => ['nullable', 'image', 'max:4096'],
        ]);

        $attachment = $request->file('attachment');
        $attachmentPath = $attachment?->store('chat-attachments', 'public');

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $user->user_id,
            'body' => filled($data['body'] ?? null) ? trim($data['body']) : null,
            'attachment_path' => $attachmentPath,
            'attachment_original_name' => $attachment?->getClientOriginalName(),
            'attachment_mime' => $attachment?->getClientMimeType(),
            'attachment_size' => $attachment?->getSize(),
        ]);

        $conversation->forceFill(['last_message_at' => $message->created_at])->save();

        $message->load('sender');

        broadcast(new MessageSent($message));

        return response()->json([
            'message' => $this->messagePayload($message),
            'conversation' => $this->conversationPayload($conversation->fresh(['userOne', 'userTwo']), $user),
        ]);
    }

    public function read(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        abort_unless($conversation->hasParticipant($user), 403);

        $this->markConversationRead($conversation, $user);

        return response()->json(['ok' => true]);
    }

    private function conversationList(User $user): array
    {
        return Conversation::forUser($user)
            ->with(['userOne', 'userTwo', 'latestMessage.sender'])
            ->withCount([
                'messages as unread_count' => fn ($query) => $query
                    ->where('sender_id', '!=', $user->user_id)
                    ->whereNull('read_at'),
            ])
            ->latest('last_message_at')
            ->latest()
            ->get()
            ->map(fn (Conversation $conversation) => $this->conversationPayload($conversation, $user))
            ->all();
    }

    private function conversationPayload(Conversation $conversation, User $user): array
    {
        $participant = $conversation->participantFor($user);
        $latestMessage = $conversation->latestMessage->first();

        return [
            'id' => $conversation->id,
            'participant' => $participant ? [
                'id' => $participant->user_id,
                'name' => $participant->name,
                'email' => $participant->email,
                'avatar' => $participant->avatar,
            ] : null,
            'latest_message' => $latestMessage ? $this->messagePayload($latestMessage) : null,
            'unread_count' => $conversation->unread_count ?? 0,
            'last_message_at' => $this->dateString($conversation->last_message_at),
            'created_at' => $this->dateString($conversation->created_at),
        ];
    }

    private function messageList(Conversation $conversation): array
    {
        return $conversation->messages()
            ->with('sender')
            ->oldest()
            ->get()
            ->map(fn (Message $message) => $this->messagePayload($message))
            ->all();
    }

    private function messagePayload(Message $message): array
    {
        return [
            'id' => $message->id,
            'conversation_id' => $message->conversation_id,
            'sender_id' => $message->sender_id,
            'body' => $message->body,
            'attachment' => $message->attachment_path ? [
                'url' => Storage::disk('public')->url($message->attachment_path),
                'path' => $message->attachment_path,
                'original_name' => $message->attachment_original_name,
                'mime' => $message->attachment_mime,
                'size' => $message->attachment_size,
            ] : null,
            'read_at' => $this->dateString($message->read_at),
            'created_at' => $this->dateString($message->created_at),
            'sender' => [
                'id' => $message->sender->user_id,
                'name' => $message->sender->name,
                'avatar' => $message->sender->avatar,
            ],
        ];
    }

    private function availableUsers(User $user): array
    {
        return User::query()
            ->where('user_id', '!=', $user->user_id)
            ->orderBy('name')
            ->limit(50)
            ->get(['user_id', 'name', 'email', 'avatar'])
            ->map(fn (User $targetUser) => [
                'id' => $targetUser->user_id,
                'name' => $targetUser->name,
                'email' => $targetUser->email,
                'avatar' => $targetUser->avatar,
            ])
            ->all();
    }

    private function dateString(Carbon|string|null $date): ?string
    {
        if (! $date) {
            return null;
        }

        if ($date instanceof Carbon) {
            return $date->toISOString();
        }

        return Carbon::parse($date, 'UTC')->toISOString();
    }

    private function markConversationRead(Conversation $conversation, User $user): void
    {
        $readAt = now();
        $messageIds = Message::where('conversation_id', $conversation->id)
            ->where('sender_id', '!=', $user->user_id)
            ->whereNull('read_at')
            ->pluck('id')
            ->all();

        if ($messageIds === []) {
            return;
        }

        Message::whereIn('id', $messageIds)->update(['read_at' => $readAt]);

        broadcast(new MessagesRead(
            conversationId: $conversation->id,
            readerId: $user->user_id,
            messageIds: $messageIds,
            readAt: $readAt->toISOString(),
        ));
    }
}
