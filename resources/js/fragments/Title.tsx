import type { ReactNode } from 'react';

export default function Title({ children }: { children: ReactNode }) {
    return (
        <div className="inline-block">
            <span className="text-sm font-semibold tracking-widest text-landing-primary uppercase dark:text-landing-secondary-container">
                {children}
            </span>
            <div className="mt-2 h-[3px] w-20 overflow-hidden rounded-full bg-white/10">
                <div className="animate-expand h-full origin-left rounded-full bg-landing-primary dark:bg-landing-secondary-container" />
            </div>
        </div>
    );
}
