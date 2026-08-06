import type { PropsWithChildren } from 'react';

import Card from '@/components/ui/Card';
import Logo from '@/components/ui/Logo';

type AuthLayoutProps = PropsWithChildren<{ title: string; subtitle: string }>;

export default function AuthLayout({
    title,
    subtitle,
    children,
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-landing-background font-sans text-landing-on-surface antialiased selection:bg-landing-secondary-container selection:text-landing-on-secondary-container dark:bg-landing-inverse-surface dark:text-landing-inverse-on-surface">
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 animate-[blob_16s_ease-in-out_infinite] rounded-full bg-landing-primary-container/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 animate-[blob_20s_ease-in-out_infinite_reverse] rounded-full bg-landing-secondary-container/15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 animate-[blob_24s_ease-in-out_infinite] rounded-full bg-landing-primary/5 blur-3xl" />

            <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-[420px] space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <Logo href="/" size="lg" />
                        <h1 className="mt-6 font-headline text-headline-lg text-landing-on-surface dark:text-landing-inverse-on-surface">
                            {title}
                        </h1>
                        <p className="font-body mt-2 text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                            {subtitle}
                        </p>
                    </div>

                    <Card>{children}</Card>

                    <p className="font-body text-center text-label-sm text-landing-on-surface-variant/60 dark:text-landing-surface-variant/60">
                        © 2026 InvestaOS Finance. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
