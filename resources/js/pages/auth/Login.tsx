import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import AuthLayout from '@/components/auth/AuthLayout';
import Icon from '@/components/landing/Icon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const toast = useToast();

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/login', {
            onSuccess: () => reset('password'),
        });
    }

    function HandleGoogleSign() {
        toast.info({
            title: 'Google Sign In',
            message: 'Google Sign In is not yet implemented.',
        });
    }

    return (
        <>
            <Head title="Login" />
            <AuthLayout
                title="Welcome back"
                subtitle="Sign in to continue managing your finances."
            >
                <form className="space-y-5" onSubmit={submit}>
                    <Input
                        label="Email address"
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        required
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        required
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        className="mt-5 cursor-pointer"
                        fullWidth
                        size="lg"
                        disabled={processing}
                    >
                        {processing ? 'Signing in…' : 'Sign in'}
                    </Button>
                    <Button
                        onClick={HandleGoogleSign}
                        className="mt-5 cursor-pointer"
                        variant="light"
                        fullWidth
                        size="lg"
                        disabled={processing}
                    >
                        <Icon name="google" size="text-xl" className="mr-2" />
                        Sign in with Google
                    </Button>
                    <div className="flex items-center gap-3 py-1">
                        <span className="h-px flex-1 bg-landing-outline-variant/40 dark:bg-white/10" />
                        <span className="font-body text-label-sm text-landing-on-surface-variant dark:text-landing-surface-variant">
                            New here?
                        </span>
                        <span className="h-px flex-1 bg-landing-outline-variant/40 dark:bg-white/10" />
                    </div>
                    <p className="font-body text-center text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                        Don&apos;t have an account?{' '}
                        <a
                            href="/register"
                            className="font-semibold text-landing-primary hover:underline dark:text-landing-inverse-primary"
                        >
                            Create one
                        </a>
                    </p>
                </form>
            </AuthLayout>
        </>
    );
}
