import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCheck,
    MessageCircle,
    Paperclip,
    Plus,
    Search,
    SendHorizontal,
    X,
    UserRound,
} from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getEcho } from '@/lib/echo';
import type { RealtimeConfig } from '@/lib/echo';
import type { Auth } from '@/types/auth';

type ChatUser = {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
};

type ChatMessage = {
    id: number;
    conversation_id: number;
    sender_id: number;
    body?: string | null;
    attachment?: {
        url: string;
        path: string;
        original_name?: string | null;
        mime?: string | null;
        size?: number | null;
    } | null;
    read_at?: string | null;
    created_at?: string | null;
    sender: ChatUser;
};

type Conversation = {
    id: number;
    participant: ChatUser | null;
    latest_message: ChatMessage | null;
    unread_count: number;
    last_message_at?: string | null;
    created_at?: string | null;
};

type ChatProps = {
    conversations: Conversation[];
    activeConversation: Conversation | null;
    messages: ChatMessage[];
    users: ChatUser[];
    realtime: RealtimeConfig;
};

type MessageSentEvent = {
    message: ChatMessage;
};

type MessagesReadEvent = {
    conversation_id: number;
    reader_id: number;
    message_ids: number[];
    read_at: string;
};

type TypingEvent = {
    user_id: number;
    name: string;
};

type PresenceUser = {
    id: number;
    name: string;
    avatar?: string | null;
};

type RealtimePrivateChannel = {
    listen: (
        event: string,
        callback: (payload: MessageSentEvent | MessagesReadEvent) => void,
    ) => RealtimePrivateChannel;
    listenForWhisper: (
        event: string,
        callback: (payload: TypingEvent) => void,
    ) => RealtimePrivateChannel;
    whisper: (event: string, payload: TypingEvent) => void;
};

type RealtimePresenceChannel = {
    here: (callback: (users: PresenceUser[]) => void) => RealtimePresenceChannel;
    joining: (callback: (user: PresenceUser) => void) => RealtimePresenceChannel;
    leaving: (callback: (user: PresenceUser) => void) => RealtimePresenceChannel;
};

export default function Chat({
    conversations: initialConversations,
    activeConversation,
    messages: initialMessages,
    users,
    realtime,
}: ChatProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUserId = auth.user.user_id ?? auth.user.id;
    const [conversationOverrides, setConversationOverrides] = useState<
        Record<number, Conversation>
    >({});
    const [messageOverrides, setMessageOverrides] = useState<
        Record<number, ChatMessage[]>
    >({});
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [search, setSearch] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
        null,
    );
    const [typing, setTyping] = useState(false);
    const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set());
    const privateChannelRef = useRef<RealtimePrivateChannel | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const localTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const endRef = useRef<HTMLDivElement | null>(null);

    const conversations = useMemo(
        () =>
            initialConversations.map(
                (conversation) =>
                    conversationOverrides[conversation.id] ?? conversation,
            ),
        [conversationOverrides, initialConversations],
    );
    const messages = activeConversation
        ? (messageOverrides[activeConversation.id] ?? initialMessages)
        : [];
    const participantOnline = activeConversation?.participant
        ? onlineUserIds.has(activeConversation.participant.id)
        : false;

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages.length, activeConversation?.id, typing]);

    const markRead = useCallback(async (conversationId: number) => {
        await fetch(`/chat/${conversationId}/read`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
        });
    }, []);

    useEffect(() => {
        if (!activeConversation || !realtime.enabled) {
            return;
        }

        const echo = getEcho(realtime);

        if (!echo) {
            return;
        }

        const channelName = `conversation.${activeConversation.id}`;
        const presenceChannelName = `conversation.presence.${activeConversation.id}`;

        const privateChannel = echo.private(
            channelName,
        ) as unknown as RealtimePrivateChannel;
        privateChannelRef.current = privateChannel;

        privateChannel.listen(
            '.message.sent',
            (event) => {
                const messageEvent = event as MessageSentEvent;

                if (
                    messageEvent.message.conversation_id !==
                    activeConversation.id
                ) {
                    return;
                }

                setMessageOverrides((current) => {
                    const currentMessages =
                        current[activeConversation.id] ?? initialMessages;

                    if (
                        currentMessages.some(
                            (message) => message.id === messageEvent.message.id,
                        )
                    ) {
                        return current;
                    }

                    return {
                        ...current,
                        [activeConversation.id]: [
                            ...currentMessages,
                            messageEvent.message,
                        ],
                    };
                });

                setConversationOverrides((current) => {
                    const conversation = conversations.find(
                        (item) =>
                            item.id === messageEvent.message.conversation_id,
                    );

                    if (!conversation) {
                        return current;
                    }

                    return {
                        ...current,
                        [conversation.id]: {
                            ...conversation,
                            latest_message: messageEvent.message,
                            last_message_at: messageEvent.message.created_at,
                            unread_count:
                                messageEvent.message.sender_id === currentUserId
                                    ? conversation.unread_count
                                    : 0,
                        },
                    };
                });

                if (messageEvent.message.sender_id !== currentUserId) {
                    setTyping(false);
                    markRead(activeConversation.id);
                }
            },
        ).listen('.messages.read', (event) => {
            const readEvent = event as MessagesReadEvent;

            if (readEvent.reader_id === currentUserId) {
                return;
            }

            setMessageOverrides((current) => {
                const currentMessages =
                    current[activeConversation.id] ?? initialMessages;
                const readIds = new Set(readEvent.message_ids);

                return {
                    ...current,
                    [activeConversation.id]: currentMessages.map((message) =>
                        readIds.has(message.id)
                            ? { ...message, read_at: readEvent.read_at }
                            : message,
                    ),
                };
            });
        });

        privateChannel.listenForWhisper('typing', (event) => {
            if (event.user_id === currentUserId) {
                return;
            }

            setTyping(true);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                setTyping(false);
            }, 1600);
        });

        const presenceChannel = echo.join(
            presenceChannelName,
        ) as unknown as RealtimePresenceChannel;

        presenceChannel
            .here((users) => {
                setOnlineUserIds(new Set(users.map((user) => user.id)));
            })
            .joining((user) => {
                setOnlineUserIds((current) => new Set(current).add(user.id));
            })
            .leaving((user) => {
                setOnlineUserIds((current) => {
                    const next = new Set(current);

                    next.delete(user.id);

                    return next;
                });
            });

        return () => {
            echo.leave(channelName);
            echo.leave(presenceChannelName);
            privateChannelRef.current = null;
            setTyping(false);

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = null;
            }
        };
    }, [
        activeConversation,
        conversations,
        currentUserId,
        initialMessages,
        markRead,
        realtime,
    ]);

    useEffect(() => {
        return () => {
            if (attachmentPreview) {
                URL.revokeObjectURL(attachmentPreview);
            }
        };
    }, [attachmentPreview]);

    const filteredUsers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return users;
        }

        return users.filter((user) =>
            `${user.name} ${user.email ?? ''}`.toLowerCase().includes(keyword),
        );
    }, [search, users]);

    async function submitMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!activeConversation || (!body.trim() && !attachment) || sending) {
            return;
        }

        setSending(true);
        const formData = new FormData();

        if (body.trim()) {
            formData.append('body', body.trim());
        }

        if (attachment) {
            formData.append('attachment', attachment);
        }

        const response = await fetch(`/chat/${activeConversation.id}/messages`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCsrfToken(),
            },
            body: formData,
        });

        setSending(false);

        if (!response.ok) {
            return;
        }

        const payload = (await response.json()) as {
            message: ChatMessage;
            conversation: Conversation;
        };

        setBody('');
        clearAttachment();
        setMessageOverrides((current) => {
            const conversationId = payload.conversation.id;
            const currentMessages = current[conversationId] ?? initialMessages;

            if (
                currentMessages.some(
                    (message) => message.id === payload.message.id,
                )
            ) {
                return current;
            }

            return {
                ...current,
                [conversationId]: [...currentMessages, payload.message],
            };
        });
        setConversationOverrides((current) => ({
            ...current,
            [payload.conversation.id]: payload.conversation,
        }));
    }

    function startConversation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedUserId) {
            return;
        }

        router.post('/chat', { user_id: Number(selectedUserId) });
    }

    function updateDraft(value: string) {
        setBody(value);

        if (!activeConversation || !privateChannelRef.current) {
            return;
        }

        if (localTypingTimeoutRef.current) {
            clearTimeout(localTypingTimeoutRef.current);
        }

        privateChannelRef.current.whisper('typing', {
            user_id: currentUserId,
            name: auth.user.name,
        });

        localTypingTimeoutRef.current = setTimeout(() => {
            localTypingTimeoutRef.current = null;
        }, 1200);
    }

    function selectAttachment(file?: File) {
        if (attachmentPreview) {
            URL.revokeObjectURL(attachmentPreview);
        }

        if (!file) {
            setAttachment(null);
            setAttachmentPreview(null);

            return;
        }

        setAttachment(file);
        setAttachmentPreview(URL.createObjectURL(file));
    }

    function clearAttachment() {
        if (attachmentPreview) {
            URL.revokeObjectURL(attachmentPreview);
        }

        setAttachment(null);
        setAttachmentPreview(null);
    }

    return (
        <>
            <Head title="Chat" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <div className="mx-auto grid max-w-[1320px] gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
                    <aside className="min-h-[calc(100vh-132px)] overflow-hidden rounded-[24px] border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(177,145,221,0.13)]">
                        <div className="border-b border-[#F3EBFA] p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.18em] text-[#8A7FA2] uppercase">
                                        Pesan
                                    </p>
                                    <h1 className="mt-1 text-2xl font-extrabold text-[#241A35]">
                                        Chat
                                    </h1>
                                </div>
                                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2]">
                                    <MessageCircle className="h-5 w-5" />
                                </span>
                            </div>

                            <form
                                onSubmit={startConversation}
                                className="mt-5 grid gap-3"
                            >
                                <label className="text-sm font-semibold text-[#3E2A59]">
                                    Mulai chat baru
                                </label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedUserId}
                                        onChange={(event) =>
                                            setSelectedUserId(event.target.value)
                                        }
                                        className="h-11 min-w-0 flex-1 rounded-2xl border border-[#EADCF8] bg-[#F7F1FF] px-3 text-sm font-medium text-[#382A49] outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                    >
                                        <option value="">Pilih pengguna</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="submit"
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#6610F2] text-white transition hover:bg-[#570DCC] disabled:opacity-60"
                                        disabled={!selectedUserId}
                                        aria-label="Mulai chat"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>

                            <div className="relative mt-4">
                                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8A7FA2]" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Cari pengguna..."
                                    className="h-11 w-full rounded-2xl border border-[#EADCF8] bg-white pr-3 pl-10 text-sm text-[#382A49] outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                />
                            </div>
                        </div>

                        <div className="max-h-[calc(100vh-385px)] min-h-[280px] overflow-y-auto p-3">
                            {conversations.length > 0 ? (
                                <div className="space-y-2">
                                    {conversations.map((conversation) => (
                                        <ConversationItem
                                            key={conversation.id}
                                            conversation={conversation}
                                            active={
                                                conversation.id ===
                                                activeConversation?.id
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyList
                                    title="Belum ada percakapan"
                                    description="Pilih pengguna untuk mulai mengirim pesan."
                                />
                            )}

                            {filteredUsers.length > 0 && conversations.length === 0 && (
                                <div className="mt-4 border-t border-[#F3EBFA] pt-4">
                                    <p className="px-2 text-xs font-bold tracking-[0.16em] text-[#8A7FA2] uppercase">
                                        Pengguna
                                    </p>
                                    <div className="mt-2 space-y-1">
                                        {filteredUsers.slice(0, 6).map((user) => (
                                            <button
                                                key={user.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedUserId(String(user.id))
                                                }
                                                className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition hover:bg-[#F7F1FF]"
                                            >
                                                <Avatar user={user} />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-bold text-[#2C213B]">
                                                        {user.name}
                                                    </span>
                                                    <span className="block truncate text-xs text-[#8A7FA2]">
                                                        {user.email}
                                                    </span>
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-[#8A7FA2]" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    <section className="flex min-h-[calc(100vh-132px)] flex-col overflow-hidden rounded-[24px] border border-[#EFE4F8] bg-white shadow-[0_18px_45px_rgba(177,145,221,0.13)]">
                        {activeConversation?.participant ? (
                            <>
                                <div className="flex items-center gap-3 border-b border-[#F3EBFA] px-5 py-4">
                                    <Avatar user={activeConversation.participant} />
                                    <div className="min-w-0 flex-1">
                                        <h2 className="truncate text-lg font-extrabold text-[#241A35]">
                                            {activeConversation.participant.name}
                                        </h2>
                                        <p className="flex items-center gap-2 truncate text-sm text-[#8A7FA2]">
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${
                                                    participantOnline
                                                        ? 'bg-[#10B981]'
                                                        : 'bg-[#CBD5E1]'
                                                }`}
                                            />
                                            {typing
                                                ? 'Sedang mengetik...'
                                                : participantOnline
                                                  ? 'Online'
                                                  : realtime.enabled
                                                    ? 'Offline'
                                                    : 'Realtime belum dikonfigurasi'}
                                            {activeConversation.last_message_at &&
                                                !typing && (
                                                    <span>
                                                        •{' '}
                                                        {formatTime(
                                                            activeConversation.last_message_at,
                                                        )}
                                                    </span>
                                                )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto bg-[#FBF8FF] px-4 py-5 sm:px-6">
                                    <div className="space-y-3">
                                        {messages.map((message) => (
                                            <MessageBubble
                                                key={message.id}
                                                message={message}
                                                mine={
                                                    message.sender_id ===
                                                    currentUserId
                                                }
                                            />
                                        ))}
                                        {typing &&
                                            activeConversation.participant && (
                                                <TypingBubble
                                                    user={
                                                        activeConversation.participant
                                                    }
                                                />
                                            )}
                                        <div ref={endRef} />
                                    </div>
                                </div>

                                <form
                                    onSubmit={submitMessage}
                                    className="border-t border-[#F3EBFA] bg-white p-4"
                                >
                                    {attachmentPreview && (
                                        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[#EADCF8] bg-[#F7F1FF] p-2">
                                            <img
                                                src={attachmentPreview}
                                                alt="Preview lampiran"
                                                className="h-16 w-16 rounded-xl object-cover"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-[#2C213B]">
                                                    {attachment?.name}
                                                </p>
                                                <p className="text-xs text-[#8A7FA2]">
                                                    {formatFileSize(
                                                        attachment?.size,
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={clearAttachment}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#8A7FA2] transition hover:bg-white hover:text-[#D11149]"
                                                aria-label="Hapus lampiran"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <label
                                            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-[#EADCF8] text-[#6610F2] transition hover:bg-[#F7F1FF]"
                                            aria-label="Lampirkan gambar"
                                        >
                                            <Paperclip className="h-5 w-5" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(event) => {
                                                    selectAttachment(
                                                        event.target.files?.[0],
                                                    );
                                                    event.target.value = '';
                                                }}
                                            />
                                        </label>
                                        <input
                                            type="text"
                                            value={body}
                                            onChange={(event) =>
                                                updateDraft(event.target.value)
                                            }
                                            placeholder="Tulis pesan..."
                                            className="h-12 min-w-0 flex-1 rounded-2xl border border-[#EADCF8] bg-[#F7F1FF] px-4 text-sm text-[#382A49] outline-none focus:border-[#6610F2] focus:ring-4 focus:ring-[#6610F2]/10"
                                            maxLength={2000}
                                        />
                                        <button
                                            type="submit"
                                            disabled={
                                                (!body.trim() &&
                                                    !attachment) ||
                                                sending
                                            }
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6610F2] text-white transition hover:bg-[#570DCC] disabled:opacity-60"
                                            aria-label="Kirim pesan"
                                        >
                                            <SendHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-1 items-center justify-center p-8 text-center">
                                <div className="max-w-sm">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F0E7FF] text-[#6610F2]">
                                        <MessageCircle className="h-8 w-8" />
                                    </div>
                                    <h2 className="mt-5 text-2xl font-extrabold text-[#241A35]">
                                        Pilih teman ngobrol
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                                        Mulai percakapan baru dari daftar pengguna,
                                        lalu pesan akan tersimpan dan siap disiarkan
                                        realtime saat konfigurasi broadcast aktif.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
}

function ConversationItem({
    conversation,
    active,
}: {
    conversation: Conversation;
    active: boolean;
}) {
    const participant = conversation.participant;

    if (!participant) {
        return null;
    }

    return (
        <Link
            href={`/chat/${conversation.id}`}
            className={`flex items-center gap-3 rounded-2xl p-3 transition ${
                active
                    ? 'bg-[#6610F2] text-white shadow-[0_14px_30px_rgba(102,16,242,0.22)]'
                    : 'hover:bg-[#F7F1FF]'
            }`}
        >
            <Avatar user={participant} active={active} />
            <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                    <span
                        className={`block truncate text-sm font-extrabold ${
                            active ? 'text-white' : 'text-[#2C213B]'
                        }`}
                    >
                        {participant.name}
                    </span>
                    <span
                        className={`shrink-0 text-[11px] font-semibold ${
                            active ? 'text-white/70' : 'text-[#A193B8]'
                        }`}
                    >
                        {formatTime(
                            conversation.last_message_at ??
                                conversation.latest_message?.created_at ??
                                conversation.created_at,
                        )}
                    </span>
                </span>
                <span
                    className={`block truncate text-xs ${
                        active ? 'text-white/75' : 'text-[#8A7FA2]'
                    }`}
                >
                    {messagePreview(conversation.latest_message)}
                </span>
            </span>
            {conversation.unread_count > 0 && (
                <span
                    className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-extrabold ${
                        active
                            ? 'bg-white text-[#D11149]'
                            : 'bg-[#D11149] text-white'
                    }`}
                >
                    {conversation.unread_count > 99
                        ? '99+'
                        : conversation.unread_count}
                </span>
            )}
        </Link>
    );
}

function MessageBubble({
    message,
    mine,
}: {
    message: ChatMessage;
    mine: boolean;
}) {
    return (
        <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm leading-6 shadow-sm ${
                    mine
                        ? 'rounded-br-md bg-[#6610F2] text-white'
                        : 'rounded-bl-md border border-[#EFE4F8] bg-white text-[#2C213B]'
                }`}
            >
                {message.attachment && (
                    <a
                        href={message.attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-2 block overflow-hidden rounded-2xl"
                    >
                        <img
                            src={message.attachment.url}
                            alt={
                                message.attachment.original_name ??
                                'Lampiran gambar'
                            }
                            className="max-h-72 w-full object-cover"
                        />
                    </a>
                )}
                {message.body && (
                    <p className="whitespace-pre-wrap break-words">
                        {message.body}
                    </p>
                )}
                <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
                        mine ? 'text-white/70' : 'text-[#9B8FB3]'
                    }`}
                >
                    <span>{formatTime(message.created_at)}</span>
                    {mine && message.read_at && (
                        <span className="inline-flex items-center gap-1">
                            <CheckCheck className="h-3.5 w-3.5" />
                            Dibaca
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function TypingBubble({ user }: { user: ChatUser }) {
    return (
        <div className="flex justify-start">
            <div className="flex max-w-[78%] items-end gap-2">
                <Avatar user={user} />
                <div className="rounded-[22px] rounded-bl-md border border-[#EFE4F8] bg-white px-4 py-3 text-sm text-[#766B8A] shadow-sm">
                    <style>
                        {`
                            @keyframes chat-typing-dot {
                                0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
                                40% { transform: translateY(-4px); opacity: 1; }
                            }
                        `}
                    </style>
                    <div className="mb-1 text-xs font-bold text-[#8A7FA2]">
                        {user.name} sedang mengetik
                    </div>
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((index) => (
                            <span
                                key={index}
                                className="h-2 w-2 rounded-full bg-[#6610F2]"
                                style={{
                                    animation:
                                        'chat-typing-dot 1.1s ease-in-out infinite',
                                    animationDelay: `${index * 0.16}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Avatar({ user, active = false }: { user: ChatUser; active?: boolean }) {
    const initials = user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ${
                active ? 'bg-white/20 text-white' : 'bg-[#F0E7FF] text-[#6610F2]'
            }`}
        >
            {user.avatar ? (
                <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials || <UserRound className="h-5 w-5" />
            )}
        </span>
    );
}

function EmptyList({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-[#EADCF8] p-6 text-center">
            <div>
                <p className="text-sm font-extrabold text-[#2C213B]">{title}</p>
                <p className="mt-1 text-sm leading-6 text-[#8A7FA2]">
                    {description}
                </p>
            </div>
        </div>
    );
}

function getCsrfToken() {
    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

function formatTime(value?: string | null) {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function formatFileSize(size?: number | null) {
    if (!size) {
        return '';
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function messagePreview(message?: ChatMessage | null) {
    if (!message) {
        return 'Belum ada pesan';
    }

    if (message.body) {
        return message.body;
    }

    if (message.attachment) {
        return 'Gambar';
    }

    return 'Pesan';
}

Chat.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
