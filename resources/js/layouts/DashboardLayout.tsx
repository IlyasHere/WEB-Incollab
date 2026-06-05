import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import {
    Bell,
    Bookmark,
    Coins,
    Home,
    MessageCircle,
    Settings,
    Trophy,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import AppSidebar from '@/components/dashboard/AppSidebar';
import type { DashboardNavItem } from '@/components/dashboard/AppSidebar';
import MobileMenu from '@/components/dashboard/MobileMenu';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { Auth } from '@/types/auth';

type DashboardLayoutProps = {
    children: ReactNode;
};

const primaryNavItems: DashboardNavItem[] = [
    { label: 'Beranda', href: '/dashboard', icon: Home },
    // { label: 'Eksplorasi', href: '/eksplorasi', icon: Compass },
    { label: 'Event', href: '/event', icon: Trophy },
    { label: 'Tukar Poin', href: '/tukar-poin', icon: Coins },
    { label: 'Tersimpan', href: '/tersimpan', icon: Bookmark },
    { label: 'Chat', href: '/chat', icon: MessageCircle },
    { label: 'Notifikasi', href: '/pengaturan/notifikasi', icon: Bell },
];

const settingsNavItem: DashboardNavItem = {
    label: 'Pengaturan',
    href: '/pengaturan',
    icon: Settings,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { auth, chatUnreadCount, notificationUnreadCount } = usePage<{
        auth: Auth;
        chatUnreadCount: number;
        notificationUnreadCount: number;
    }>().props;
    const { currentUrl } = useCurrentUrl();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navItems = primaryNavItems.map((item) =>
        item.label === 'Chat'
            ? { ...item, badgeCount: chatUnreadCount }
            : item.label === 'Notifikasi'
              ? { ...item, badgeCount: notificationUnreadCount }
              : item,
    );

    return (
        <div
            className="min-h-screen bg-[#FDF7FF] font-sans text-[#2C213B]"
            style={{
                fontFamily:
                    '"Plus Jakarta Sans", "Instrument Sans", ui-sans-serif, system-ui, sans-serif',
            }}
        >
            <div className="mx-auto flex min-h-screen max-w-[1600px]">
                <AppSidebar
                    items={navItems}
                    settingsItem={settingsNavItem}
                    currentPath={currentUrl}
                />

                <div className="min-w-0 flex-1">
                    <TopNavbar
                        userName={auth.user.name}
                        userAvatar={auth.user.avatar}
                        mobileMenuOpen={mobileMenuOpen}
                        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
                        onLogout={() => router.post('/logout')}
                    />

                    <MobileMenu
                        items={navItems}
                        settingsItem={settingsNavItem}
                        currentPath={currentUrl}
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                    />

                    {children}
                </div>
            </div>

            {/* <MobileBottomNav items={primaryNavItems} currentPath={currentUrl} /> */}
        </div>
    );
}
