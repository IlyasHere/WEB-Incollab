import { Form, Head } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset kata sandi" />

            {/* Info banner */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-800 dark:bg-violet-950/40">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                <p className="text-sm text-violet-700 dark:text-violet-300">
                    Gunakan kata sandi yang kuat dengan minimal 8 karakter.
                </p>
            </div>

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        {/* Email readonly */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={email}
                                readOnly
                                className="rounded-xl bg-gray-100 text-gray-700 opacity-100"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-1"
                            />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Kata sandi baru
                            </Label>

                            <div className="relative">
                                <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    className="rounded-xl border-violet-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                                    autoFocus
                                    placeholder="Masukkan kata sandi baru"
                                />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm password */}
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Konfirmasi kata sandi
                            </Label>

                            <div className="relative">
                                <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="rounded-xl border-violet-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500/20"
                                    placeholder="Ulangi kata sandi baru"
                                />
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full rounded-xl bg-violet-600 py-5 text-sm font-semibold transition-all hover:bg-violet-700 active:scale-[0.98]"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <Spinner />
                                    Mereset...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4" />
                                    Reset kata sandi
                                </span>
                            )}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset kata sandi',
    description: 'Masukkan kata sandi baru kamu di bawah ini',
};
