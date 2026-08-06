import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type CardProps = PropsWithChildren<{ className?: string }>;

export default function Card({ children, className }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-landing-outline-variant/30 bg-landing-surface-container-lowest p-8 shadow-[0px_8px_24px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/5',
                className,
            )}
        >
            {children}
        </div>
    );
}
