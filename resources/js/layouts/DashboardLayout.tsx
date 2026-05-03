import type { ReactNode } from 'react';
import { useState } from 'react';
import {
    Bookmark,
    Compass,
    Coins,
    Home,
    Settings,
    Trophy,
} from 'lucide-react';
import { usePage } from '@inertiajs/react';
import AppSidebar, {
    type DashboardNavItem,
} from '@/components/dashboard/AppSidebar';
import MobileBottomNav from '@/components/dashboard/MobileBottomNav';
import MobileMenu from '@/components/dashboard/MobileMenu';
import TopNavbar from '@/components/dashboard/TopNavbar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { Auth } from '@/types/auth';

type DashboardLayoutProps = {
    children: ReactNode;
};

const primaryNavItems: DashboardNavItem[] = [
    { label: 'Beranda', href: '/dashboard', icon: Home },
    { label: 'Eksplorasi', href: '/eksplorasi', icon: Compass },
    { label: 'Event', href: '/event', icon: Trophy },
    { label: 'Tukar Poin', href: '/tukar-poin', icon: Coins },
    { label: 'Tersimpan', href: '/tersimpan', icon: Bookmark },
];

const settingsNavItem: DashboardNavItem = {
    label: 'Pengaturan',
    href: '/pengaturan',
    icon: Settings,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const { currentUrl } = useCurrentUrl();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                    items={primaryNavItems}
                    settingsItem={settingsNavItem}
                    currentPath={currentUrl}
                />

                <div className="min-w-0 flex-1">
                    <TopNavbar
                        userName={auth.user.name}
                        mobileMenuOpen={mobileMenuOpen}
                        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
                    />

                    <MobileMenu
                        items={primaryNavItems}
                        settingsItem={settingsNavItem}
                        currentPath={currentUrl}
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                    />

                    {children}
                </div>
            </div>

            <MobileBottomNav items={primaryNavItems} currentPath={currentUrl} />
        </div>
    );
}
