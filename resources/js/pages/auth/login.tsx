import { Head, Link, useForm } from '@inertiajs/react';
import AuthSplitLayout from '@/components/auth-split-layout';
import { register as registerRoute } from '@/routes';
import login from '@/routes/login';
import { request as passwordRequest } from '@/routes/password';

type LoginProps = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(login.store.url());
    };

    return (
        <>
            <Head title="Login" />

            <AuthSplitLayout
                title="Welcome back"
                subtitle="Log in to continue discovering competitions and collaborating with students."
                bottomText="Don't have an account?"
                bottomLinkText="Create one"
                bottomLinkHref={registerRoute.url()}
            >
                {status && (
                    <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-sm text-green-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-[#2b2b2b]"
                        >
                            Your email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="user@gmail.com"
                            className="h-12 w-full rounded-[4px] border-0 bg-[#bdbdbd] px-4 text-[15px] text-[#1f1f1f] placeholder:text-[#4b4b4b] focus:ring-2 focus:ring-[#7B19F8] focus:outline-none"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-[#2b2b2b]"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="********"
                            className="h-12 w-full rounded-[4px] border-0 bg-[#bdbdbd] px-4 text-[15px] text-[#1f1f1f] placeholder:text-[#4b4b4b] focus:ring-2 focus:ring-[#7B19F8] focus:outline-none"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        {canResetPassword && (
                            <Link
                                href={passwordRequest.url()}
                                className="text-sm text-[#2f2f2f] underline underline-offset-2"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="h-12 w-full rounded-[8px] bg-[#7B19F8] text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? 'Logging in...' : 'Login'}
                    </button>

                    <button
                        type="button"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px] border border-[#7B19F8] bg-transparent text-sm font-semibold text-[#7B19F8] transition hover:bg-[#f6f0ff]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path
                                fill="#FFC107"
                                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5Z"
                            />
                            <path
                                fill="#FF3D00"
                                d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7Z"
                            />
                            <path
                                fill="#4CAF50"
                                d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44Z"
                            />
                            <path
                                fill="#1976D2"
                                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 6.9l6.2 5.2C39 36.8 44 31 44 24c0-1.2-.1-2.3-.4-3.5Z"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </form>
            </AuthSplitLayout>
        </>
    );
}
