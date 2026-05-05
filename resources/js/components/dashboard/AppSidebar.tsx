import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type DashboardNavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

type AppSidebarProps = {
    items: DashboardNavItem[];
    settingsItem: DashboardNavItem;
    currentPath: string;
};

function isActive(href: string, currentPath: string) {
    return href === currentPath;
}

export default function AppSidebar({
    items,
    settingsItem,
    currentPath,
}: AppSidebarProps) {
    const SettingsIcon = settingsItem.icon;

    return (
        <aside className="hidden h-screen shrink-0 border-r border-[#EFE4F8] bg-white md:sticky md:top-0 md:flex md:w-[96px] md:flex-col lg:w-[250px]">
            <div className="border-b border-[#F3EBFA] px-4 py-5 lg:px-6">
                <div className="flex items-center gap-3">
                    <img
                        src="/images/logo.svg"
                        alt="InCollab"
                        className="h-10 w-auto md:mx-auto lg:mx-0"
                    />
                </div>
            </div>

            <div className="flex flex-1 flex-col px-3 py-6 lg:px-4">
                <nav className="space-y-2">
                    {items.map(({ label, href, icon: Icon }) => {
                        const active = isActive(href, currentPath);

                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[15px] font-semibold transition md:justify-center lg:justify-start ${
                                    active
                                        ? 'bg-[#6610F2] text-white shadow-[0_14px_30px_rgba(102,16,242,0.22)]'
                                        : 'text-[#64748B] hover:bg-[#F7F1FF] hover:text-[#3E2A59]'
                                }`}
                            >
                                <Icon className="h-5 w-5" strokeWidth={2.1} />
                                <span className="hidden lg:inline">
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <Link
                    href={settingsItem.href}
                    className={`mt-4 flex items-center gap-3 border-t border-[#F3EBFA] px-4 py-5 text-[15px] font-medium transition md:justify-center lg:justify-start ${
                        isActive(settingsItem.href, currentPath)
                            ? 'text-[#6610F2]'
                            : 'text-[#64748B] hover:text-[#2D2141]'
                    }`}
                >
                    <SettingsIcon className="h-5 w-5" />
                    <span className="hidden lg:inline">
                        {settingsItem.label}
                    </span>
                </Link>
            </div>
        </aside>
    );
}
