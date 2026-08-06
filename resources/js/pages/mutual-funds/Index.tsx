import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
    FUND_TYPES,
    fundTypeLabel,
    riskLabel,
    riskTone,
} from '@/lib/investment';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

type Fund = {
    id: number;
    code: string | null;
    name: string;
    fund_type: string;
    currency: string;
    risk_level: number | null;
    investment_manager?: {
        id: number;
        name: string;
        code: string | null;
    } | null;
};

type Props = {
    funds: Paginated<Fund>;
    filters: { q: string; type: string; manager: string };
    managers: { id: number; name: string }[];
};

const inputCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function FundsIndex({ funds, filters, managers }: Props) {
    const [search, setSearch] = useState(filters.q);

    function navigate(over: { q?: string; type?: string; manager?: string }) {
        router.get(
            '/reksa-dana',
            {
                q: filters.q,
                type: filters.type,
                manager: filters.manager,
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
            <Head title="Reksa Dana" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Reksa Dana
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Katalog produk Reksa Dana.
                        </p>
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
                                placeholder="Kode atau nama…"
                                className={inputCls}
                            />
                        </div>
                        <div className="w-52">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Jenis
                            </span>
                            <select
                                value={filters.type}
                                onChange={(e) =>
                                    navigate({ type: e.target.value })
                                }
                                className={inputCls}
                            >
                                <option value="">Semua jenis</option>
                                {FUND_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {fundTypeLabel(t)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-52">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Manajer
                            </span>
                            <select
                                value={filters.manager}
                                onChange={(e) =>
                                    navigate({ manager: e.target.value })
                                }
                                className={inputCls}
                            >
                                <option value="">Semua MI</option>
                                {managers.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
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
                        {(filters.q || filters.type || filters.manager) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    navigate({ q: '', type: '', manager: '' });
                                }}
                                className="inline-flex h-11 items-center justify-center rounded-full border border-dashboard-outline-variant px-4 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                            >
                                Reset
                            </button>
                        )}
                    </form>

                    {funds.data.length === 0 ? (
                        <Card className="p-10 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Tidak ada reksa dana yang cocok.
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {funds.data.map((fund) => (
                                <Link
                                    key={fund.id}
                                    href={`/reksa-dana/${fund.code ?? fund.id}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashboard-outline-variant/15 bg-dashboard-surface-container-lowest p-5 shadow-[0px_6px_18px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-primary/30 hover:shadow-[0px_10px_28px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate font-headline text-base font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {fund.name}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {fund.code ?? '—'} ·{' '}
                                                {fund.currency}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-dashboard-surface-variant px-2 py-1 text-[10px] font-semibold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                            {fundTypeLabel(fund.fund_type)}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between border-t border-dashboard-outline-variant/10 pt-3 dark:border-white/10">
                                        <span className="truncate text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                            {fund.investment_manager?.name ??
                                                '—'}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-0.5 text-[10px] font-bold',
                                                riskTone(fund.risk_level),
                                            )}
                                        >
                                            {riskLabel(fund.risk_level)}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between text-[11px] text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        <span>Lihat detail</span>
                                        <span className="font-bold text-dashboard-primary transition-transform group-hover:translate-x-0.5">
                                            →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            {funds.total} data · Halaman {funds.current_page}{' '}
                            dari {funds.last_page}
                        </span>
                        <div className="flex gap-2">
                            {funds.prev_page_url && (
                                <Link
                                    href={funds.prev_page_url}
                                    preserveScroll
                                    className="rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                                >
                                    ← Prev
                                </Link>
                            )}
                            {funds.next_page_url && (
                                <Link
                                    href={funds.next_page_url}
                                    preserveScroll
                                    className="rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
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
