import { Head } from '@inertiajs/react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

type QuoteRow = {
    label: string;
    symbol: string;
    currency: string | null;
    price: number;
    change: number;
    changePercent: number;
};

type Props = {
    rates: QuoteRow[];
    indices: QuoteRow[];
};

function fmtPrice(p: number): string {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(p);
}

function SectionCard({ title, rows }: { title: string; rows: QuoteRow[] }) {
    return (
        <Card className="p-6">
            <h4 className="text-headline-sm mb-4 font-headline font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {title}
            </h4>
            {rows.length === 0 ? (
                <p className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    Data tak tersedia saat ini. Coba lagi beberapa menit.
                </p>
            ) : (
                <div className="divide-y divide-dashboard-outline-variant/10 dark:divide-white/5">
                    {rows.map((q) => {
                        const up = q.change >= 0;

                        return (
                            <div
                                key={q.symbol}
                                className="flex items-center justify-between gap-4 py-3"
                            >
                                <div>
                                    <p className="font-headline text-sm font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        {q.label}
                                    </p>
                                    <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        {q.symbol}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-body text-body-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        {fmtPrice(q.price)}
                                    </p>
                                    <p
                                        className={cn(
                                            'text-xs font-bold',
                                            up
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-dashboard-error',
                                        )}
                                    >
                                        {up ? '+' : ''}
                                        {q.change.toFixed(2)} ({up ? '+' : ''}
                                        {q.changePercent.toFixed(2)}%)
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}

export default function MarketDataIndex({ rates, indices }: Props) {
    return (
        <>
            <Head title="Market Data" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Market Data
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Kurs mata uang dan indeks pasar terpilih (live dari
                            pasar).
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <SectionCard
                            title="Kurs Mata Uang (IDR)"
                            rows={rates}
                        />
                        <SectionCard title="Indeks Pasar" rows={indices} />
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
