import { Link } from '@inertiajs/react';
import type { DashboardNavItem } from '@/components/dashboard/AppSidebar';

type MobileBottomNavProps = {
    items: DashboardNavItem[];
    currentPath: string;
};

export default function MobileBottomNav({
    items,
    currentPath,
}: MobileBottomNavProps) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#EADCF8] bg-white/96 px-4 py-3 backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-md items-center justify-between gap-2">
                {items.map(({ label, href, icon: Icon }) => {
                    const active = href === currentPath;

                    return (
                        <Link
                            key={label}
                            href={href}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium ${
                                active
                                    ? 'bg-[#F4ECFF] text-[#6610F2]'
                                    : 'text-[#7A6F92]'
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="truncate">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
