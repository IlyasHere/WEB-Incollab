type AuthSplitLayoutProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    bottomText: string;
    bottomLinkText: string;
    bottomLinkHref: string;
};

export default function AuthSplitLayout({
    title,
    subtitle,
    children,
    bottomText,
    bottomLinkText,
    bottomLinkHref,
}: AuthSplitLayoutProps) {
    return (
        <div className="min-h-screen bg-[#f4f4f4] p-2 text-[#222222] md:p-3">
            <div className="grid min-h-[96vh] w-full grid-cols-1 bg-[#f4f4f4] lg:grid-cols-[1fr_1fr]">
                <section className="relative hidden overflow-hidden rounded-[10px] bg-gradient-to-br from-[#eeeaf0] via-[#ded8e1] to-[#d5cfd8] p-8 lg:flex lg:flex-col">
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/logo.svg"
                            alt=""
                            className="h-8 w-9 object-contain"
                        />
                        <span className="text-[15px] font-bold text-[#2f2f2f]">
                            InCollab
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#8d28ff]/65 blur-3xl" />

                    <div className="relative z-10 mt-auto max-w-md pb-8">
                        <p className="mb-5 text-[17px] text-white/95">
                            Tetap terhubung
                        </p>
                        <h2 className="text-[46px] leading-[1.18] font-bold text-white">
                            Temukan lomba
                            <br />
                            dan berkolaborasi
                            <br />
                            dengan mudah.
                        </h2>
                    </div>
                </section>

                <main className="flex items-center justify-center px-6 py-10 md:px-10 lg:px-20">
                    <div className="w-full max-w-[444px]">
                        <div className="mb-6">
                            <img
                                src="/images/logo.svg"
                                alt="InCollab"
                                className="mb-4 h-12 w-14 object-contain"
                            />

                            <h1 className="text-[44px] leading-none font-bold tracking-normal text-[#1f1f1f] md:text-[52px]">
                                {title}
                            </h1>
                            <p className="mt-2 max-w-[360px] text-[15px] leading-5 text-[#6d6d6d]">
                                {subtitle}
                            </p>
                            <div className="mt-7 h-[2px] w-full bg-[#777777]" />
                        </div>

                        {children}

                        <div className="mt-5 text-center text-sm text-[#333333]">
                            {bottomText}{' '}
                            <a
                                href={bottomLinkHref}
                                className="font-semibold underline underline-offset-2"
                            >
                                {bottomLinkText}
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
