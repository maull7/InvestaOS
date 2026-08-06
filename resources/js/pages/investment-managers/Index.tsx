import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { Paginated } from '@/types';

type Manager = {
    id: number;
    name: string;
    code: string | null;
    website: string | null;
    email: string | null;
    mutual_funds_count: number;
};

type Props = { managers: Paginated<Manager>; filters: { q: string } };

const inputCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function ManagersIndex({ managers, filters }: Props) {
    const [search, setSearch] = useState(filters.q);

    function submitSearch(e: FormEvent) {
        e.preventDefault();
        router.get(
            '/investment-managers',
            { q: search },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Manajer Investasi" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Manajer Investasi
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Daftar Manajer Investasi di Indonesia.
                        </p>
                    </div>

                    <form
                        onSubmit={submitSearch}
                        className="flex flex-wrap items-end gap-2"
                    >
                        <div className="min-w-[200px] flex-1">
                            <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                Cari
                            </span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nama atau kode…"
                                className={inputCls}
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-landing-primary px-5 text-sm font-bold text-landing-on-primary transition-colors hover:bg-landing-primary-container"
                        >
                            Cari
                        </button>
                    </form>

                    {managers.data.length === 0 ? (
                        <Card className="p-10 text-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Tidak ada manajer investasi.
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {managers.data.map((manager) => (
                                <Link
                                    key={manager.id}
                                    href={`/investment-managers/${manager.id}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-dashboard-outline-variant/15 bg-dashboard-surface-container-lowest p-5 shadow-[0px_6px_18px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-dashboard-primary/30 hover:shadow-[0px_10px_28px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/5"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="truncate font-headline text-base font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {manager.name}
                                            </p>
                                            {manager.code && (
                                                <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    {manager.code}
                                                </p>
                                            )}
                                        </div>
                                        <span className="shrink-0 rounded-full bg-dashboard-secondary-container px-2 py-1 text-[10px] font-bold text-dashboard-inverse-surface">
                                            {manager.mutual_funds_count} reksa
                                            dana
                                        </span>
                                    </div>

                                    <div className="mt-4 flex-1 space-y-1 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        {manager.email && (
                                            <p>{manager.email}</p>
                                        )}
                                        {manager.website && (
                                            <p className="truncate">
                                                {manager.website}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between border-t border-dashboard-outline-variant/10 pt-2 text-[11px] text-dashboard-on-surface-variant dark:border-white/10 dark:text-dashboard-surface-variant">
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
                            {managers.total} data · Halaman{' '}
                            {managers.current_page} dari {managers.last_page}
                        </span>
                        <div className="flex gap-2">
                            {managers.prev_page_url && (
                                <Link
                                    href={managers.prev_page_url}
                                    preserveScroll
                                    className="rounded-full border border-dashboard-outline-variant px-4 py-1.5 text-sm font-semibold text-dashboard-on-surface hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                                >
                                    ← Prev
                                </Link>
                            )}
                            {managers.next_page_url && (
                                <Link
                                    href={managers.next_page_url}
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
