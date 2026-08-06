import { Head, router, useForm } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

import Card from '@/components/dashboard/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type Option = { id: number; label: string; score: number };
type Question = {
    id: number;
    title: string;
    description: string | null;
    category: string;
    options: Option[];
};
type Goal = {
    id: number;
    type: string;
    target_amount: string;
    target_date: string;
    priority: string;
};

type Suggestion = {
    goal_type: string;
    target_amount: number;
    target_date: string;
    priority: string;
    reason: string;
};

type Profile = {
    full_name: string | null;
    date_of_birth: string | null;
    gender: string | null;
    occupation: string | null;
    company: string | null;
    annual_income: string | null;
    monthly_expenses: string | null;
    total_assets: string | null;
    total_liabilities: string | null;
    emergency_fund: string | null;
    risk_score: number | null;
    current_step: number;
    risk_profile: { name: string; description: string | null } | null;
};

type Props = {
    profile: Profile | null;
    questions: Question[];
    answers: Record<string, number>;
    goals: Goal[];
    suggestions: Suggestion[];
};

const steps = [
    'Personal',
    'Investor Profile',
    'Risk Assessment',
    'Financial',
    'Goals',
    'Summary',
];

const genderOptions = ['Male', 'Female', 'Other'];
const goalTypes = [
    'retirement',
    'education',
    'house',
    'emergency_fund',
    'wealth_growth',
    'debt_paydown',
];

const inputClass =
    'w-full rounded-xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-4 py-3 text-sm text-dashboard-on-surface transition-colors focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

function Label({ children }: { children: ReactNode }) {
    return (
        <span className="font-body mb-2 block text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
            {children}
        </span>
    );
}

export default function Onboarding({
    profile,
    questions,
    answers,
    goals,
    suggestions,
}: Props) {
    const { auth } = usePage().props;
    const [step, setStep] = useState(profile?.current_step ?? 1);
    const onAdvance = () => setStep((s) => Math.min(6, s + 1));

    return (
        <>
            <Head title="Investment Profile" />
            <div className="min-h-screen bg-dashboard-background bg-gradient-to-br from-dashboard-primary/10 to-dashboard-secondary/10 px-4 py-8 font-dash text-dashboard-on-surface dark:bg-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                <div className="mx-auto max-w-2xl">
                    <LogoMark />
                    <h1 className="mt-6 text-center font-headline text-headline-lg font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        Investment Profile
                    </h1>
                    <p className="mt-1 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        Complete {steps.length} steps to unlock your dashboard.
                        Progress is saved automatically.
                    </p>

                    <Stepper current={step} onJump={setStep} completed={step} />

                    <Card className="mt-6 p-6 md:p-8">
                        <div
                            key={step}
                            className="animate-[fade-in_0.35s_ease-out]"
                        >
                            {step === 1 && (
                                <PersonalStep
                                    profile={profile}
                                    userName={auth.user?.name ?? ''}
                                    onAdvance={onAdvance}
                                />
                            )}
                            {step === 2 && (
                                <QuestionsStep
                                    questions={questions}
                                    answers={answers}
                                    onAdvance={onAdvance}
                                />
                            )}
                            {step === 3 && (
                                <RiskStep
                                    profile={profile}
                                    onAdvance={onAdvance}
                                />
                            )}
                            {step === 4 && (
                                <FinancialStep
                                    profile={profile}
                                    onAdvance={onAdvance}
                                />
                            )}
                            {step === 5 && (
                                <GoalsStep
                                    goals={goals}
                                    suggestions={suggestions}
                                    onboarded={profile?.current_step ?? 1}
                                    onAdvance={onAdvance}
                                />
                            )}
                            {step === 6 && (
                                <SummaryStep profile={profile} goals={goals} />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

function LogoMark() {
    return (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dashboard-primary text-dashboard-on-primary shadow-lg shadow-dashboard-primary/30">
            <Icon name="dataset" size="text-2xl" />
        </div>
    );
}

function Stepper({
    current,
    completed,
    onJump,
}: {
    current: number;
    completed: number;
    onJump: (step: number) => void;
}) {
    return (
        <div className="mt-6 flex items-center justify-between gap-1">
            {steps.map((label, i) => {
                const n = i + 1;
                const done = n < current;
                const active = n === current;

                return (
                    <button
                        key={label}
                        type="button"
                        disabled={n > completed + 1}
                        onClick={() => onJump(n)}
                        className="flex flex-1 flex-col items-center gap-1.5 disabled:cursor-not-allowed"
                    >
                        <span
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
                                done &&
                                    'bg-dashboard-secondary-container text-dashboard-inverse-surface',
                                active &&
                                    'bg-dashboard-primary text-dashboard-on-primary',
                                !done &&
                                    !active &&
                                    'bg-dashboard-surface-variant text-dashboard-on-surface-variant',
                            )}
                        >
                            {done ? <Icon name="check" size="text-sm" /> : n}
                        </span>
                        <span
                            className={cn(
                                'hidden text-[10px] font-medium sm:block',
                                active
                                    ? 'text-dashboard-on-surface dark:text-dashboard-inverse-on-surface'
                                    : 'text-dashboard-on-surface-variant dark:text-dashboard-surface-variant',
                            )}
                        >
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

function PersonalStep({
    profile,
    userName,
    onAdvance,
}: {
    profile: Profile | null;
    userName: string;
    onAdvance: () => void;
}) {
    const toast = useToast();
    const { data, setData, post, processing, errors } = useForm({
        full_name: profile?.full_name ?? userName,
        date_of_birth: profile?.date_of_birth ?? '',
        gender: profile?.gender ?? '',
        occupation: profile?.occupation ?? '',
        company: profile?.company ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/onboarding/step/1', {
            onSuccess: () => {
                toast.success({
                    title: 'Saved',
                    message: 'Personal details updated.',
                });
                onAdvance();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            <h2 className="font-headline text-headline-md font-semibold">
                Personal Information
            </h2>
            <Input
                label="Full name"
                name="full_name"
                placeholder="John Doe"
                required
                value={data.full_name}
                readonly={true}
                onChange={(e) => setData('full_name', e.target.value)}
                error={errors.full_name}
            />
            <Input
                label="Date of birth"
                name="date_of_birth"
                type="date"
                required
                value={data.date_of_birth}
                onChange={(e) => setData('date_of_birth', e.target.value)}
                error={errors.date_of_birth}
            />
            <div>
                <Label>Gender</Label>
                <select
                    name="gender"
                    value={data.gender}
                    onChange={(e) => setData('gender', e.target.value)}
                    className={inputClass}
                    required
                >
                    <option value="" disabled>
                        Select gender
                    </option>
                    {genderOptions.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
            </div>
            <Input
                label="Occupation"
                name="occupation"
                placeholder="Software Engineer"
                required
                value={data.occupation}
                onChange={(e) => setData('occupation', e.target.value)}
                error={errors.occupation}
            />
            <Input
                label="Company"
                name="company"
                placeholder="Acme Inc (optional)"
                value={data.company}
                onChange={(e) => setData('company', e.target.value)}
                error={errors.company}
            />
            <ButtonsBar
                onBack={null}
                processing={processing}
                nextLabel="Save & Continue"
            />
        </form>
    );
}

function QuestionsStep({
    questions,
    answers,
    onAdvance,
}: {
    questions: Question[];
    answers: Record<string, number>;
    onAdvance: () => void;
}) {
    const toast = useToast();
    const { data, setData, post, processing } = useForm({ answers });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/onboarding/step/2', {
            onSuccess: () => {
                toast.success({
                    title: 'Saved',
                    message: 'Your answers were saved.',
                });
                onAdvance();
            },
        });
    }

    if (questions.length === 0) {
        return (
            <p className="text-sm text-dashboard-on-surface-variant">
                No questions yet. Check back later.
            </p>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <h2 className="font-headline text-headline-md font-semibold">
                Investor Profiling
            </h2>
            {questions.map((q) => (
                <div key={q.id}>
                    <h3 className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        {q.title}
                    </h3>
                    {q.description && (
                        <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {q.description}
                        </p>
                    )}
                    <div className="mt-3 space-y-2">
                        {q.options.map((opt) => {
                            const selected = data.answers[q.id] === opt.id;

                            return (
                                <label
                                    key={opt.id}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors',
                                        selected
                                            ? 'border-dashboard-primary bg-dashboard-primary/10 text-dashboard-on-surface dark:text-dashboard-inverse-on-surface'
                                            : 'border-dashboard-outline-variant/30 hover:bg-dashboard-surface-container-low dark:border-white/10',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        className="h-4 w-4 accent-dashboard-primary"
                                        checked={selected}
                                        onChange={() =>
                                            setData('answers', {
                                                ...data.answers,
                                                [q.id]: opt.id,
                                            })
                                        }
                                    />
                                    {opt.label}
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
            <ButtonsBar
                onBack={null}
                processing={processing}
                nextLabel="Save & Continue"
            />
        </form>
    );
}

function RiskStep({
    profile,
    onAdvance,
}: {
    profile: Profile | null;
    onAdvance: () => void;
}) {
    const toast = useToast();
    const { post, processing } = useForm({});

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                post('/onboarding/step/3', {
                    onSuccess: () => {
                        toast.success({
                            title: 'Analyzed',
                            message: 'Your risk profile was generated.',
                        });
                        onAdvance();
                    },
                });
            }}
            className="space-y-6"
        >
            <h2 className="font-headline text-headline-md font-semibold">
                Risk Assessment
            </h2>
            {profile?.risk_profile ? (
                <Card variant="gradient" className="p-6 text-center">
                    <p className="text-xs font-medium tracking-wider text-white/80 uppercase">
                        Your risk profile
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold text-white">
                        {profile.risk_profile.name}
                    </p>
                    <p className="mt-2 text-sm text-white/80">
                        {profile.risk_profile.description}
                    </p>
                    <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold text-white">
                        Risk Score: {profile.risk_score ?? 0}
                    </span>
                </Card>
            ) : (
                <p className="text-sm text-dashboard-on-surface-variant">
                    Click continue to calculate your risk profile from your
                    answers.
                </p>
            )}
            <ButtonsBar
                onBack={null}
                processing={processing}
                nextLabel="Save & Continue"
            />
        </form>
    );
}

function FinancialStep({
    profile,
    onAdvance,
}: {
    profile: Profile | null;
    onAdvance: () => void;
}) {
    const toast = useToast();
    const { data, setData, post, processing, errors } = useForm({
        annual_income: profile?.annual_income ?? '',
        monthly_expenses: profile?.monthly_expenses ?? '',
        total_assets: profile?.total_assets ?? '',
        total_liabilities: profile?.total_liabilities ?? '',
        emergency_fund: profile?.emergency_fund ?? '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/onboarding/step/4', {
            onSuccess: () => {
                toast.success({
                    title: 'Saved',
                    message: 'Financial details updated.',
                });
                onAdvance();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            <h2 className="font-headline text-headline-md font-semibold">
                Financial Health
            </h2>
            <Money
                label="Annual income"
                name="annual_income"
                value={data.annual_income}
                onChange={(v) => setData('annual_income', v)}
                error={errors.annual_income}
            />
            <Money
                label="Monthly expenses"
                name="monthly_expenses"
                value={data.monthly_expenses}
                onChange={(v) => setData('monthly_expenses', v)}
                error={errors.monthly_expenses}
            />
            <Money
                label="Total assets"
                name="total_assets"
                value={data.total_assets}
                onChange={(v) => setData('total_assets', v)}
                error={errors.total_assets}
            />
            <Money
                label="Total liabilities"
                name="total_liabilities"
                value={data.total_liabilities}
                onChange={(v) => setData('total_liabilities', v)}
                error={errors.total_liabilities}
            />
            <Money
                label="Emergency fund"
                name="emergency_fund"
                value={data.emergency_fund}
                onChange={(v) => setData('emergency_fund', v)}
                error={errors.emergency_fund}
            />
            <ButtonsBar
                onBack={null}
                processing={processing}
                nextLabel="Save & Continue"
            />
        </form>
    );
}

function Money({
    label,
    name,
    value,
    onChange,
    error,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <Input
            label={label}
            name={name}
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
        />
    );
}

function GoalsStep({
    goals,
    suggestions,
    onboarded,
    onAdvance,
}: {
    goals: Goal[];
    suggestions: Suggestion[];
    onboarded: number;
    onAdvance: () => void;
}) {
    const toast = useToast();

    function addSuggestion(s: Suggestion) {
        router.post(
            '/goals',
            {
                type: s.goal_type,
                target_amount: String(s.target_amount),
                target_date: s.target_date,
                priority: s.priority,
            },
            {
                onSuccess: () =>
                    toast.success({
                        title: 'Added',
                        message: 'Suggested goal added.',
                    }),
            },
        );
    }

    const { data, setData, post, processing, errors } = useForm({
        goals: [
            {
                type: '',
                target_amount: '',
                target_date: '',
                priority: 'medium',
            },
        ],
        advance: true,
    });

    function submit(advance: boolean) {
        const clean = data.goals.filter(
            (g) => g.type && g.target_amount && g.target_date,
        );

        if (clean.length === 0 && !advance) {
            return;
        }

        setData('advance', advance);
        post('/onboarding/step/5', {
            onSuccess: () => {
                toast.success({
                    title: 'Saved',
                    message: advance ? 'Goals saved.' : 'Goal added.',
                });

                if (advance) {
                    onAdvance();
                }
            },
        });
    }

    return (
        <div className="space-y-6">
            <h2 className="font-headline text-headline-md font-semibold">
                Investment Goals
            </h2>

            {goals.length > 0 && (
                <div className="space-y-2">
                    {goals.map((goal) => (
                        <div
                            key={goal.id}
                            className="flex items-center justify-between rounded-xl border border-dashboard-outline-variant/30 px-4 py-3 text-sm dark:border-white/10"
                        >
                            <span className="font-medium text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                {goal.type.replaceAll('_', ' ')}
                            </span>
                            <span className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                ${Number(goal.target_amount).toLocaleString()} ·{' '}
                                {goal.target_date}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4 rounded-xl border border-dashboard-outline-variant/20 p-4 dark:border-white/10">
                <div>
                    <Label>Goal type</Label>
                    <select
                        value={data.goals[0].type}
                        onChange={(e) =>
                            setData('goals.0.type', e.target.value)
                        }
                        className={inputClass}
                    >
                        <option value="" disabled>
                            Select goal
                        </option>
                        {goalTypes.map((g) => (
                            <option key={g} value={g}>
                                {g.replaceAll('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Money
                        label="Target amount"
                        name="target_amount"
                        value={data.goals[0].target_amount}
                        onChange={(v) => setData('goals.0.target_amount', v)}
                        error={errors['goals.0.target_amount']}
                    />
                    <Input
                        label="Target date"
                        name="target_date"
                        type="date"
                        value={data.goals[0].target_date}
                        onChange={(e) =>
                            setData('goals.0.target_date', e.target.value)
                        }
                        error={errors['goals.0.target_date']}
                    />
                </div>
                <div>
                    <Label>Priority</Label>
                    <select
                        value={data.goals[0].priority}
                        onChange={(e) =>
                            setData('goals.0.priority', e.target.value)
                        }
                        className={inputClass}
                    >
                        {['low', 'medium', 'high'].map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => submit(false)}
                        disabled={processing}
                    >
                        <Icon name="add" size="text-sm" /> Add goal
                    </Button>
                    <Button
                        variant="solid"
                        type="button"
                        onClick={() => submit(true)}
                        disabled={processing}
                    >
                        Save & Continue
                    </Button>
                </div>
            </div>
            <div>
                <h3 className="text-title-md font-headline font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                    Suggested for you
                </h3>
                <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    Based on your financial profile.
                </p>
                {suggestions.length === 0 ? (
                    <p className="mt-3 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        Complete your financial data to get goal suggestions.
                    </p>
                ) : (
                    <div className="mt-3 space-y-2">
                        {suggestions.map((s, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between gap-3 rounded-xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-lowest px-4 py-3 dark:border-white/10"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                        {s.goal_type.replaceAll('_', ' ')}
                                    </p>
                                    <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        {s.reason}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        ${s.target_amount.toLocaleString()}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => addSuggestion(s)}
                                        className="text-xs font-semibold text-dashboard-primary hover:underline dark:text-dashboard-inverse-primary"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {onboarded < 6 && (
                <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    You can add more goals later. Save & Continue to proceed.
                </p>
            )}
        </div>
    );
}

function SummaryStep({
    profile,
    goals,
}: {
    profile: Profile | null;
    goals: Goal[];
}) {
    const toast = useToast();
    const { post, processing } = useForm({});

    return (
        <div className="space-y-6">
            <h2 className="font-headline text-headline-md font-semibold">
                Review & Submit
            </h2>

            <Card variant="light-primary" className="space-y-3 border-0 p-6">
                <Row label="Full name" value={profile?.full_name} />
                <Row label="Gender" value={profile?.gender} />
                <Row label="Occupation" value={profile?.occupation} />
                <Row label="Company" value={profile?.company} />
                <Row label="Risk profile" value={profile?.risk_profile?.name} />
                <Row
                    label="Risk score"
                    value={String(profile?.risk_score ?? '')}
                />
                <Row
                    label="Annual income"
                    value={money(profile?.annual_income)}
                />
                <Row
                    label="Monthly expenses"
                    value={money(profile?.monthly_expenses)}
                />
                <Row
                    label="Emergency fund"
                    value={money(profile?.emergency_fund)}
                />
            </Card>

            <h3 className="text-title-md font-headline font-semibold">Goals</h3>
            {goals.length === 0 ? (
                <p className="text-sm text-dashboard-on-surface-variant">
                    No goals added.
                </p>
            ) : (
                <ul className="space-y-2">
                    {goals.map((goal) => (
                        <li
                            key={goal.id}
                            className="flex justify-between rounded-xl border border-dashboard-outline-variant/30 px-4 py-3 text-sm dark:border-white/10"
                        >
                            <span className="capitalize">
                                {goal.type.replaceAll('_', ' ')}
                            </span>
                            <span>
                                {money(goal.target_amount)} · {goal.target_date}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            <Button
                variant="primary"
                fullWidth
                size="lg"
                type="button"
                disabled={processing}
                onClick={() => {
                    post('/onboarding/complete', {
                        onSuccess: () =>
                            toast.success({
                                title: 'Done!',
                                message: 'Your profile is complete.',
                            }),
                    });
                }}
            >
                Submit Profile
            </Button>
        </div>
    );
}

function Row({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex justify-between gap-4">
            <span className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </span>
            <span className="text-sm font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                {value || '—'}
            </span>
        </div>
    );
}

function money(value?: string | null): string {
    if (!value) {
        return '—';
    }

    return (
        '$' +
        Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })
    );
}

function ButtonsBar({
    onBack,
    processing,
    nextLabel,
}: {
    onBack: (() => void) | null;
    processing: boolean;
    nextLabel: string;
}) {
    return (
        <div className="flex justify-end gap-3 pt-2">
            {onBack && (
                <Button variant="outline" type="button" onClick={onBack}>
                    <Icon name="back" size="text-sm" /> Back
                </Button>
            )}
            <Button variant="solid" type="submit" disabled={processing}>
                {nextLabel} <Icon name="forward" size="text-sm" />
            </Button>
        </div>
    );
}
