import { Head } from '@inertiajs/react';

import StockChart from '@/components/chart/StockChart';
import type { StockQuote } from '@/components/chart/StockChart';
import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';

type Stock = {
    id: number;
    code: string;
    name: string;
    sector: string | null;
    industry: string | null;
    listing_board: string | null;
    ipo_date: string | null;
    website: string | null;
    status: string;
};

type Props = { stock: Stock; quote: StockQuote | null };

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

export default function StockDetail({ stock, quote }: Props) {
    return (
        <>
            <Head title={`${stock.code} — ${stock.name}`} />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div className="flex flex-wrap items-center justify-between gap-3">
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
                        <div className="flex items-center gap-2">
                            <a
                                href={`/stocks/compare?codes=${stock.code}`}
                                className="rounded-full border border-dashboard-outline-variant px-4 py-2 text-sm font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                            >
                                Bandingkan
                            </a>
                            <a
                                href={`/stocks/${stock.code}/pdf`}
                                className="rounded-full border border-dashboard-outline-variant px-4 py-2 text-sm font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                            >
                                PDF
                            </a>
                            <Button variant="outline" href="/admin/stocks">
                                ← Kembali ke daftar
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <StockChart
                                quote={quote}
                                baseUrl={`/admin/stocks/${stock.code}`}
                                fallbackName={stock.name}
                            />
                        </div>

                        <Card className="h-fit p-6">
                            <h4 className="mb-3 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Details
                            </h4>
                            <MetadataRow label="Code" value={stock.code} />
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
                            <MetadataRow label="Status" value={stock.status} />
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
        </>
    );
}
