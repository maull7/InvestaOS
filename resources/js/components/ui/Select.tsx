import type { ComponentPropsWithoutRef } from 'react';

type SelectProps = {
    label?: string;
    name: string;
    options: Array<{ value: string; label: string }>;
    error?: string;
} & Omit<ComponentPropsWithoutRef<'select'>, 'name' | 'className'>;

export default function Select({
    label,
    name,
    options,
    error,
    ...rest
}: SelectProps) {
    return (
        <label className="block">
            {label && (
                <span className="mb-2 block font-body text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                    {label}
                </span>
            )}
            <select
                name={name}
                aria-invalid={error ? true : undefined}
                className={`w-full rounded-xl border px-4 py-3 font-body text-body-md text-landing-on-surface transition-all duration-200 focus:outline-none dark:text-landing-inverse-on-surface ${
                    error
                        ? 'border-landing-error bg-landing-error-container/20 focus:border-landing-error focus:ring-2 focus:ring-landing-error/30'
                        : 'border-transparent bg-landing-surface-container-low focus:border-landing-primary focus:bg-landing-surface focus:ring-2 focus:ring-landing-primary/30 dark:bg-white/5 dark:focus:bg-white/10'
                }`}
                {...rest}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <span className="mt-1.5 block font-body text-label-sm text-landing-error">
                    {error}
                </span>
            )}
        </label>
    );
}
