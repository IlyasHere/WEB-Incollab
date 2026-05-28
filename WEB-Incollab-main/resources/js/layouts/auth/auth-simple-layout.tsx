import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-[#f5f3ff] p-6 md:p-10 overflow-hidden">

            {/* Background decorative blobs */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />

            <div className="relative w-full max-w-sm">
                <div className="flex flex-col gap-6">

                    {/* Logo + Title */}
                    <div className="flex flex-col items-center gap-3">
                        <Link href={home()} className="flex flex-col items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 p-2.5 shadow-lg shadow-violet-300">
                                <img src="/images/logo.svg" alt="InCollab" className="h-full w-full" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-violet-700">
                                InCollab
                            </span>
                        </Link>
                        <div className="space-y-1 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl bg-white px-8 py-8 shadow-xl shadow-violet-100/60 ring-1 ring-violet-100">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}