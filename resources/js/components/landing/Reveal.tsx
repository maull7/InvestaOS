import { useEffect, useRef } from 'react';

import type { PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

type RevealProps = PropsWithChildren<{
    className?: string;
    delay?: number;
}>;

export default function Reveal({
    children,
    className,
    delay = 0,
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;

        if (!el) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('reveal-visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn('reveal', className)}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
