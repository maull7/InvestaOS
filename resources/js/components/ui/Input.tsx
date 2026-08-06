import type { ComponentPropsWithoutRef } from 'react';

type InputProps = {
    label: string;
    type?: string;
    name: string;
    autoComplete?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    readonly?: boolean;
} & Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'name' | 'className'>;

export default function Input({
    label,
    type = 'text',
    name,
    autoComplete,
    placeholder,
    required,
    error,
    readonly = false,
    ...rest
}: InputProps) {
    return (
        <label className="block">
            <span className="mb-2 block font-body text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                {label}
            </span>
            <input
                type={type}
                name={name}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required={required}
                aria-invalid={error ? true : undefined}
                readOnly={readonly}
                className={`w-full rounded-xl border px-4 py-3 font-body text-body-md text-landing-on-surface transition-all duration-200 placeholder:text-landing-on-surface-variant/50 focus:outline-none dark:text-landing-inverse-on-surface dark:placeholder:text-landing-surface-variant/40 ${
                    error
                        ? 'border-landing-error bg-landing-error-container/20 focus:border-landing-error focus:ring-2 focus:ring-landing-error/30'
                        : 'border-transparent bg-landing-surface-container-low focus:border-landing-primary focus:bg-landing-surface focus:ring-2 focus:ring-landing-primary/30 dark:bg-white/5 dark:focus:bg-white/10'
                }`}
                {...rest}
            />
            {error && (
                <span className="mt-1.5 block font-body text-label-sm text-landing-error">
                    {error}
                </span>
            )}
        </label>
    );
}
