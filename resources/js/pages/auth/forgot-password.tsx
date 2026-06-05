import { Form, Head } from '@inertiajs/react';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    {status}
                </div>
            )}

            <div className="space-y-5">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-gray-700"
                                >
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        autoFocus
                                        placeholder="email@example.com"
                                        className="rounded-xl border-violet-200 bg-white pl-10 text-gray-900 placeholder:text-gray-400 focus:border-violet-500 focus:ring-violet-500/20 dark:border-violet-300 dark:bg-white dark:text-gray-900 dark:placeholder:text-gray-400"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="mt-2 w-full rounded-xl bg-violet-600 py-5 text-sm font-semibold transition-all hover:bg-violet-700 active:scale-[0.98]"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        Send reset link
                                    </span>
                                )}
                            </Button>
                        </>
                    )}
                </Form>

                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Return to</span>
                    <TextLink
                        href={login()}
                        className="font-semibold text-violet-600 hover:text-violet-700"
                    >
                        log in
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
