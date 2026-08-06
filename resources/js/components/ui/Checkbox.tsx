import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type CheckboxProps = {
    label: ReactNode;
    name?: string;
} & Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'name' | 'className'>;

export default function Checkbox({ label, name, ...rest }: CheckboxProps) {
    return (
        <label
            className={cn(
                'flex cursor-pointer items-start gap-2 font-body text-label-sm text-landing-on-surface-variant dark:text-landing-surface-variant',
            )}
        >
            <input
                type="checkbox"
                name={name}
                className="mt-0.5 h-4 w-4 rounded border-landing-outline-variant text-landing-primary focus:ring-landing-primary/30"
                {...rest}
            />
            <span>{label}</span>
        </label>
    );
}
