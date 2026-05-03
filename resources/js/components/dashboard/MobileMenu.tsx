import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
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
    if (!open) {
        return null;
    }

    return (
        <div className="border-b border-[#EFE4F8] bg-white px-4 py-4 md:hidden">
            <nav className="space-y-2">
                {[...items, settingsItem].map(({ label, href, icon: Icon }) => {
                    const active = href === currentPath;

                    return (
                        <Link
                            key={label}
                            href={href}
                            onClick={onClose}
                            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                                active
                                    ? 'bg-[#6610F2] text-white'
                                    : 'text-[#6B6281] hover:bg-[#F7F1FF]'
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <button
                type="button"
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#6610F2] text-sm font-semibold text-white"
            >
                <Plus className="h-4 w-4" />
                Buat Postingan
            </button>
        </div>
    );
}
