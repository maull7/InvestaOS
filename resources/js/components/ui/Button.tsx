import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'solid' | 'outline' | 'light';
type ButtonSize = 'md' | 'lg';

type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    href?: string;
    className?: string;
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<'button'>, 'className'>;

const variants: Record<ButtonVariant, string> = {
    primary:
        'btn-shine bg-landing-secondary-container text-landing-dark shadow-lg shadow-landing-secondary-container/30 hover:scale-[0.98] hover:bg-landing-secondary-fixed',
    solid: 'bg-landing-primary text-landing-on-primary shadow-[0px_10px_24px_rgba(0,62,199,0.35)] hover:scale-[0.98] hover:bg-landing-primary-container',
    outline:
        'border border-landing-outline-variant text-landing-on-surface hover:scale-[0.98] hover:bg-landing-surface-container-low dark:border-white/15 dark:text-landing-inverse-on-surface dark:hover:bg-white/5',
    light: 'bg-landing-surface text-landing-dark shadow-lg hover:scale-[0.98] hover:bg-landing-surface-container-lowest',
};

const sizes: Record<ButtonSize, string> = {
    md: 'px-6 py-3',
    lg: 'px-8 py-4',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    fullWidth,
    href,
    className,
    children,
    ...rest
}: ButtonProps) {
    const classes = cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-body font-bold text-label-md transition-all duration-200',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
    );

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={classes} {...rest}>
            {children}
        </button>
    );
}
