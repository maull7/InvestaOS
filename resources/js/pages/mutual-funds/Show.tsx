import { Head, Link } from '@inertiajs/react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fundTypeLabel, riskLabel, riskTone } from '@/lib/investment';
import { cn } from '@/lib/utils';

type Fund = {
    code: string | null;
    name: string;
    fund_type: string;
    currency: string;
    risk_level: number | null;
    custodian_bank: string | null;
    launch_date: string | null;
    status: string;
    investment_manager?: {
        id: number;
        name: string;
        code: string | null;
    } | null;
};

type Props = { fund: Fund };

export default function FundShow({ fund }: Props) {
    const launch = fund.launch_date
        ? new Date(fund.launch_date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '—';

    return (
        <>
            <Head title={fund.name} />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <a
                        href="/reksa-dana"
                        className="text-sm font-semibold text-dashboard-primary hover:underline"
                    >
                        ← Semua reksa dana
                    </a>

                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-headline-xl font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {fund.name}
                        </h3>
                        <span className="rounded-full bg-dashboard-surface-variant px-3 py-1 text-xs font-semibold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                            {fundTypeLabel(fund.fund_type)}
                        </span>
                        <span
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-bold',
                                riskTone(fund.risk_level),
                            )}
                        >
                            Risiko: {riskLabel(fund.risk_level)}
                        </span>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Card
                            className="flex flex-col items-start justify-center p-6"
                            variant="light-primary"
                        >
                            <p className="text-xs font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                Manajer Investasi
                            </p>
                            {fund.investment_manager ? (
                                <Link
                                    href={`/investment-managers/${fund.investment_manager.id}`}
                                    className="mt-2 font-headline text-2xl font-bold text-dashboard-primary hover:underline"
                                >
                                    {fund.investment_manager.name}
                                </Link>
                            ) : (
                                <p className="mt-2 font-headline text-2xl font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    —
                                </p>
                            )}
                            <p className="mt-1 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {fund.code ?? 'Tanpa kode'} · {fund.currency}
                            </p>
                        </Card>

                        <Card className="h-fit p-6 lg:col-span-2">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Details
                            </h4>
                            <Meta label="Kode" value={fund.code ?? '—'} />
                            <Meta label="Nama" value={fund.name} />
                            <Meta
                                label="Jenis"
                                value={fundTypeLabel(fund.fund_type)}
                            />
                            <Meta label="Currency" value={fund.currency} />
                            <Meta
                                label="Tingkat risiko"
                                value={riskLabel(fund.risk_level)}
                            />
                            <Meta
                                label="Bank Kustodian"
                                value={fund.custodian_bank ?? '—'}
                            />
                            <Meta label="Launch date" value={launch} />
                            <Meta label="Status" value={fund.status} />
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-dashboard-outline-variant/10 py-2 last:border-0 dark:border-white/5">
            <dt className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </dt>
            <dd className="text-right text-sm font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value}
            </dd>
        </div>
    );
}
