import { Head, router } from '@inertiajs/react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AiResearchButton from '@/components/ui/AiResearchButton';
import {
    bondTypeLabel,
    fmtMoney,
    fmtPct,
    fmtYears,
    freqLabel,
} from '@/lib/bonds';
import type { BondCalc } from '@/lib/bonds';
import { cn } from '@/lib/utils';

type Bond = {
    id: number;
    code: string;
    name: string;
    type: string;
    issuer: string | null;
    coupon: number | null;
    maturity_date: string | null;
    issue_date: string | null;
    face_value: number | null;
    payment_frequency: string;
    last_price: number | null;
    yield: number | null;
    benchmark_yield: number | null;
    benchmark_label: string | null;
    currency: string;
    status: string;
};

type Props = { bond: Bond; calc: BondCalc | null; isWatched: boolean };

function Stat({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint?: string;
}) {
    return (
        <div className="rounded-xl bg-dashboard-surface-container-low/50 p-4 dark:bg-white/5">
            <p className="text-[10px] font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                {label}
            </p>
            <p className="mt-1 font-headline text-xl font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value}
            </p>
            {hint && (
                <p className="mt-0.5 text-[11px] text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    {hint}
                </p>
            )}
        </div>
    );
}

export default function BondShow({ bond, calc, isWatched }: Props) {
    const maturity = bond.maturity_date
        ? new Date(bond.maturity_date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '—';
    const spreadTone =
        calc?.spread !== null && calc?.spread !== undefined
            ? calc.spread >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-dashboard-error'
            : '';

    return (
        <>
            <Head title={`${bond.code} — ${bond.name}`} />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <a
                            href="/bonds"
                            className="text-sm font-semibold text-dashboard-primary hover:underline"
                        >
                            ← Semua obligasi
                        </a>
                        <button
                            type="button"
                            onClick={() =>
                                router.post(`/bonds/${bond.code}/watch`)
                            }
                            className={cn(
                                'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
                                isWatched
                                    ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400'
                                    : 'bg-dashboard-surface-container-low text-dashboard-on-surface-variant hover:bg-dashboard-surface-container-high dark:bg-white/5 dark:text-dashboard-surface-variant',
                            )}
                        >
                            {isWatched ? '★ Dipantau' : '☆ Pantau'}
                        </button>
                        <AiResearchButton assetType="bond" assetId={bond.id} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-headline-xl font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {bond.code}
                        </h3>
                        <span className="rounded-full bg-dashboard-surface-variant px-3 py-1 text-xs font-semibold text-dashboard-on-surface-variant capitalize dark:bg-white/10 dark:text-dashboard-surface-variant">
                            {bondTypeLabel(bond.type)}
                        </span>
                        <span
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-semibold',
                                bond.status === 'active'
                                    ? 'bg-dashboard-secondary-container text-dashboard-inverse-surface'
                                    : 'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
                            )}
                        >
                            {bond.status}
                        </span>
                        {calc?.estimated && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                                Estimasi (harga par)
                            </span>
                        )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Card
                            className="flex flex-col items-start justify-center p-6"
                            variant="light-primary"
                        >
                            <p className="text-xs font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                Yield to Maturity{' '}
                                {calc?.estimated ? '(estimasi)' : ''}
                            </p>
                            <p className="mt-2 font-headline text-4xl font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                {fmtPct(calc?.ytm)}
                            </p>
                            <p className="mt-1 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {calc?.estimated
                                    ? 'Diperkirakan dari kupon (harga par)'
                                    : bond.last_price !== null
                                      ? `Dari harga ${bond.last_price.toFixed(2)}`
                                      : `Dari yield ${fmtPct(bond.yield)}`}
                            </p>
                            <div className="mt-4 flex items-center gap-3 text-sm">
                                <span className="rounded-lg bg-dashboard-surface-container-low px-2 py-1 text-dashboard-on-surface-variant dark:bg-white/5 dark:text-dashboard-surface-variant">
                                    Sisa tenor: {fmtYears(calc?.yearsRemaining)}
                                </span>
                                <span className="rounded-lg bg-dashboard-surface-container-low px-2 py-1 text-dashboard-on-surface-variant dark:bg-white/5 dark:text-dashboard-surface-variant">
                                    Kupon/thn:{' '}
                                    {fmtMoney(
                                        calc?.couponPerYear,
                                        bond.currency,
                                    )}
                                </span>
                            </div>
                        </Card>

                        <Card className="p-6 lg:col-span-2">
                            <h4 className="mb-4 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Analisis Obligasi
                            </h4>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                <Stat
                                    label="Coupon / bayar"
                                    value={fmtPct(calc?.couponPerPayment)}
                                    hint={`${freqLabel(bond.payment_frequency)} · ${fmtMoney(calc?.couponValuePerPayment, bond.currency)}`}
                                />
                                <Stat
                                    label="Duration"
                                    value={fmtYears(calc?.durationYears)}
                                    hint="Macaulay (perkiraan)"
                                />
                                <Stat
                                    label="Accrued interest"
                                    value={fmtPct(calc?.accruedPct, 3)}
                                    hint="per 100 nominal"
                                />
                                <Stat
                                    label="Clean price"
                                    value={
                                        calc?.cleanPrice !== null &&
                                        calc?.cleanPrice !== undefined
                                            ? calc.cleanPrice.toFixed(2)
                                            : '—'
                                    }
                                    hint="per 100 nominal"
                                />
                                <Stat
                                    label="Dirty price"
                                    value={
                                        calc?.dirtyPrice !== null &&
                                        calc?.dirtyPrice !== undefined
                                            ? calc.dirtyPrice.toFixed(2)
                                            : '—'
                                    }
                                    hint="clean + accrued"
                                />
                                <Stat
                                    label={`Spread vs ${bond.benchmark_label ?? 'acuan'}`}
                                    value={
                                        calc?.spread !== null &&
                                        calc?.spread !== undefined
                                            ? `${calc.spread >= 0 ? '+' : ''}${calc.spread.toFixed(2)}%`
                                            : '—'
                                    }
                                    hint="kupon − acuan"
                                />
                            </div>
                            {calc?.spread !== null &&
                                calc?.spread !== undefined && (
                                    <p
                                        className={cn(
                                            'mt-3 text-sm font-semibold',
                                            spreadTone,
                                        )}
                                    >
                                        {bond.benchmark_label ?? 'Acuan'}{' '}
                                        {fmtPct(bond.benchmark_yield)} →{' '}
                                        {calc.spread >= 0
                                            ? 'premium'
                                            : 'diskonto'}{' '}
                                        {calc.spread >= 0 ? '+' : ''}
                                        {calc.spread.toFixed(2)}% terhadap kupon
                                    </p>
                                )}
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Details
                        </h4>
                        <div className="grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                            <Meta label="Code" value={bond.code} />
                            <Meta label="Nama" value={bond.name} />
                            <Meta
                                label="Tipe"
                                value={bondTypeLabel(bond.type)}
                            />
                            <Meta label="Issuer" value={bond.issuer ?? '—'} />
                            <Meta label="Coupon" value={fmtPct(bond.coupon)} />
                            <Meta
                                label="Nominal"
                                value={fmtMoney(bond.face_value, bond.currency)}
                            />
                            <Meta
                                label="Frekuensi"
                                value={freqLabel(bond.payment_frequency)}
                            />
                            <Meta
                                label="Issue date"
                                value={
                                    bond.issue_date
                                        ? new Date(
                                              bond.issue_date,
                                          ).toLocaleDateString('id-ID', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : '—'
                                }
                            />
                            <Meta label="Jatuh tempo" value={maturity} />
                        </div>
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-b border-dashboard-outline-variant/10 py-2 dark:border-white/5">
            <dt className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </dt>
            <dd className="mt-0.5 text-sm font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value}
            </dd>
        </div>
    );
}
