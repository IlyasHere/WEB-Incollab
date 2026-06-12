<?php

use App\Events\MessageSent;
use App\Events\MessagesRead;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;

function createChatControllerUser(array $overrides = []): User
{
    return User::factory()->create([
        'role' => 'mahasiswa',
        ...$overrides,
    ]);
}

test('memulai atau mengambil percakapan antara user login dan user target', function () {
    $user = createChatControllerUser(['name' => 'Alya']);
    $targetUser = createChatControllerUser(['name' => 'Bima']);

    $this->actingAs($user)
        ->post(route('chat.start'), [
            'user_id' => $targetUser->user_id,
        ])
        ->assertRedirect();

    $conversation = Conversation::query()->firstOrFail();
    $expectedIds = collect([$user->user_id, $targetUser->user_id])->sort()->values();

    expect($conversation->user_one_id)->toBe($expectedIds[0]);
    expect($conversation->user_two_id)->toBe($expectedIds[1]);

    $this->actingAs($user)
        ->post(route('chat.start'), [
            'user_id' => $targetUser->user_id,
        ])
        ->assertRedirect(route('chat.show', $conversation));

    expect(Conversation::query()->count())->toBe(1);
});

test('menyimpan pesan dengan lampiran gambar dan mengirim event', function () {
    Storage::fake('public');
    Event::fake([MessageSent::class]);

    $user = createChatControllerUser();
    $targetUser = createChatControllerUser();
    $conversation = Conversation::between($user, $targetUser);

    $this->actingAs($user)
        ->post(route('chat.messages.store', $conversation), [
            'body' => 'Halo, ini lampiran desain.',
            'attachment' => UploadedFile::fake()->image('desain-chat.png')->size(512),
        ], [
            'Accept' => 'application/json',
        ])
        ->assertOk()
        ->assertJsonPath('message.body', 'Halo, ini lampiran desain.')
        ->assertJsonPath('message.sender_id', $user->user_id);

    $message = Message::query()->firstOrFail();
    $conversation->refresh();

    expect($message->conversation_id)->toBe($conversation->id);
    expect($message->sender_id)->toBe($user->user_id);
    expect($message->body)->toBe('Halo, ini lampiran desain.');
    expect($message->attachment_path)->toStartWith('chat-attachments/');
    expect($message->attachment_original_name)->toBe('desain-chat.png');
    expect($message->attachment_mime)->toBe('image/png');
    expect($message->attachment_size)->toBeGreaterThan(0);
    expect($conversation->last_message_at?->toISOString())->toBe($message->created_at?->toISOString());

    Storage::disk('public')->assertExists($message->attachment_path);

    Event::assertDispatched(
        MessageSent::class,
        fn (MessageSent $event): bool => $event->message->id === $message->id
    );
});

test('menandai pesan lawan bicara sebagai sudah dibaca dan mengirim event', function () {
    Event::fake([MessagesRead::class]);

    $reader = createChatControllerUser();
    $sender = createChatControllerUser();
    $conversation = Conversation::between($reader, $sender);

    $unreadFromSender = Message::query()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $sender->user_id,
        'body' => 'Pesan yang belum dibaca.',
    ]);

    $ownUnreadMessage = Message::query()->create([
        'conversation_id' => $conversation->id,
        'sender_id' => $reader->user_id,
        'body' => 'Pesan sendiri tidak perlu ditandai read.',
    ]);

    $this->actingAs($reader)
        ->postJson(route('chat.read', $conversation))
        ->assertOk()
        ->assertJson(['ok' => true]);

    $unreadFromSender->refresh();
    $ownUnreadMessage->refresh();

    expect($unreadFromSender->read_at)->not->toBeNull();
    expect($ownUnreadMessage->read_at)->toBeNull();

    Event::assertDispatched(
        MessagesRead::class,
        fn (MessagesRead $event): bool => $event->conversationId === $conversation->id
            && $event->readerId === $reader->user_id
            && $event->messageIds === [$unreadFromSender->id]
    );
});
