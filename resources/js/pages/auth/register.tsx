import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import AuthSplitLayout from '@/components/auth-split-layout';
import { login as loginRoute } from '@/routes';
import register from '@/routes/register';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(register.store.url(), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <AuthSplitLayout
                title="Get Started"
                subtitle="Welcome to InCollab - Let's get started"
                bottomText="Already have account?"
                bottomLinkText="Login"
                bottomLinkHref={loginRoute.url()}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-semibold text-[#2b2b2b]"
                        >
                            Nama
                        </label>
                        <input
                            id="nama"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Masukkan nama"
                            className="h-12 w-full rounded-[4px] border-0 bg-[#bdbdbd] px-4 text-[15px] text-[#1f1f1f] placeholder:text-[#4b4b4b] focus:ring-2 focus:ring-[#7B19F8] focus:outline-none"
                        />
                        {errors.name && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </div>
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
                            Create password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => {
                                    setData('password', e.target.value);
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    );
                                }}
                                placeholder="********"
                                className="h-12 w-full rounded-[4px] border-0 bg-[#bdbdbd] px-4 pr-12 text-[15px] text-[#1f1f1f] placeholder:text-[#4b4b4b] focus:ring-2 focus:ring-[#7B19F8] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((current) => !current)
                                }
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-[#4b4b4b] transition hover:text-[#1f1f1f] focus:outline-none"
                                aria-label={
                                    showPassword
                                        ? 'Sembunyikan password'
                                        : 'Tampilkan password'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                        {errors.password_confirmation && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    <input
                        type="hidden"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        readOnly
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="h-12 w-full rounded-[8px] bg-[#7B19F8] text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? 'Creating...' : 'Create new account'}
                    </button>
                </form>
            </AuthSplitLayout>
        </>
    );
}
