import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import Icon from '@/components/landing/Icon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const toast = useToast();

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                reset();
                toast.success({
                    title: 'Akun berhasil dibuat',
                    message: 'Selamat datang! Kamu sudah masuk.',
                });
            },
        });
    }

    function HandleGoogleSign() {
        toast.info({
            title: 'Register with Google',
            message: 'Register with Google is not yet implemented.',
        });
    }

    return (
        <>
            <Head title="Register" />
            <AuthLayout
                title="Create your account"
                subtitle="Start sending money globally in minutes. No setup fees."
            >
                <form className="space-y-5" onSubmit={submit}>
                    <Input
                        label="Full name"
                        name="name"
                        autoComplete="name"
                        placeholder="John Doe"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
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
                        autoComplete="new-password"
                        placeholder="Create a password"
                        required
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                    <Input
                        label="Confirm password"
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        required
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        error={errors.password_confirmation}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        className="mt-5 cursor-pointer text-landing-dark"
                        size="lg"
                        disabled={processing}
                    >
                        {processing ? 'Creating account…' : 'Create account'}
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
                    <p className="font-body text-center text-body-md text-landing-on-surface-variant dark:text-landing-surface-variant">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="font-semibold text-landing-primary hover:underline dark:text-landing-inverse-primary"
                        >
                            Sign in
                        </a>
                    </p>
                </form>
            </AuthLayout>
        </>
    );
}
