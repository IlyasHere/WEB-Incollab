import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (
        <Sonner
            theme={appearance}
            className="toaster group"
            richColors
            position="bottom-left"
            toastOptions={{
                classNames: {
                    toast: 'rounded-2xl border border-[#EFE4F8] shadow-[0_18px_45px_rgba(56,42,73,0.16)]',
                    title: 'text-sm font-semibold',
                    description: 'text-sm',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
}

export { Toaster };
