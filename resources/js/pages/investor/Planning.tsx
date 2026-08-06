import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import GoalModal from '@/components/ui/GoalModal';
import type { GoalFormData } from '@/components/ui/GoalModal';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type Goal = {
    id: number;
    type: string;
    target_amount: string;
    target_date: string;
    priority: string;
};

type Profile = {
    full_name: string | null;
    annual_income: string | null;
    monthly_expenses: string | null;
    total_assets: string | null;
    total_liabilities: string | null;
    risk_score: number | null;
    risk_profile: {
        slug: string;
        name: string;
        description: string | null;
    } | null;
};

type Suggestion = {
    goal_type: string;
    target_amount: number;
    target_date: string;
    priority: string;
    reason: string;
};

type Props = {
    profile: Profile | null;
    goals: Goal[];
    allocations: { asset: string; pct: number }[];
    suggestions: Suggestion[];
};

const bars = [
    'bg-dashboard-primary',
    'bg-dashboard-secondary',
    'bg-dashboard-on-surface-variant',
    'bg-dashboard-primary-fixed-dim',
];

function money(value: string | null | undefined): number {
    return Number(value ?? 0);
}

function fmt(value: number): string {
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function projection(monthly: number, target: number): string | null {
    if (monthly <= 0 || target <= 0) {
        return null;
    }

    const months = Math.ceil(target / monthly);
    const years = months / 12;

    const span = years >= 1 ? `${Math.ceil(years)} yr` : `${months} mo`;

    return `~${span} at ${fmt(monthly)}/mo`;
}

export default function Planning({
    profile,
    goals,
    allocations,
    suggestions,
}: Props) {
    const toast = useToast();
    const [goalOpen, setGoalOpen] = useState(false);
    const [editing, setEditing] = useState<GoalFormData | null>(null);
    const [deleting, setDeleting] = useState<Goal | null>(null);

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

    function openAdd() {
        setEditing(null);
        setGoalOpen(true);
    }

    function openEdit(goal: Goal) {
        setEditing(goal);
        setGoalOpen(true);
    }

    function confirmDelete() {
        if (!deleting) {
            return;
        }

        router.delete(`/goals/${deleting.id}`, {
            onSuccess: () => {
                toast.success({
                    title: 'Deleted',
                    message: 'Investment goal removed.',
                });
                setDeleting(null);
            },
        });
    }

    const allocation = allocations;
    const disposable =
        money(profile?.annual_income) / 12 - money(profile?.monthly_expenses);
    const suggested = Math.max(0, Math.round(disposable * 0.5));

    return (
        <>
            <Head title="Investment Planning" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Investment Planning
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            A suggested plan based on your risk profile and
                            finances.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card variant="gradient" className="p-6 lg:col-span-1">
                            <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-white/80 uppercase">
                                <Icon name="query_stats" size="text-sm" />
                                Suggested Allocation
                            </div>
                            <p className="mt-2 text-sm text-white/80">
                                Based on your
                            </p>
                            <p className="font-headline text-2xl font-bold text-white">
                                {profile?.risk_profile?.name ?? 'Balanced'}{' '}
                                profile
                            </p>
                            <div className="mt-5 space-y-4">
                                {allocation.map((row, i) => (
                                    <div key={row.asset}>
                                        <div className="mb-1 flex items-center justify-between text-xs text-white/90">
                                            <span>{row.asset}</span>
                                            <span className="font-bold">
                                                {row.pct}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full',
                                                    bars[i % bars.length],
                                                )}
                                                style={{ width: `${row.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="space-y-6 lg:col-span-2">
                            <Card variant="light-primary" className="p-6">
                                <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                    <Icon name="bolt" size="text-sm" />
                                    Monthly Capacity
                                </div>
                                <div className="mt-4 grid grid-cols-3 gap-4">
                                    <Capacity
                                        label="Monthly income"
                                        value={fmt(
                                            money(profile?.annual_income) / 12,
                                        )}
                                    />
                                    <Capacity
                                        label="Monthly expenses"
                                        value={fmt(
                                            money(profile?.monthly_expenses),
                                        )}
                                    />
                                    <Capacity
                                        label="Disposable"
                                        value={fmt(disposable)}
                                    />
                                </div>
                                <div className="mt-5 rounded-xl border border-dashboard-outline-variant/20 bg-dashboard-surface-container-low p-4 dark:border-white/10 dark:bg-white/5">
                                    <p className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        Suggested monthly investment{' '}
                                        <span className="font-headline font-bold text-dashboard-primary dark:text-dashboard-inverse-primary">
                                            {fmt(suggested)}
                                        </span>{' '}
                                        (about half your disposable income).
                                    </p>
                                </div>
                            </Card>

                            <Card variant="light-secondary" className="p-6">
                                <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                    <Icon
                                        name="account_balance_wallet"
                                        size="text-sm"
                                    />
                                    Snapshot
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                                    <Capacity
                                        label="Total assets"
                                        value={fmt(
                                            money(profile?.total_assets),
                                        )}
                                    />
                                    <Capacity
                                        label="Total liabilities"
                                        value={fmt(
                                            money(profile?.total_liabilities),
                                        )}
                                    />
                                    <Capacity
                                        label="Net worth"
                                        value={fmt(
                                            money(profile?.total_assets) -
                                                money(
                                                    profile?.total_liabilities,
                                                ),
                                        )}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>

                    <Card className="overflow-hidden dark:bg-white/5">
                        <div className="border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                            <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Suggested Goals
                            </h4>
                            <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Based on your financial profile.
                            </p>
                        </div>
                        {suggestions.length === 0 ? (
                            <p className="px-6 py-8 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Complete your financial data to get goal
                                suggestions.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                                {suggestions.map((s, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-lowest px-4 py-4 dark:border-white/10 dark:bg-white/5"
                                    >
                                        <div>
                                            <p className="font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                                {s.goal_type.replaceAll(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                            <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {s.reason}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                $
                                                {s.target_amount.toLocaleString()}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => addSuggestion(s)}
                                                className="mt-1 text-xs font-semibold text-dashboard-primary hover:underline dark:text-dashboard-inverse-primary"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                            <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Toward Your Goals
                            </h4>
                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-xs font-bold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                    {goals.length}
                                </span>
                                <Button
                                    variant="solid"
                                    onClick={openAdd}
                                    className="px-4 py-1.5 text-xs"
                                >
                                    <Icon name="add" size="text-sm" /> Add Goal
                                </Button>
                            </div>
                        </div>
                        {goals.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                No investment goals yet. Add some to see a plan.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                                {goals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-dashboard-outline-variant/30 px-4 py-4 dark:border-white/10"
                                    >
                                        <div>
                                            <p className="font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                                {goal.type.replaceAll('_', ' ')}
                                            </p>
                                            <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                Target {goal.target_date}
                                            </p>
                                            {projection(
                                                suggested,
                                                Number(goal.target_amount),
                                            ) && (
                                                <p className="mt-1.5 inline-block rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-[10px] font-bold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                                    {projection(
                                                        suggested,
                                                        Number(
                                                            goal.target_amount,
                                                        ),
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {fmt(
                                                    Number(goal.target_amount),
                                                )}
                                            </p>
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    aria-label="Edit goal"
                                                    onClick={() =>
                                                        openEdit(goal)
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-dashboard-on-surface-variant transition-colors hover:bg-dashboard-surface-container-high hover:text-dashboard-on-surface dark:text-dashboard-surface-variant dark:hover:bg-white/10"
                                                >
                                                    <Icon
                                                        name="edit"
                                                        size="text-sm"
                                                    />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label="Delete goal"
                                                    onClick={() =>
                                                        setDeleting(goal)
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-dashboard-error transition-colors hover:bg-dashboard-error/10"
                                                >
                                                    <Icon
                                                        name="trash"
                                                        size="text-sm"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </DashboardLayout>

            <GoalModal
                open={goalOpen}
                goal={editing}
                onClose={() => setGoalOpen(false)}
            />

            <ConfirmModal
                open={deleting !== null}
                title="Delete goal?"
                message={`Are you sure you want to delete the "${deleting?.type.replaceAll('_', ' ') ?? ''}" goal? This cannot be undone.`}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
}

function Capacity({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="font-body text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </p>
            <p className="mt-1 font-headline text-xl font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value}
            </p>
        </div>
    );
}
