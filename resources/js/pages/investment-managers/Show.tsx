import { Head, Link } from '@inertiajs/react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fundTypeLabel, riskLabel } from '@/lib/investment';

type Manager = {
    id: number;
    name: string;
    code: string | null;
    website: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
};

type Fund = {
    id: number;
    code: string | null;
    name: string;
    fund_type: string;
    currency: string;
    risk_level: number | null;
};

type Props = { manager: Manager; funds: Fund[] };

export default function ManagerShow({ manager, funds }: Props) {
    return (
        <>
            <Head title={manager.name} />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <a
                        href="/investment-managers"
                        className="text-sm font-semibold text-dashboard-primary hover:underline"
                    >
                        ← Semua manajer investasi
                    </a>

                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-headline-xl font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {manager.name}
                        </h3>
                        {manager.code && (
                            <span className="rounded-full bg-dashboard-surface-variant px-3 py-1 text-xs font-semibold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                {manager.code}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Card className="h-fit p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Kontak
                            </h4>
                            <Meta
                                label="Website"
                                value={manager.website}
                                link
                            />
                            <Meta label="Email" value={manager.email} />
                            <Meta label="Telepon" value={manager.phone} />
                            <Meta label="Alamat" value={manager.address} />
                        </Card>

                        <Card className="overflow-hidden lg:col-span-2">
                            <div className="border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                                <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    Produk Reksa Dana ({funds.length})
                                </h4>
                            </div>
                            {funds.length === 0 ? (
                                <p className="px-6 py-8 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    Belum ada produk reksa dana.
                                </p>
                            ) : (
                                <div className="divide-y divide-dashboard-outline-variant/10 dark:divide-white/5">
                                    {funds.map((fund) => (
                                        <Link
                                            key={fund.id}
                                            href={`/reksa-dana/${fund.code ?? fund.id}`}
                                            className="flex items-center justify-between gap-3 px-6 py-3.5 transition-colors hover:bg-dashboard-surface-container-low dark:hover:bg-white/5"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    {fund.name}
                                                </p>
                                                <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    {fund.code ?? '—'} ·{' '}
                                                    {fund.currency}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-[10px] font-semibold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                                    {fundTypeLabel(
                                                        fund.fund_type,
                                                    )}
                                                </span>
                                                <span className="text-[11px] font-semibold text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    {riskLabel(fund.risk_level)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}

function Meta({
    label,
    value,
    link,
}: {
    label: string;
    value: string | null;
    link?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-dashboard-outline-variant/10 py-2 last:border-0 dark:border-white/5">
            <dt className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </dt>
            <dd className="text-right text-sm font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value ? (
                    link ? (
                        <a
                            href={
                                value.startsWith('http')
                                    ? value
                                    : `https://${value}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-dashboard-primary hover:underline"
                        >
                            {value}
                        </a>
                    ) : (
                        value
                    )
                ) : (
                    '—'
                )}
            </dd>
        </div>
    );
}
