import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type CardVariant =
    | 'light'
    | 'primary'
    | 'secondary'
    | 'gradient'
    | 'light-primary'
    | 'light-secondary';

type CardProps = PropsWithChildren<{
    className?: string;
    variant?: CardVariant;
}>;

const variants: Record<CardVariant, string> = {
    light: 'border border-dashboard-outline-variant/30 bg-dashboard-surface-container-lowest shadow-[0px_8px_24px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-white/5',
    primary:
        'border-0 bg-dashboard-primary text-white shadow-[0px_8px_24px_rgba(0,60,199,0.25)]',
    secondary:
        'border-0 bg-dashboard-secondary text-white shadow-[0px_8px_24px_rgba(65,105,0,0.25)]',
    gradient:
        'border-0 bg-gradient-to-br from-dashboard-primary to-dashboard-secondary text-white shadow-[0px_8px_24px_rgba(37,99,235,0.3)]',
    'light-primary':
        'border border-dashboard-primary/20 bg-gradient-to-br from-dashboard-surface-container-lowest to-dashboard-primary/30 text-dashboard-on-surface dark:border-white/10',
    'light-secondary':
        'border border-dashboard-secondary/20 bg-gradient-to-br from-dashboard-surface-container-lowest to-dashboard-secondary/35 text-dashboard-on-surface dark:border-white/10',
};

export default function Card({
    children,
    className,
    variant = 'light',
}: CardProps) {
    return (
        <div className={cn('rounded-2xl', variants[variant], className)}>
            {children}
        </div>
    );
}
