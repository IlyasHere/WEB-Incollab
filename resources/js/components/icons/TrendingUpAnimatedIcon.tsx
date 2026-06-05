import type { CSSProperties } from 'react';

type TrendingUpAnimatedIconProps = {
    variant?: 'loop' | 'hover';
    size?: number;
    className?: string;
    iconClassName?: string;
};

export default function TrendingUpAnimatedIcon({
    variant = 'loop',
    size = 40,
    className = '',
    iconClassName = '',
}: TrendingUpAnimatedIconProps) {
    const animationClass =
        variant === 'loop'
            ? 'animate-trending-icon-pulse'
            : 'group-hover:animate-trending-icon-hover';
    const pathAnimationClass =
        variant === 'loop'
            ? 'animate-trending-line-loop'
            : 'group-hover:animate-trending-line-hover';
    const arrowAnimationClass =
        variant === 'loop'
            ? 'animate-trending-arrow-loop'
            : 'group-hover:animate-trending-arrow-hover';

    return (
        <span
            className={`trending-up-icon group/icon inline-flex shrink-0 items-center justify-center rounded-2xl bg-[#EFE4F8] text-[#6610F2] shadow-[inset_0_0_0_1px_rgba(102,16,242,0.08),0_10px_24px_rgba(102,16,242,0.12)] transition-colors duration-300 group-hover:bg-[#E7D7FF] hover:bg-[#E7D7FF] ${animationClass} ${className}`}
            style={
                {
                    '--trending-icon-size': `${size}px`,
                    width: size,
                    height: size,
                } as CSSProperties
            }
            aria-hidden="true"
        >
            <style>
                {`
                    .trending-up-icon .trending-line,
                    .trending-up-icon .trending-arrow {
                        stroke-dasharray: 72;
                        stroke-dashoffset: 0;
                        transform-origin: 19px 9px;
                    }

                    @keyframes trending-line-loop {
                        0% { stroke-dashoffset: 72; opacity: 0.35; }
                        42% { stroke-dashoffset: 0; opacity: 1; }
                        74%, 100% { stroke-dashoffset: 0; opacity: 1; }
                    }

                    @keyframes trending-arrow-loop {
                        0%, 36% { stroke-dashoffset: 72; opacity: 0; transform: translate3d(-1px, 1px, 0) scale(0.9); }
                        52% { stroke-dashoffset: 0; opacity: 1; transform: translate3d(1px, -1px, 0) scale(1.08); }
                        68%, 100% { stroke-dashoffset: 0; opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                    }

                    @keyframes trending-icon-pulse {
                        0%, 72%, 100% { transform: translate3d(0, 0, 0) scale(1); box-shadow: 0 0 0 0 rgba(102, 16, 242, 0); }
                        82% { transform: translate3d(0, -1px, 0) scale(1.035); box-shadow: 0 10px 22px -14px rgba(102, 16, 242, 0.48); }
                    }

                    @keyframes trending-line-hover {
                        0% { stroke-dashoffset: 72; opacity: 0.35; }
                        100% { stroke-dashoffset: 0; opacity: 1; }
                    }

                    @keyframes trending-arrow-hover {
                        0%, 48% { stroke-dashoffset: 72; opacity: 0; transform: translate3d(-1px, 1px, 0) scale(0.9); }
                        78% { stroke-dashoffset: 0; opacity: 1; transform: translate3d(1px, -1px, 0) scale(1.1); }
                        100% { stroke-dashoffset: 0; opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
                    }

                    @keyframes trending-icon-hover {
                        0% { transform: translate3d(0, 0, 0) scale(1); }
                        65% { transform: translate3d(0, -2px, 0) scale(1.04); }
                        100% { transform: translate3d(0, 0, 0) scale(1); }
                    }

                    .animate-trending-line-loop {
                        animation: trending-line-loop 2.2s ease-in-out infinite;
                    }

                    .animate-trending-arrow-loop {
                        animation: trending-arrow-loop 2.2s ease-in-out infinite;
                    }

                    .animate-trending-icon-pulse {
                        animation: trending-icon-pulse 2.2s ease-in-out infinite;
                    }

                    .group:hover .group-hover\\:animate-trending-line-hover,
                    .group\\/icon:hover .group-hover\\:animate-trending-line-hover {
                        animation: trending-line-hover 0.72s ease-out both;
                    }

                    .group:hover .group-hover\\:animate-trending-arrow-hover,
                    .group\\/icon:hover .group-hover\\:animate-trending-arrow-hover {
                        animation: trending-arrow-hover 0.72s ease-out both;
                    }

                    .group:hover .group-hover\\:animate-trending-icon-hover,
                    .group\\/icon:hover.group-hover\\:animate-trending-icon-hover {
                        animation: trending-icon-hover 0.72s ease-out both;
                    }
                `}
            </style>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`h-[55%] w-[55%] ${iconClassName}`}
            >
                <path
                    d="M4 16.5L9.2 11.3L12.8 14.9L20 7.7"
                    stroke="currentColor"
                    strokeWidth="2.15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`trending-line ${pathAnimationClass}`}
                />
                <path
                    d="M14.8 7.5H20.2V12.9"
                    stroke="currentColor"
                    strokeWidth="2.15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`trending-arrow ${arrowAnimationClass}`}
                />
            </svg>
        </span>
    );
}
