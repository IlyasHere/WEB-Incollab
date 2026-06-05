import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DashboardNavItem } from '@/components/dashboard/AppSidebar';

type MobileMenuProps = {
    items: DashboardNavItem[];
    settingsItem: DashboardNavItem;
    currentPath: string;
    open: boolean;
    onClose: () => void;
};

export default function MobileMenu({
    items,
    settingsItem,
    currentPath,
    open,
    onClose,
}: MobileMenuProps) {
    const [shouldRender, setShouldRender] = useState(open);
    const [isVisible, setIsVisible] = useState(open);

    useEffect(() => {
        if (open) {
            const renderFrame = window.requestAnimationFrame(() => {
                setShouldRender(true);
                window.requestAnimationFrame(() => setIsVisible(true));
            });

            return () => window.cancelAnimationFrame(renderFrame);
        }

        const hideFrame = window.requestAnimationFrame(() =>
            setIsVisible(false),
        );
        const timeout = window.setTimeout(() => setShouldRender(false), 240);

        return () => {
            window.cancelAnimationFrame(hideFrame);
            window.clearTimeout(timeout);
        };
    }, [open]);

    if (!shouldRender) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 md:hidden" aria-hidden={!open}>
            <button
                type="button"
                className={`absolute inset-0 bg-[#241B35]/35 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                aria-label="Tutup menu navigasi"
                onClick={onClose}
            />

            <aside
                className={`relative flex h-full w-[min(84vw,320px)] flex-col bg-white shadow-[22px_0_55px_rgba(36,27,53,0.18)] transition-transform duration-300 ease-out ${
                    isVisible ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between border-b border-[#F3EBFA] px-5 py-5">
                    <Link
                        href="/dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3"
                    >
                        <img
                            src="/images/logo.svg"
                            alt="InCollab"
                            className="h-10 w-auto"
                        />
                        <span className="text-xl font-extrabold tracking-tight text-[#241A35]">
                            InCollab
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#EEE4F9] text-[#6B6281] transition hover:bg-[#F7F1FF] hover:text-[#6610F2]"
                        aria-label="Tutup menu navigasi"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
                    {[...items, settingsItem].map(
                        ({ label, href, icon: Icon, badgeCount }) => {
                            const active =
                                href === currentPath ||
                                currentPath.startsWith(`${href}/`);

                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    onClick={onClose}
                                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                                        active
                                            ? 'bg-[#6610F2] text-white shadow-[0_14px_30px_rgba(102,16,242,0.22)]'
                                            : 'text-[#6B6281] hover:bg-[#F7F1FF] hover:text-[#3E2A59]'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{label}</span>
                                    {(badgeCount ?? 0) > 0 && (
                                        <span
                                            className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold ${
                                                active
                                                    ? 'bg-white text-[#D11149]'
                                                    : 'bg-[#D11149] text-white'
                                            }`}
                                        >
                                            {formatBadgeCount(badgeCount ?? 0)}
                                        </span>
                                    )}
                                </Link>
                            );
                        },
                    )}
                </nav>
            </aside>
        </div>
    );
}

function formatBadgeCount(count: number) {
    return count > 99 ? '99+' : String(count);
}
