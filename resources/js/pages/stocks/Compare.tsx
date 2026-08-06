import { Head, Link, router } from '@inertiajs/react';
import { ColorType, LineSeries, createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

import type { StockQuote } from '@/components/chart/StockChart';
import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StockSearch from '@/components/ui/StockSearch';
import { cn } from '@/lib/utils';

const RANGES = ['1mo', '3mo', '6mo', '1y', '2y', '5y'] as const;
const PALETTE = ['#3b82f6', '#f97316', '#a855f7', '#06b6d4', '#22c55e'];

function fmt(
    v: number | null | undefined,
    currency: string | null | undefined,
): string {
    if (v === null || v === undefined) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency ?? 'IDR',
        maximumFractionDigits: 0,
    }).format(v);
}

function fmtCompact(v: number | null | undefined): string {
    if (v === null || v === undefined) {
        return '—';
    }

    const b = 1_000_000_000;
    const m = 1_000_000;

    if (v >= b) {
        return `${(v / b).toFixed(2)}B`;
    }

    if (v >= m) {
        return `${(v / m).toFixed(1)}M`;
    }

    return v.toLocaleString('id-ID');
}

type Row = {
    stock: { code: string; name: string; listing_board: string | null };
    quote: StockQuote | null;
};
type Props = { rows: Row[]; range: string };

function CompareChart({ rows }: { rows: Row[] }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const chart = createChart(ref.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: 'rgba(128,128,128,0.08)' },
                horzLines: { color: 'rgba(128,128,128,0.08)' },
            },
            rightPriceScale: { borderVisible: false },
            timeScale: { borderVisible: false, timeVisible: true },
            crosshair: { mode: 0 },
            autoSize: true,
            height: 380,
        });

        rows.forEach((row, i) => {
            if (!row.quote) {
                return;
            }

            const s = chart.addSeries(LineSeries, {
                color: PALETTE[i % PALETTE.length],
                lineWidth: 2,
                priceLineVisible: false,
            });
            s.setData(
                row.quote.history.map((b) => ({
                    time: b.t as never,
                    value: b.c,
                })),
            );
        });
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [rows]);

    return <div ref={ref} className="w-full" />;
}

export default function Compare({ rows, range }: Props) {
    const selected = rows.map((r) => r.stock.code);

    function go(codes: string[]) {
        router.get(`/stocks/compare?codes=${codes.join(',')}`);
    }

    function add(code: string) {
        if (!selected.includes(code)) {
            go([...selected, code].slice(0, 3));
        }
    }

    function remove(code: string) {
        go(selected.filter((c) => c !== code));
    }

    return (
        <>
            <Head title="Bandingkan Saham" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Perbandingan Saham
                            </h3>
                            <p className="mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Cari dan tambah hingga 3 ticker untuk
                                membandingkan performa.
                            </p>
                        </div>
                        <Link
                            href="/stocks"
                            className="rounded-full border border-dashboard-outline-variant px-4 py-2 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                        >
                            ← Stocks
                        </Link>
                    </div>

                    <div className="max-w-xl">
                        <StockSearch
                            onSelect={add}
                            exclude={selected}
                            disabled={selected.length >= 3}
                        />
                    </div>

                    <Card className="p-6">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {rows.map((r, i) => (
                                    <button
                                        key={r.stock.code}
                                        type="button"
                                        onClick={() => remove(r.stock.code)}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-dashboard-surface-container-low px-3 py-1 text-xs font-semibold transition-colors hover:bg-dashboard-error/10 dark:bg-white/5"
                                        title="Hapus dari perbandingan"
                                    >
                                        <span
                                            className="h-2 w-2 rounded-full"
                                            style={{
                                                background:
                                                    PALETTE[i % PALETTE.length],
                                            }}
                                        />
                                        {r.stock.code}
                                        <span className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                            ×
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {RANGES.map((r) => (
                                    <Link
                                        key={r}
                                        href={`/stocks/compare?codes=${selected.join(',')}&range=${r}`}
                                        className={cn(
                                            'rounded-full px-3 py-1 text-xs font-semibold',
                                            range === r
                                                ? 'bg-landing-primary text-landing-on-primary'
                                                : 'bg-dashboard-surface-container-low text-dashboard-on-surface-variant dark:bg-white/5 dark:text-dashboard-surface-variant',
                                        )}
                                    >
                                        {r.toUpperCase()}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {rows.some((r) => r.quote) ? (
                            <CompareChart rows={rows} />
                        ) : (
                            <div className="flex h-56 items-center justify-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Cari saham untuk memulai perbandingan.
                            </div>
                        )}
                    </Card>

                    {rows.some((r) => r.quote) && (
                        <Card className="overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-dashboard-outline-variant/20 text-left text-xs text-dashboard-on-surface-variant uppercase dark:border-white/10 dark:text-dashboard-surface-variant">
                                        <th className="px-6 py-3 font-medium">
                                            Metrik
                                        </th>
                                        {rows.map((r) => (
                                            <th
                                                key={r.stock.code}
                                                className="px-6 py-3 text-right font-medium"
                                            >
                                                {r.stock.code}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {metricRows().map((m) => (
                                        <tr
                                            key={m.label}
                                            className="border-b border-dashboard-outline-variant/10 last:border-0 dark:border-white/5"
                                        >
                                            <td className="px-6 py-3 text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {m.label}
                                            </td>
                                            {rows.map((r) => (
                                                <td
                                                    key={r.stock.code}
                                                    className="px-6 py-3 text-right font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface"
                                                >
                                                    {m.value(r)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
}

function metricRows() {
    return [
        {
            label: 'Harga',
            value: (r: Row) => fmt(r.quote?.price, r.quote?.currency),
        },
        {
            label: 'Perubahan',
            value: (r: Row) =>
                r.quote
                    ? `${r.quote.change > 0 ? '+' : ''}${r.quote.change.toFixed(2)} (${r.quote.change > 0 ? '+' : ''}${r.quote.changePercent.toFixed(2)}%)`
                    : '—',
        },
        { label: 'Volume', value: (r: Row) => fmtCompact(r.quote?.volume) },
        {
            label: '52-week low',
            value: (r: Row) => fmt(r.quote?.week52Low, r.quote?.currency),
        },
        {
            label: '52-week high',
            value: (r: Row) => fmt(r.quote?.week52High, r.quote?.currency),
        },
        {
            label: 'Kapitalisasi',
            value: (r: Row) => fmtCompact(r.quote?.marketCap),
        },
    ];
}
