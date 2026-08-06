import { Link } from '@inertiajs/react';

import StockCharts from '@/components/chart/StockCharts';
import Card from '@/components/dashboard/Card';
import type { Bar } from '@/lib/indicators';
import { cn } from '@/lib/utils';

export type StockQuote = {
    symbol: string;
    range: string;
    longName: string | null;
    exchangeName: string | null;
    currency: string | null;
    price: number;
    previousClose: number;
    change: number;
    changePercent: number;
    dayHigh: number | null;
    dayLow: number | null;
    volume: number | null;
    week52Low: number | null;
    week52High: number | null;
    marketCap: number | null;
    asOf: number | null;
    history: Bar[];
};

const RANGES = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y'] as const;

function fmtMoney(value: number | null, currency: string | null): string {
    if (value === null) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency ?? 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

function fmtNumber(value: number | null): string {
    if (value === null) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID').format(value);
}

type Props = {
    quote: StockQuote | null;
    baseUrl: string;
    fallbackName?: string;
};

export default function StockChart({ quote, baseUrl, fallbackName }: Props) {
    const up = quote !== null && quote.change >= 0;

    return (
        <Card className="p-6" variant="light-primary">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                    {RANGES.map((r) => (
                        <Link
                            key={r}
                            href={`${baseUrl}?range=${r}`}
                            preserveScroll
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                                quote?.range === r
                                    ? 'bg-landing-primary text-landing-on-primary'
                                    : 'bg-dashboard-surface-container-low text-dashboard-on-surface-variant hover:bg-dashboard-surface-container-high dark:bg-white/5 dark:text-dashboard-surface-variant',
                            )}
                        >
                            {r.toUpperCase()}
                        </Link>
                    ))}
                </div>
                {quote?.asOf && (
                    <span className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        {new Date(quote.asOf * 1000).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                        })}
                    </span>
                )}
            </div>

            {!quote ? (
                <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-dashboard-outline-variant/40 px-4 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    <span>
                        {fallbackName ?? 'Data saham'} tak tersedia saat ini.
                    </span>
                    <span>Coba lagi beberapa menit.</span>
                </div>
            ) : (
                <>
                    <div className="mb-4 flex flex-wrap items-end gap-3">
                        <span className="text-headline-xl font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {fmtMoney(quote.price, quote.currency)}
                        </span>
                        <span
                            className={cn(
                                'mb-1.5 rounded-full px-2 py-0.5 text-sm font-bold',
                                up
                                    ? 'bg-dashboard-secondary-container text-dashboard-inverse-surface'
                                    : 'bg-dashboard-error/10 text-dashboard-error',
                            )}
                        >
                            {up ? '+' : ''}
                            {quote.change.toFixed(2)} ({up ? '+' : ''}
                            {quote.changePercent.toFixed(2)}%)
                        </span>
                    </div>

                    <StockCharts bars={quote.history} />

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashboard-outline-variant/10 pt-4 text-sm sm:grid-cols-3 lg:grid-cols-6 dark:border-white/10">
                        <Stat
                            label="Day range"
                            value={`${fmtMoney(quote.dayLow, quote.currency)} – ${fmtMoney(quote.dayHigh, quote.currency)}`}
                        />
                        <Stat label="Volume" value={fmtNumber(quote.volume)} />
                        <Stat
                            label="52-week low"
                            value={fmtMoney(quote.week52Low, quote.currency)}
                        />
                        <Stat
                            label="52-week high"
                            value={fmtMoney(quote.week52High, quote.currency)}
                        />
                        <Stat
                            label="Kapitalisasi"
                            value={fmtCompact(quote.marketCap)}
                        />
                        <Stat
                            label="Rentang"
                            value={quote.range.toUpperCase()}
                        />
                    </div>
                </>
            )}
        </Card>
    );
}

function fmtCompact(value: number | null): string {
    if (value === null) {
        return '—';
    }

    const trillion = 1_000_000_000_000;
    const billion = 1_000_000_000;
    const million = 1_000_000;

    if (value >= trillion) {
        return `${(value / trillion).toFixed(2)}T`;
    }

    if (value >= billion) {
        return `${(value / billion).toFixed(2)}B`;
    }

    if (value >= million) {
        return `${(value / million).toFixed(1)}M`;
    }

    return value.toLocaleString('id-ID');
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </p>
            <p className="mt-0.5 font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value}
            </p>
        </div>
    );
}
