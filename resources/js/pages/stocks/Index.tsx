import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

type Spark = {
    price: number;
    change: number;
    changePercent: number;
    currency: string | null;
    volume: number | null;
    week52Low: number | null;
    week52High: number | null;
    history: { t: number; c: number }[];
};

type Stock = {
    code: string;
    name: string;
    sector: string | null;
    listing_board: string | null;
    spark: Spark | null;
};

type Props = {
    stocks: Paginated<Stock>;
    filters: { q: string; sector: string; board: string };
    sectors: string[];
    boards: string[];
};

const selectCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

function fmtNumber(value: number | null): string {
    if (value === null) {
        return '—';
    }

    const billion = 1_000_000_000;
    const million = 1_000_000;

    if (value >= billion) {
        return `${(value / billion).toFixed(2)}B`;
    }

    if (value >= million) {
        return `${(value / million).toFixed(1)}M`;
    }

    return value.toLocaleString('id-ID');
}

function fmtMoney(value: number | null, currency: string | null): string {
    if (value === null) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency ?? 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

function MiniSparkline({
    history,
    up,
}: {
    history: { t: number; c: number }[];
    up: boolean;
}) {
    if (history.length < 2) {
        return null;
    }

    const W = 140;
    const H = 40;
    const closes = history.map((p) => p.c);
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
            className="h-10 w-full"
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

export default function StocksIndex({
    stocks,
    filters,
    sectors,
    boards,
}: Props) {
    const [search, setSearch] = useState(filters.q);

    function navigate(over: { q?: string; sector?: string; board?: string }) {
        router.get(
            '/stocks',
            {
                q: filters.q,
                sector: filters.sector,
                board: filters.board,
                ...over,
            },
            { preserveState: true, replace: true },
        );
    }

    function submitSearch(e: FormEvent) {
        e.preventDefault();
        navigate({ q: search });
    }

    return (
        <>
            <Head title="Stocks" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Stocks
                            </h3>
                            <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Master stock list. Click a ticker for live price
                                and chart.
                            </p>
                        </div>
                        <Link
                            href="/stocks/compare"
                            className="rounded-full border border-dashboard-outline-variant bg-dashboard-background px-4 py-2 text-sm font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                        >
                            Bandingkan saham
                        </Link>
                    </div>

                    <form
                        onSubmit={submitSearch}
                        className="flex flex-wrap items-end gap-2"
                    >
                        <div className="min-w-[180px] flex-1">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Cari
                            </span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Kode atau nama saham…"
                                className={selectCls}
                            />
                        </div>
                        <div className="w-44">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Sektor
                            </span>
                            <select
                                value={filters.sector}
                                onChange={(e) =>
                                    navigate({ sector: e.target.value })
                                }
                                className={selectCls}
                            >
                                <option value="">Semua sektor</option>
                                {sectors.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-44">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Board
                            </span>
                            <select
                                value={filters.board}
                                onChange={(e) =>
                                    navigate({ board: e.target.value })
                                }
                                className={selectCls}
                            >
                                <option value="">Semua board</option>
                                {boards.map((b) => (
                                    <option key={b} value={b}>
                                        {b}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-landing-primary px-5 text-sm font-bold text-landing-on-primary transition-colors hover:bg-landing-primary-container"
                        >
                            Cari
                        </button>
                        {(filters.q || filters.sector || filters.board) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    navigate({ q: '', sector: '', board: '' });
                                }}
                                className="inline-flex h-11 items-center justify-center rounded-full border border-dashboard-outline-variant px-4 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                            >
                                Reset
                            </button>
                        )}
                    </form>

                    {stocks.data.length === 0 ? (
                        <Card className="p-10 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Tidak ada saham yang cocok.
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {stocks.data.map((stock) => {
                                const up =
                                    stock.spark !== null &&
                                    stock.spark.change >= 0;
                                const price = stock.spark
                                    ? new Intl.NumberFormat('id-ID', {
                                          style: 'currency',
                                          currency:
                                              stock.spark.currency ?? 'IDR',
                                          maximumFractionDigits: 0,
                                      }).format(stock.spark.price)
                                    : null;

                                return (
                                    <Link
                                        key={stock.code}
                                        href={`/stocks/${stock.code}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashboard-outline-variant/15 bg-dashboard-surface-container-lowest p-5 shadow-[0px_6px_18px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-primary/30 hover:shadow-[0px_10px_28px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dashboard-primary/90 font-mono text-[11px] font-bold text-white">
                                                    {stock.code.slice(0, 3)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-headline text-base font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                        {stock.code}
                                                    </p>
                                                    <p className="truncate text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                        {stock.name}
                                                    </p>
                                                </div>
                                            </div>
                                            {stock.listing_board && (
                                                <span className="shrink-0 rounded-full bg-dashboard-surface-variant px-2 py-1 text-[10px] font-semibold text-dashboard-on-surface-variant capitalize dark:bg-white/10 dark:text-dashboard-surface-variant">
                                                    {stock.listing_board}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-1 flex-col justify-between">
                                            <div className="flex items-end justify-between gap-2">
                                                <div>
                                                    {stock.spark ? (
                                                        <>
                                                            <p className="text-[10px] font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                                                Terakhir
                                                            </p>
                                                            <p className="font-headline text-lg leading-tight font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                                {price}
                                                            </p>
                                                            <span
                                                                className={cn(
                                                                    'mt-0.5 inline-block text-xs font-bold',
                                                                    up
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-dashboard-error',
                                                                )}
                                                            >
                                                                {up ? '▲' : '▼'}{' '}
                                                                {up ? '+' : ''}
                                                                {stock.spark.changePercent.toFixed(
                                                                    2,
                                                                )}
                                                                %
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                            Data tak tersedia
                                                        </p>
                                                    )}
                                                </div>
                                                {stock.sector && (
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-dashboard-surface-container-low px-2 py-1 text-xs text-dashboard-on-surface-variant dark:bg-white/5 dark:text-dashboard-surface-variant">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-dashboard-secondary" />
                                                        {stock.sector}
                                                    </span>
                                                )}
                                            </div>
                                            {stock.spark && (
                                                <MiniSparkline
                                                    history={
                                                        stock.spark.history
                                                    }
                                                    up={up}
                                                />
                                            )}
                                            {stock.spark && (
                                                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-dashboard-outline-variant/10 pt-2 text-[11px] dark:border-white/10">
                                                    <span className="flex items-center justify-between gap-1 text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                        Vol
                                                        <b className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                            {fmtNumber(
                                                                stock.spark
                                                                    .volume,
                                                            )}
                                                        </b>
                                                    </span>
                                                    <span className="flex items-center justify-between gap-1 text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                        52W
                                                        <b className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                            {fmtMoney(
                                                                stock.spark
                                                                    .week52Low,
                                                                stock.spark
                                                                    .currency,
                                                            )}
                                                            –
                                                            {fmtMoney(
                                                                stock.spark
                                                                    .week52High,
                                                                stock.spark
                                                                    .currency,
                                                            )}
                                                        </b>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-3 flex items-center justify-between border-t border-dashboard-outline-variant/10 pt-2 text-[11px] text-dashboard-on-surface-variant dark:border-white/10 dark:text-dashboard-surface-variant">
                                            <span>Lihat detail</span>
                                            <span className="font-bold text-dashboard-primary transition-transform group-hover:translate-x-0.5">
                                                →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {stocks.total} data · Halaman {stocks.current_page}{' '}
                            dari {stocks.last_page}
                        </span>
                        <div className="flex gap-2">
                            {stocks.prev_page_url && (
                                <Link
                                    href={stocks.prev_page_url}
                                    preserveScroll
                                    className="rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                                >
                                    ← Prev
                                </Link>
                            )}
                            {stocks.next_page_url && (
                                <Link
                                    href={stocks.next_page_url}
                                    preserveScroll
                                    className="rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                                >
                                    Next →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}
