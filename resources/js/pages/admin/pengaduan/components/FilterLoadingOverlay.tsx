export function FilterLoadingOverlay() {
    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#EFE4F8] bg-white px-6 py-5 shadow-[0_18px_40px_rgba(102,16,242,0.14)]">
                <HandshakeHeartLoader />
                <p className="text-sm font-bold text-[#382A49]">
                    Menyaring laporan...
                </p>
            </div>
        </div>
    );
}

function HandshakeHeartLoader() {
    return (
        <svg
            width="76"
            height="56"
            viewBox="0 0 76 56"
            role="img"
            aria-label="Loading"
            className="overflow-visible"
        >
            <path
                d="M38 49 C17 34 9 24 12 13 C14 5 24 3 31 10 L38 17 L45 10 C52 3 62 5 64 13 C67 24 59 34 38 49 Z"
                fill="#F0E7FF"
                stroke="#6610F2"
                strokeWidth="2"
                opacity="0.9"
            >
                <animate
                    attributeName="opacity"
                    values="0.45;0.95;0.45"
                    dur="1.1s"
                    repeatCount="indefinite"
                />
            </path>
            <g>
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="-3 0;3 0;-3 0"
                    dur="0.82s"
                    repeatCount="indefinite"
                />
                <path d="M4 31 L20 22 L33 31 L24 41 L12 39 Z" fill="#1A8FE3" />
                <path
                    d="M18 23 L31 17 L39 23 L28 33 Z"
                    fill="#DFF0FF"
                    stroke="#1A8FE3"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </g>
            <g>
                <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="3 0;-3 0;3 0"
                    dur="0.82s"
                    repeatCount="indefinite"
                />
                <path d="M72 31 L56 22 L43 31 L52 41 L64 39 Z" fill="#F37933" />
                <path
                    d="M58 23 L45 17 L37 23 L48 33 Z"
                    fill="#FFF0E0"
                    stroke="#F37933"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </g>
            <path
                d="M28 33 L36 25 C38 23 41 23 43 25 L49 31 C51 33 51 36 49 38 L44 43 C41 46 36 46 33 43 L27 38 C25 36 25 35 28 33 Z"
                fill="#FFFFFF"
                stroke="#6610F2"
                strokeWidth="2"
                strokeLinejoin="round"
            >
                <animateTransform
                    attributeName="transform"
                    type="scale"
                    additive="sum"
                    values="1;1.06;1"
                    dur="0.82s"
                    repeatCount="indefinite"
                />
            </path>
            <path
                d="M34 33 L38 36 L43 30"
                fill="none"
                stroke="#6610F2"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
