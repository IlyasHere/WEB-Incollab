import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function usePageLoading() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const start = router.on('start', () => setIsLoading(true));
        const finish = router.on('finish', () => setIsLoading(false));

        return () => {
            start();
            finish();
        };
    }, []);

    return isLoading;
}
