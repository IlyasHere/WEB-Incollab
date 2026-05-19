import { Head, router } from '@inertiajs/react';
import {
    Bell,
    CheckCheck,
    ChevronRight,
    Gift,
    Info,
    MessageCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

type NotificationItem = {
    id: number;
    type: string;
    title: string;
    body: string | null;
    url: string | null;
    readAt: string | null;
    createdAt: string | null;
    timeLabel: string | null;
};

type PengaturanNotifikasiProps = {
    notifications: NotificationItem[];
    unreadCount: number;
};

export default function PengaturanNotifikasi({
    notifications = [],
    unreadCount = 0,
}: PengaturanNotifikasiProps) {
    const markAllAsRead = () => {
        if (unreadCount <= 0) {
            return;
        }

        router.post(
            '/pengaturan/notifikasi/read-all',
            {},
            {
                preserveScroll: true,
                only: [
                    'notifications',
                    'unreadCount',
                    'notificationUnreadCount',
                ],
            },
        );
    };

    const openNotification = (notification: NotificationItem) => {
        const visitUrl = notification.url;

        if (notification.readAt) {
            if (visitUrl) {
                router.visit(visitUrl);
            }

            return;
        }

        router.post(
            `/pengaturan/notifikasi/${notification.id}/read`,
            {},
            {
                preserveScroll: true,
                only: [
                    'notifications',
                    'unreadCount',
                    'notificationUnreadCount',
                ],
                onSuccess: () => {
                    if (visitUrl) {
                        router.visit(visitUrl);
                    }
                },
            },
        );
    };

    return (
        <>
            <Head title="Notifikasi" />

            <main className="px-4 py-5 pb-28 sm:px-6 sm:py-6 md:pb-8 lg:px-8 xl:px-10">
                <section className="mx-auto max-w-[1320px] rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_20px_50px_rgba(177,145,221,0.16)] sm:p-8">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0E7FF] text-[#6610F2]">
                                    <Bell className="h-6 w-6" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D11149] px-1.5 text-[10px] font-extrabold text-white ring-2 ring-white">
                                            {formatBadgeCount(unreadCount)}
                                        </span>
                                    )}
                                </span>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#1F1730] sm:text-3xl">
                                        Notifikasi
                                    </h1>
                                    <p className="mt-1 text-sm font-medium text-[#766B8A]">
                                        {unreadCount > 0
                                            ? `${unreadCount} notifikasi belum dibaca`
                                            : 'Semua notifikasi sudah dibaca'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={markAllAsRead}
                            disabled={unreadCount <= 0}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#D8CDE8] px-5 text-sm font-bold text-[#382A49] transition hover:bg-[#F7F1FF] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Tandai semua dibaca
                        </button>
                    </div>

                    {notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map((item) => (
                                <NotificationCard
                                    key={item.id}
                                    notification={item}
                                    onOpen={() => openNotification(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-[320px] items-center justify-center rounded-[24px] border border-dashed border-[#D8CDE8] bg-[#FBF7FF] p-8 text-center">
                            <div>
                                <Bell className="mx-auto h-12 w-12 text-[#6610F2]" />
                                <h2 className="mt-4 text-lg font-extrabold text-[#1F1730]">
                                    Belum ada notifikasi
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-[#766B8A]">
                                    Info komentar, balasan, penukaran reward,
                                    dan aktivitas penting akan muncul di sini.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

function NotificationCard({
    notification,
    onOpen,
}: {
    notification: NotificationItem;
    onOpen: () => void;
}) {
    const isUnread = !notification.readAt;
    const Icon =
        notification.type === 'reward' || notification.type === 'reward_merch'
            ? Gift
            : notification.type === 'comment'
              ? MessageCircle
              : Info;

    return (
        <article
            className={`group rounded-[24px] border p-4 shadow-[0_10px_30px_rgba(102,16,242,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(102,16,242,0.12)] ${
                isUnread
                    ? 'border-[#D8C4F0] bg-[#FBF7FF]'
                    : 'border-[#EADCF8] bg-white'
            }`}
        >
            <button
                type="button"
                onClick={onOpen}
                className="flex w-full items-start gap-4 text-left"
            >
                <span
                    className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                        notification.type === 'reward' ||
                        notification.type === 'reward_merch'
                            ? 'bg-[#FFF6D8] text-[#A77800]'
                            : notification.type === 'comment'
                              ? 'bg-[#E7F8EF] text-[#15803D]'
                              : 'bg-[#F0E7FF] text-[#6610F2]'
                    }`}
                >
                    <Icon className="h-6 w-6" />
                    {isUnread && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#D11149] ring-2 ring-white" />
                    )}
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <h2 className="truncate text-base font-extrabold text-[#1F1730]">
                                {notification.title}
                            </h2>
                            <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase ${
                                    isUnread
                                        ? 'bg-[#D11149] text-white'
                                        : 'bg-[#DCFCE7] text-[#15803D]'
                                }`}
                            >
                                {isUnread ? 'Belum dibaca' : 'Dibaca'}
                            </span>
                        </div>
                        <span className="shrink-0 text-xs font-semibold text-[#766B8A]">
                            {notification.timeLabel}
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#5E5873]">
                        {notification.body}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#6610F2]">
                        {notification.url
                            ? 'Buka detail'
                            : 'Tandai sudah dibaca'}
                        <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </div>
                </div>
            </button>
        </article>
    );
}

function formatBadgeCount(count: number) {
    return count > 99 ? '99+' : String(count);
}

PengaturanNotifikasi.layout = (page: ReactNode) => (
    <DashboardLayout>{page}</DashboardLayout>
);
