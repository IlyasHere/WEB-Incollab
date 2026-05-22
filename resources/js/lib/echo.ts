import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

export type RealtimeConfig = {
    enabled: boolean;
    key?: string | null;
    cluster?: string | null;
    host?: string | null;
    port?: number | string | null;
    scheme?: string | null;
};

let echo: Echo<'pusher'> | null = null;

export function getEcho(config: RealtimeConfig) {
    if (!config.enabled || !config.key) {
        return null;
    }

    if (echo) {
        return echo;
    }

    window.Pusher = Pusher;

    const isSecure = (config.scheme ?? 'https') === 'https';
    const port = Number(config.port ?? (isSecure ? 443 : 80));
    const customHost =
        config.host && !/^api-[a-z0-9-]+\.pusher\.com$/i.test(config.host)
            ? config.host
            : undefined;

    echo = new Echo({
        broadcaster: 'pusher',
        key: config.key,
        cluster: config.cluster ?? 'mt1',
        wsHost: customHost,
        wsPort: port,
        wssPort: port,
        forceTLS: isSecure,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/broadcasting/auth',
    });

    return echo;
}
