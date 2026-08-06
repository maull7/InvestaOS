import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BOND_TYPES, bondTypeLabel, fmtPct, fmtYears } from '@/lib/bonds';
import type { BondCalc } from '@/lib/bonds';
import type { Paginated } from '@/types';

type Bond = {
    code: string;
    name: string;
    type: string;
    issuer: string | null;
    coupon: number | null;
    maturity_date: string | null;
    calc?: BondCalc;
};

type Props = { bonds: Paginated<Bond>; filters: { q: string; type: string } };

const selectCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

function fmtCoupon(v: number | null): string {
    return v === null ? '—' : `${v.toFixed(2)}%`;
}

export default function BondsIndex({ bonds, filters }: Props) {
    const [search, setSearch] = useState(filters.q);

    function navigate(over: { q?: string; type?: string }) {
        router.get(
            '/bonds',
            { q: filters.q, type: filters.type, ...over },
            { preserveState: true, replace: true },
        );
    }

    function submitSearch(e: FormEvent) {
        e.preventDefault();
        navigate({ q: search });
    }

    return (
        <>
            <Head title="Obligasi" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Obligasi
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Katalog obligasi: pemerintah, korporasi, dan sukuk.
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
                                placeholder="Kode, nama, atau issuer…"
                                className={selectCls}
                            />
                        </div>
                        <div className="w-56">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Tipe
                            </span>
                            <select
                                value={filters.type}
                                onChange={(e) =>
                                    navigate({ type: e.target.value })
                                }
                                className={selectCls}
                            >
                                <option value="">Semua tipe</option>
                                {BOND_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {bondTypeLabel(t)}
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
                        {(filters.q || filters.type) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    navigate({ q: '', type: '' });
                                }}
                                className="inline-flex h-11 items-center justify-center rounded-full border border-dashboard-outline-variant px-4 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                            >
                                Reset
                            </button>
                        )}
                    </form>

                    {bonds.data.length === 0 ? (
                        <Card className="p-10 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Tidak ada obligasi yang cocok.
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {bonds.data.map((bond) => (
                                <Link
                                    key={bond.code}
                                    href={`/bonds/${bond.code}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashboard-outline-variant/15 bg-dashboard-surface-container-lowest p-5 shadow-[0px_6px_18px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-primary/30 hover:shadow-[0px_10px_28px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate font-headline text-base font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {bond.code}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {bond.issuer ?? bond.name}
                                            </p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-dashboard-surface-variant px-2 py-1 text-[10px] font-semibold text-dashboard-on-surface-variant capitalize dark:bg-white/10 dark:text-dashboard-surface-variant">
                                            {bondTypeLabel(bond.type)}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-end justify-between border-t border-dashboard-outline-variant/10 pt-3 dark:border-white/10">
                                        <div>
                                            <p className="text-[10px] font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                                Coupon
                                            </p>
                                            <p className="font-headline text-xl font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {fmtCoupon(bond.coupon)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-medium tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                                                Jatuh tempo
                                            </p>
                                            <p className="text-sm font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {bond.maturity_date
                                                    ? new Date(
                                                          bond.maturity_date,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              year: 'numeric',
                                                              month: 'short',
                                                          },
                                                      )
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {bond.calc && (
                                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                                            <span className="flex items-center justify-between gap-1 rounded-lg bg-dashboard-surface-container-low px-2 py-1.5 text-dashboard-on-surface-variant dark:bg-white/5 dark:text-dashboard-surface-variant">
                                                Sisa tenor
                                                <b className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    {fmtYears(
                                                        bond.calc
                                                            .yearsRemaining,
                                                    )}
                                                </b>
                                            </span>
                                            <span className="flex items-center justify-between gap-1 rounded-lg bg-dashboard-surface-container-low px-2 py-1.5 text-dashboard-on-surface-variant dark:bg-white/5 dark:text-dashboard-surface-variant">
                                                YTM
                                                <b className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    {fmtPct(bond.calc.ytm)}
                                                    {bond.calc.estimated && '*'}
                                                </b>
                                            </span>
                                        </div>
                                    )}

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
                            {bonds.total} data · Halaman {bonds.current_page}{' '}
                            dari {bonds.last_page}
                        </span>
                        <div className="flex gap-2">
                            {bonds.prev_page_url && (
                                <Link
                                    href={bonds.prev_page_url}
                                    preserveScroll
                                    className="rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                                >
                                    ← Prev
                                </Link>
                            )}
                            {bonds.next_page_url && (
                                <Link
                                    href={bonds.next_page_url}
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
