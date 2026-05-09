import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

type InitialInertiaPage = {
    flash?: {
        toast?: FlashToast;
    };
};

export function useFlashToast(): void {
    const lastToastRef = useRef<string | null>(null);

    const showToast = useCallback((data?: FlashToast) => {
        if (!data) {
            return;
        }

        const toastKey = `${data.type}:${data.message}`;

        if (lastToastRef.current === toastKey) {
            return;
        }

        lastToastRef.current = toastKey;
        toast[data.type](data.message);
    }, []);

    useEffect(() => {
        const page = document.getElementById('app')?.dataset.page;

        if (page) {
            const initialPage = JSON.parse(page) as InitialInertiaPage;

            showToast(initialPage.flash?.toast);
        }

        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            showToast(data);
        });
    }, [showToast]);
}
