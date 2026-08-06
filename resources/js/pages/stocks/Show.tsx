import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import StockChart from '@/components/chart/StockChart';
import type { StockQuote } from '@/components/chart/StockChart';
import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import StockSearch from '@/components/ui/StockSearch';
import { cn } from '@/lib/utils';

type Stock = {
    code: string;
    name: string;
    sector: string | null;
    industry: string | null;
    listing_board: string | null;
    ipo_date: string | null;
    website: string | null;
};

type Props = {
    stock: Stock;
    quote: StockQuote | null;
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

export default function StockShow({ stock, quote, isWatched }: Props) {
    const [compareOpen, setCompareOpen] = useState(false);
    const [compareCodes, setCompareCodes] = useState<string[]>([]);

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
