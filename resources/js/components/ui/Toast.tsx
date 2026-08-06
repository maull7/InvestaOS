import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';

import Icon from './Icon';
import { cn } from '@/lib/utils';

type ToastVariant = 'success' | 'error' | 'info';
type Toast = {
    id: number;
    variant: ToastVariant;
    title: string;
    message?: string;
};

type ToastInput = { title: string; message?: string };
type ToastStore = Record<ToastVariant, (t: ToastInput) => void>;

const ToastContext = createContext<ToastStore | null>(null);

const variantStyles: Record<ToastVariant, { icon: string; className: string }> =
    {
        success: {
            icon: 'check',
            className:
                'border-landing-primary/40 bg-landing-surface-container-lowest dark:bg-landing-inverse-surface',
        },
        error: {
            icon: 'close',
            className:
                'border-landing-error/40 bg-landing-error-container/10 dark:bg-landing-error-container/20',
        },
        info: {
            icon: 'bolt',
            className:
                'border-landing-outline-variant/40 bg-landing-surface-container-lowest dark:bg-landing-inverse-surface',
        },
    };

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const idRef = useRef(0);

    const dismiss = useCallback((id: number) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (variant: ToastVariant) => (t: ToastInput) => {
            const id = ++idRef.current;
            setToasts((list) => [...list, { id, variant, ...t }]);
            window.setTimeout(() => dismiss(id), 4000);
        },
        [dismiss],
    );

    const store = useMemo<ToastStore>(
        () => ({
            success: push('success'),
            error: push('error'),
            info: push('info'),
        }),
        [push],
    );

    return (
        <ToastContext.Provider value={store}>
            {children}
            <div
                aria-live="polite"
                className="fixed top-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3"
            >
                {toasts.map((toast) => {
                    const style = variantStyles[toast.variant];

                    return (
                        <div
                            key={toast.id}
                            role="status"
                            className={cn(
                                'flex items-start gap-3 rounded-2xl border p-4 shadow-lg animate-[fade-in_0.2s_ease-out]',
                                style.className,
                            )}
                        >
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-landing-primary text-landing-on-primary">
                                <Icon name={style.icon} size="text-[14px]" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-body text-label-md font-bold text-landing-on-surface dark:text-landing-inverse-on-surface">
                                    {toast.title}
                                </p>
                                {toast.message && (
                                    <p className="mt-0.5 font-body text-body-sm text-landing-on-surface-variant dark:text-landing-surface-variant">
                                        {toast.message}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                aria-label="Dismiss"
                                onClick={() => dismiss(toast.id)}
                                className="shrink-0 text-landing-on-surface-variant transition-colors hover:text-landing-on-surface dark:text-landing-surface-variant dark:hover:text-landing-inverse-on-surface"
                            >
                                <Icon name="close" size="text-sm" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastStore {
    const ctx = useContext(ToastContext);

    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return ctx;
}