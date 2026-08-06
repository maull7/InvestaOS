import { useEffect, type ReactNode } from 'react';

import Icon from './Icon';
import { cn } from '@/lib/utils';

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    footer?: ReactNode;
};

const sizes: Record<NonNullable<ModalProps['size']>, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg max-h-[calc(100vh-4rem)] overflow-y-auto',
    lg: 'max-w-2xl max-h-[calc(100vh-4rem)] overflow-y-auto',
};

export default function Modal({
    open,
    onClose,
    title,
    size = 'md',
    children,
    footer,
}: ModalProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onMouseDown={onClose}
        >
            <div
                className="absolute inset-0 bg-landing-dark/60 backdrop-blur-sm dark:bg-black/70"
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={(e) => e.stopPropagation()}
                className={cn(
                    'relative w-full animate-[fade-in_0.2s_ease-out] rounded-2xl border border-landing-outline-variant/30 bg-landing-surface-container-lowest p-6 shadow-[0px_24px_64px_rgba(0,0,0,0.2)] dark:border-white/10 dark:bg-landing-inverse-surface',
                    sizes[size],
                )}
            >
                <div className="mb-5 flex min-w-0 items-start justify-between gap-4">
                    {title && (
                        <h2 className="font-headline text-headline-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            {title}
                        </h2>
                    )}
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-landing-on-surface-variant transition-colors hover:bg-landing-surface-container-low hover:text-landing-on-surface dark:text-landing-surface-variant dark:hover:bg-white/10 dark:hover:text-landing-inverse-on-surface"
                    >
                        <Icon name="close" />
                    </button>
                </div>
                <div className="text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                    {children}
                </div>
                {footer && (
                    <div className="mt-6 flex justify-end gap-3">{footer}</div>
                )}
            </div>
        </div>
    );
}