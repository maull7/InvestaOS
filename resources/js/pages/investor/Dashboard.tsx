import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import type { StockQuote } from '@/components/chart/StockChart';
import BalanceChart from '@/components/dashboard/BalanceChart';
import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import GoalModal from '@/components/ui/GoalModal';
import type { GoalFormData } from '@/components/ui/GoalModal';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { bondTypeLabel, fmtPct, fmtYears } from '@/lib/bonds';
import type { BondCalc } from '@/lib/bonds';
import type { Bar } from '@/lib/indicators';
import { cn } from '@/lib/utils';

type Goal = {
    id: number;
    type: string;
    target_amount: string;
    target_date: string;
    priority: 'low' | 'medium' | 'high';
};

type Props = {
    profile: {
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
        risk_profile: { name: string; description: string | null } | null;
    };
    goals: Goal[];
    allocations: { asset: string; pct: number }[];
    watchlist: {
        code: string;
        name: string;
        quote: StockQuote | null;
    }[];
    bondWatchlist: {
        bond: {
            code: string;
            name: string;
            type: string;
            coupon: number | null;
        };
        calc: BondCalc;
    }[];
};

const priorityTone: Record<Goal['priority'], string> = {
    low: 'bg-dashboard-surface-variant text-dashboard-on-surface-variant',
    medium: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    high: 'bg-dashboard-secondary-container text-dashboard-inverse-surface',
};

function currency(value: string | null): string {
    if (!value) {
        return '$0';
    }

    return `$${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
    })}`;
}

export default function InvestorDashboard({
    profile,
    goals,
    allocations,
    watchlist,
    bondWatchlist,
}: Props) {
    const toast = useToast();
    const [goalOpen, setGoalOpen] = useState(false);
    const [editing, setEditing] = useState<GoalFormData | null>(null);
    const [deleting, setDeleting] = useState<Goal | null>(null);

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

    return (
        <>
            <Head title="Dashboard" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Hello,{' '}
                                {profile.full_name?.split(' ')[0] ?? 'Investor'}
                            </h3>
                            <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Here is a snapshot of your portfolio.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            href="/profile"
                            className="px-4 py-2 text-xs"
                        >
                            <Icon name="edit" size="text-sm" /> Edit Profile
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Card variant="gradient" className="p-6 lg:col-span-1">
                            <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-white/80 uppercase">
                                <Icon name="query_stats" size="text-sm" />
                                Risk Profile
                            </div>
                            <p className="mt-3 font-headline text-3xl font-bold text-white">
                                {profile.risk_profile?.name ?? '—'}
                            </p>
                            <p className="mt-2 text-sm text-white/80">
                                {profile.risk_profile?.description ??
                                    'No assessment yet.'}
                            </p>
                            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                                Risk Score: {profile.risk_score ?? 0}
                            </div>
                            {allocations.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-medium tracking-wider text-white/80 uppercase">
                                        Suitable assets
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {allocations.map((a) => (
                                            <span
                                                key={a.asset}
                                                className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white"
                                            >
                                                {a.asset} {a.pct}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card variant="light" className="p-6 lg:col-span-2">
                            <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Financial Summary
                            </h4>
                            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                                <Summary
                                    label="Annual Income"
                                    value={currency(profile.annual_income)}
                                />
                                <Summary
                                    label="Monthly Expenses"
                                    value={currency(profile.monthly_expenses)}
                                />
                                <Summary
                                    label="Total Assets"
                                    value={currency(profile.total_assets)}
                                />
                                <Summary
                                    label="Emergency Fund"
                                    value={currency(profile.emergency_fund)}
                                />
                            </div>
                        </Card>
                    </div>

                    <BalanceChart />

                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                            <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Market Watch
                            </h4>
                            <a
                                href="/stocks"
                                className="text-sm font-semibold text-dashboard-primary hover:underline"
                            >
                                Lihat semua →
                            </a>
                        </div>
                        {watchlist.length === 0 ? (
                            <p className="px-6 py-8 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Belum ada saham. Admin menambahkannya via Master
                                Stocks.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-4">
                                {watchlist.map((s) => (
                                    <MarketStock
                                        key={s.code}
                                        code={s.code}
                                        name={s.name}
                                        quote={s.quote}
                                    />
                                ))}
                            </div>
                        )}
                    </Card>

                    {bondWatchlist.length > 0 && (
                        <Card className="overflow-hidden">
                            <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                                <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    Pantauan Obligasi
                                </h4>
                                <a
                                    href="/bonds"
                                    className="text-sm font-semibold text-dashboard-primary hover:underline"
                                >
                                    Lihat semua →
                                </a>
                            </div>
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
                                {bondWatchlist.map(({ bond, calc }) => (
                                    <a
                                        key={bond.code}
                                        href={`/bonds/${bond.code}`}
                                        className="rounded-xl border border-dashboard-outline-variant/10 p-4 transition-colors hover:bg-dashboard-surface-container-low dark:border-white/10 dark:hover:bg-white/5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-headline-sm font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {bond.code}
                                            </p>
                                            <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-[10px] font-semibold text-dashboard-on-surface-variant capitalize dark:bg-white/10 dark:text-dashboard-surface-variant">
                                                {bondTypeLabel(bond.type)}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 truncate text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                            {bond.name}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                YTM{' '}
                                                <b className="text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    {fmtPct(calc.ytm)}
                                                </b>
                                            </span>
                                            <span className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                <b className="text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    {fmtYears(
                                                        calc.yearsRemaining,
                                                    )}
                                                </b>{' '}
                                                sisa
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </Card>
                    )}

                    <Card className="overflow-hidden">
                        <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                            <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Investment Goals
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
                            <p className="px-6 py-8 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                No goals yet. Complete your profile to get
                                started.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                                {goals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="flex items-center justify-between gap-4 rounded-2xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-lowest p-4 dark:border-white/10 dark:bg-white/5"
                                    >
                                        <div>
                                            <p className="font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                                {goal.type.replaceAll('_', ' ')}
                                            </p>
                                            <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                Target {goal.target_date}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    {currency(
                                                        goal.target_amount,
                                                    )}
                                                </p>
                                                <span
                                                    className={cn(
                                                        'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold capitalize',
                                                        priorityTone[
                                                            goal.priority
                                                        ],
                                                    )}
                                                >
                                                    {goal.priority}
                                                </span>
                                            </div>
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

function MarketStock({
    code,
    name,
    quote,
}: {
    code: string;
    name: string;
    quote: StockQuote | null;
}) {
    const up = quote !== null && quote.change >= 0;
    const price = quote
        ? new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: quote.currency ?? 'IDR',
              maximumFractionDigits: 0,
          }).format(quote.price)
        : '—';

    return (
        <a
            href={`/stocks/${code}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-dashboard-outline-variant/15 bg-dashboard-surface-container-lowest p-4 shadow-[0px_6px_18px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-primary/30 hover:shadow-[0px_10px_28px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                    <div
                        className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-[11px] font-bold',
                            up
                                ? 'bg-dashboard-secondary-container/40 text-dashboard-inverse-surface dark:bg-emerald-500/15 dark:text-emerald-400'
                                : 'bg-dashboard-error/10 text-dashboard-error',
                        )}
                    >
                        {code.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-headline text-base font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {code}
                        </p>
                        <p className="truncate text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {name}
                        </p>
                    </div>
                </div>
                {quote && (
                    <span
                        className={cn(
                            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold',
                            up
                                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400'
                                : 'bg-dashboard-error/10 text-dashboard-error',
                        )}
                    >
                        {up ? '▲' : '▼'} {up ? '+' : ''}
                        {quote.changePercent.toFixed(2)}%
                    </span>
                )}
            </div>

            {quote ? (
                <div className="mt-3 flex-1">
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                {quote.exchangeName ?? 'Harga'}
                            </p>
                            <p className="font-headline text-xl leading-tight font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                {price}
                            </p>
                        </div>
                        <span
                            className={cn(
                                'pb-1 text-xs font-semibold',
                                up
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-dashboard-error',
                            )}
                        >
                            {up ? '+' : ''}
                            {quote.change.toFixed(2)}
                        </span>
                    </div>
                    <MiniSparkline bars={quote.history} up={up} />
                </div>
            ) : (
                <div className="mt-3 flex flex-1 items-center justify-center rounded-lg border border-dashed border-dashboard-outline-variant/30 py-6 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    Data tak tersedia
                </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-dashboard-outline-variant/10 pt-2 text-[11px] text-dashboard-on-surface-variant dark:border-white/10 dark:text-dashboard-surface-variant">
                <span>Lihat detail</span>
                <span className="font-bold text-dashboard-primary transition-transform group-hover:translate-x-0.5">
                    →
                </span>
            </div>
        </a>
    );
}

function MiniSparkline({ bars, up }: { bars: Bar[]; up: boolean }) {
    if (bars.length < 2) {
        return null;
    }

    const W = 120;
    const H = 36;
    const closes = bars.map((b) => b.c);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const span = max - min || 1;
    const points = closes
        .map(
            (c, i) =>
                `${((i / (closes.length - 1)) * W).toFixed(1)},${(H - 3 - ((c - min) / span) * (H - 6)).toFixed(1)}`,
        )
        .join(' ');

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mt-2 h-9 w-full"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <polyline
                points={points}
                fill="none"
                stroke={up ? '#22c55e' : '#ef4444'}
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Summary({ label, value }: { label: string; value: string }) {
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
