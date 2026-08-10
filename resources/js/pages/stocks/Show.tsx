import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import StockChart from '@/components/chart/StockChart';
import type { StockQuote } from '@/components/chart/StockChart';
import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AiResearchButton from '@/components/ui/AiResearchButton';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import StockSearch from '@/components/ui/StockSearch';
import { cn } from '@/lib/utils';

type Stock = {
    id: number;
    code: string;
    name: string;
    sector: string | null;
    industry: string | null;
    listing_board: string | null;
    ipo_date: string | null;
    website: string | null;
};

type NewsItem = {
    title: string;
    publisher: string | null;
    link: string;
    publishedAt: number | null;
};

type CorporateActions = {
    dividends: { date: number; amount: number }[];
    splits: { date: number; numerator: number; denominator: number }[];
};

type Props = {
    stock: Stock;
    quote: StockQuote | null;
    fundamentals: Record<string, number>;
    news: NewsItem[];
    actions: CorporateActions;
    range: string;
    isWatched: boolean;
};

function MetadataRow({
    label,
    value,
}: {
    label: string;
    value: string | null;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-dashboard-outline-variant/10 py-2 last:border-0 dark:border-white/5">
            <dt className="font-body text-body-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </dt>
            <dd className="font-body text-body-sm text-right font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value ?? '—'}
            </dd>
        </div>
    );
}

function fmtFat(v: number | undefined | null): string | null {
    if (v == null) {
        return null;
    }

    return v.toFixed(2);
}

function fmtPct(v: number | null): string | null {
    if (v == null) {
        return null;
    }

    return `${(v * 100).toFixed(2)}%`;
}

function fmtMoney(v: number | null, currency: string): string | null {
    if (v == null) {
        return null;
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(v);
}

export default function StockShow({
    stock,
    quote,
    fundamentals,
    news,
    actions,
    isWatched,
}: Props) {
    const [compareOpen, setCompareOpen] = useState(false);
    const [compareCodes, setCompareCodes] = useState<string[]>([]);
    const currency = quote?.currency ?? 'IDR';

    function addCompare(code: string) {
        if (!compareCodes.includes(code)) {
            setCompareCodes((p) => [...p, code].slice(0, 2));
        }
    }

    function goCompare() {
        router.get(
            `/stocks/compare?codes=${[stock.code, ...compareCodes].join(',')}`,
        );
    }

    return (
        <>
            <Head title={`${stock.code} — ${stock.name}`} />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <a
                            href="/stocks"
                            className="text-sm font-semibold text-dashboard-primary hover:underline"
                        >
                            ← All stocks
                        </a>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCompareOpen(true)}
                                className="text-sm font-semibold text-dashboard-on-surface-variant hover:text-dashboard-on-surface dark:text-dashboard-surface-variant dark:hover:text-dashboard-inverse-on-surface"
                            >
                                Bandingkan
                            </button>
                            <a
                                href={`/stocks/${stock.code}/pdf`}
                                className="rounded-full bg-dashboard-surface-container-low px-3 py-1.5 text-sm font-semibold text-dashboard-on-surface-variant hover:bg-dashboard-surface-container-high hover:text-dashboard-on-surface dark:bg-white/5 dark:text-dashboard-surface-variant dark:hover:text-dashboard-inverse-on-surface"
                            >
                                PDF
                            </a>
                            <AiResearchButton
                                assetType="stock"
                                assetId={stock.id}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    router.post(`/stocks/${stock.code}/watch`)
                                }
                                className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
                                    isWatched
                                        ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400'
                                        : 'bg-dashboard-surface-container-low text-dashboard-on-surface-variant hover:bg-dashboard-surface-container-high dark:bg-white/5 dark:text-dashboard-surface-variant',
                                )}
                            >
                                <Icon
                                    name="star"
                                    size="text-sm"
                                    className={cn(
                                        isWatched &&
                                            'fill-amber-400 text-amber-400',
                                    )}
                                />
                                {isWatched ? 'Dipantau' : 'Pantau'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-headline-xl font-headline font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {stock.code}
                        </h3>
                        <p className="font-body text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {quote?.longName ?? stock.name}
                        </p>
                        {stock.listing_board && (
                            <span className="rounded-full bg-dashboard-surface-variant px-3 py-1 text-xs font-semibold text-dashboard-on-surface-variant capitalize dark:bg-white/10 dark:text-dashboard-surface-variant">
                                {stock.listing_board}
                            </span>
                        )}
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <StockChart
                                quote={quote}
                                baseUrl={`/stocks/${stock.code}`}
                                fallbackName={stock.name}
                            />
                        </div>

                        <Card className="h-fit p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Details
                            </h4>
                            <MetadataRow label="Sector" value={stock.sector} />
                            <MetadataRow
                                label="Industry"
                                value={stock.industry}
                            />
                            <MetadataRow
                                label="Listing board"
                                value={stock.listing_board}
                            />
                            <MetadataRow
                                label="IPO date"
                                value={
                                    stock.ipo_date
                                        ? new Date(
                                              stock.ipo_date,
                                          ).toLocaleDateString('id-ID', {
                                              year: 'numeric',
                                              month: 'short',
                                              day: 'numeric',
                                          })
                                        : null
                                }
                            />
                            <MetadataRow
                                label="Website"
                                value={stock.website}
                            />
                            <div className="mt-4">
                                <a
                                    href={`https://finance.yahoo.com/quote/${encodeURIComponent(quote?.symbol ?? stock.code)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-semibold text-dashboard-primary hover:underline"
                                >
                                    Buka di Yahoo Finance ↗
                                </a>
                            </div>
                        </Card>
                    </div>

                    {Object.keys(fundamentals).length > 0 && (
                        <Card className="p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Fundamental
                            </h4>
                            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                                <MetadataRow
                                    label="P/E (trailing)"
                                    value={fmtFat(fundamentals.trailingPE)}
                                />
                                <MetadataRow
                                    label="P/E (forward)"
                                    value={fmtFat(fundamentals.forwardPE)}
                                />
                                <MetadataRow
                                    label="EPS"
                                    value={fmtMoney(fundamentals.eps, currency)}
                                />
                                <MetadataRow
                                    label="Dividend yield"
                                    value={
                                        fundamentals.dividendYieldPercent !=
                                        null
                                            ? `${fundamentals.dividendYieldPercent.toFixed(2)}%`
                                            : null
                                    }
                                />
                                <MetadataRow
                                    label="Dividend"
                                    value={fmtMoney(
                                        fundamentals.dividendRate,
                                        currency,
                                    )}
                                />
                                <MetadataRow
                                    label="Payout ratio"
                                    value={fmtPct(fundamentals.payoutRatio)}
                                />
                                <MetadataRow
                                    label="Book value"
                                    value={fmtMoney(
                                        fundamentals.bookValue,
                                        currency,
                                    )}
                                />
                                <MetadataRow
                                    label="Price/book"
                                    value={fmtFat(fundamentals.priceToBook)}
                                />
                                <MetadataRow
                                    label="Beta"
                                    value={fmtFat(fundamentals.beta)}
                                />
                                <MetadataRow
                                    label="ROE"
                                    value={fmtPct(fundamentals.returnOnEquity)}
                                />
                                <MetadataRow
                                    label="Profit margin"
                                    value={fmtPct(fundamentals.profitMargins)}
                                />
                                <MetadataRow
                                    label="Revenue"
                                    value={fmtMoney(
                                        fundamentals.revenue,
                                        currency,
                                    )}
                                />
                            </div>
                        </Card>
                    )}

                    {news.length > 0 && (
                        <Card className="p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Berita
                            </h4>
                            <ul className="space-y-3">
                                {news.map((n) => (
                                    <li key={n.link}>
                                        <a
                                            href={n.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-body text-body-md font-semibold text-dashboard-on-surface hover:text-dashboard-primary dark:text-dashboard-inverse-on-surface"
                                        >
                                            {n.title}
                                        </a>
                                        <p className="font-body text-body-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                            {n.publisher ?? '—'}
                                            {n.publishedAt
                                                ? ` · ${new Date(
                                                      n.publishedAt * 1000,
                                                  ).toLocaleDateString(
                                                      'id-ID',
                                                      {
                                                          year: 'numeric',
                                                          month: 'short',
                                                          day: 'numeric',
                                                      },
                                                  )}`
                                                : ''}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    )}

                    {actions.dividends.length > 0 && (
                        <Card className="p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Riwayat Dividen
                            </h4>
                            <ul className="max-h-72 divide-y divide-dashboard-outline-variant/10 overflow-y-auto pr-1 dark:divide-white/5">
                                {actions.dividends
                                    .slice()
                                    .reverse()
                                    .map((d) => (
                                        <li
                                            key={d.date}
                                            className="flex items-center justify-between gap-4 py-2"
                                        >
                                            <span className="font-body text-body-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {new Date(
                                                    d.date * 1000,
                                                ).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className="font-body text-body-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {fmtMoney(d.amount, currency)}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </Card>
                    )}

                    {actions.splits.length > 0 && (
                        <Card className="p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Riwayat Stock Split
                            </h4>
                            <ul className="divide-y divide-dashboard-outline-variant/10 dark:divide-white/5">
                                {actions.splits
                                    .slice()
                                    .reverse()
                                    .map((s) => (
                                        <li
                                            key={s.date}
                                            className="flex items-center justify-between gap-4 py-2"
                                        >
                                            <span className="font-body text-body-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {new Date(
                                                    s.date * 1000,
                                                ).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className="font-body text-body-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {s.numerator}:{s.denominator}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </Card>
                    )}
                </div>
            </DashboardLayout>

            <Modal
                open={compareOpen}
                onClose={() => {
                    setCompareOpen(false);
                    setCompareCodes([]);
                }}
                title={`Bandingkan ${stock.code} dengan…`}
                size="md"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setCompareOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="solid"
                            onClick={goCompare}
                            disabled={compareCodes.length === 0}
                        >
                            Bandingkan ({compareCodes.length + 1} saham)
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2 rounded-xl bg-dashboard-surface-container-low px-4 py-3 dark:bg-white/5">
                        <span className="font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            {stock.code}
                        </span>
                        <span className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {stock.name}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {compareCodes.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() =>
                                    setCompareCodes((p) =>
                                        p.filter((x) => x !== c),
                                    )
                                }
                                className="inline-flex items-center gap-1.5 rounded-full bg-landing-primary px-3 py-1.5 text-xs font-semibold text-landing-on-primary"
                            >
                                {c} ×
                            </button>
                        ))}
                    </div>
                    <StockSearch
                        onSelect={addCompare}
                        exclude={[stock.code, ...compareCodes]}
                        placeholder="Cari saham pembanding…"
                        disabled={compareCodes.length >= 2}
                    />
                    <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        Pilih hingga 2 saham pembanding (total 3).
                    </p>
                </div>
            </Modal>
        </>
    );
}
