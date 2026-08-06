import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { BOND_STATUS, BOND_TYPES, bondTypeLabel, fmtPct } from '@/lib/bonds';
import type { BondCalc } from '@/lib/bonds';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

type Bond = {
    id: number;
    code: string;
    name: string;
    type: string;
    issuer: string | null;
    coupon: number | null;
    maturity_date: string | null;
    issue_date: string | null;
    face_value: number | null;
    payment_frequency: string;
    last_price: number | null;
    yield: number | null;
    benchmark_yield: number | null;
    benchmark_label: string | null;
    currency: string;
    status: string;
    calc?: BondCalc;
};

type Props = {
    bonds: Paginated<Bond>;
    filters: { q: string; type: string; status: string };
};

const emptyForm = {
    code: '',
    name: '',
    type: 'government_bond',
    issuer: '',
    coupon: '',
    maturity_date: '',
    issue_date: '',
    face_value: '',
    payment_frequency: 'semiannual',
    last_price: '',
    yield: '',
    benchmark_yield: '',
    benchmark_label: '',
    currency: 'IDR',
    status: 'active',
};

const selectCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

function fmtCoupon(v: number | null): string {
    return v === null ? '—' : `${v.toFixed(2)}%`;
}

function fmtMaturity(v: string | null): string {
    return v
        ? new Date(v).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '—';
}

export default function Bonds({ bonds, filters }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Bond | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Bond | null>(null);
    const [importOpen, setImportOpen] = useState(false);
    const [search, setSearch] = useState(filters.q);

    const { data, setData, post, put, processing, errors, reset } =
        useForm(emptyForm);

    const importForm = useForm<{ file: File | null }>({ file: null });
    const imported = (
        usePage().props.flash as { imported?: number } | undefined
    )?.imported;

    useEffect(() => {
        if (imported) {
            toast.success({
                title: 'Import selesai',
                message: `${imported} obligasi diproses (baru atau diupdate).`,
            });
        }
    }, [imported, toast]);

    function navigate(over: { q?: string; type?: string; status?: string }) {
        router.get(
            '/admin/bonds',
            {
                q: filters.q,
                type: filters.type,
                status: filters.status,
                ...over,
            },
            { preserveState: true, replace: true },
        );
    }

    function submitSearch(e: FormEvent) {
        e.preventDefault();
        navigate({ q: search });
    }

    function openCreate() {
        setEditing(null);
        reset();
        setOpen(true);
    }

    function openEdit(bond: Bond) {
        setEditing(bond);
        setData({
            code: bond.code,
            name: bond.name,
            type: bond.type,
            issuer: bond.issuer ?? '',
            coupon: bond.coupon !== null ? String(bond.coupon) : '',
            maturity_date: bond.maturity_date ?? '',
            issue_date: bond.issue_date ?? '',
            face_value: bond.face_value !== null ? String(bond.face_value) : '',
            payment_frequency: bond.payment_frequency || 'semiannual',
            last_price: bond.last_price !== null ? String(bond.last_price) : '',
            yield: bond.yield !== null ? String(bond.yield) : '',
            benchmark_yield:
                bond.benchmark_yield !== null
                    ? String(bond.benchmark_yield)
                    : '',
            benchmark_label: bond.benchmark_label ?? '',
            currency: bond.currency || 'IDR',
            status: bond.status,
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing ? 'Bond updated.' : 'Bond created.',
            });
        };

        if (editing) {
            put(`/admin/bonds/${editing.id}`, { onSuccess });
        } else {
            post('/admin/bonds', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/bonds/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({ title: 'Deleted', message: 'Bond removed.' });
                setConfirmDelete(null);
            },
        });
    }

    function importExcel() {
        importForm.post('/admin/bonds/import', {
            preserveScroll: true,
            onSuccess: () => {
                setImportOpen(false);
                importForm.reset();
            },
        });
    }

    return (
        <>
            <Head title="Master Bonds" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Master Bonds
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Kelola daftar master obligasi: pemerintah,
                            korporasi, dan sukuk.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3">
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-1 flex-wrap items-end gap-2"
                        >
                            <div className="min-w-[160px] flex-1">
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
                            <div className="w-48">
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
                            <div className="w-36">
                                <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    Status
                                </span>
                                <select
                                    value={filters.status}
                                    onChange={(e) =>
                                        navigate({ status: e.target.value })
                                    }
                                    className={selectCls}
                                >
                                    <option value="">Semua status</option>
                                    {BOND_STATUS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                type="submit"
                                variant="solid"
                                size="md"
                                className="h-11"
                            >
                                Cari
                            </Button>
                            {(filters.q || filters.type || filters.status) && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="h-11"
                                    onClick={() => {
                                        setSearch('');
                                        navigate({
                                            q: '',
                                            type: '',
                                            status: '',
                                        });
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                        </form>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setImportOpen(true)}
                            >
                                Import Excel
                            </Button>
                        </div>
                    </div>

                    <DataTable<Bond>
                        title="Bonds"
                        createLabel="Bond"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(bond) => setConfirmDelete(bond)}
                        rows={bonds.data}
                        keyField="id"
                        pagination={bonds}
                        columns={[
                            {
                                key: 'code',
                                label: 'Code',
                                render: (r) => (
                                    <span className="font-bold">{r.code}</span>
                                ),
                            },
                            {
                                key: 'name',
                                label: 'Name',
                                render: (r) => r.name,
                            },
                            {
                                key: 'type',
                                label: 'Tipe',
                                render: (r) => (
                                    <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-xs font-semibold dark:bg-white/10 dark:text-dashboard-surface-variant">
                                        {bondTypeLabel(r.type)}
                                    </span>
                                ),
                            },
                            {
                                key: 'issuer',
                                label: 'Issuer',
                                render: (r) => r.issuer ?? '—',
                            },
                            {
                                key: 'coupon',
                                label: 'Coupon',
                                render: (r) => fmtCoupon(r.coupon),
                            },
                            {
                                key: 'ytm',
                                label: 'YTM',
                                render: (r) =>
                                    r.calc ? fmtPct(r.calc.ytm) : '—',
                            },
                            {
                                key: 'last_price',
                                label: 'Last',
                                render: (r) =>
                                    r.last_price !== null
                                        ? r.last_price.toFixed(2)
                                        : '—',
                            },
                            {
                                key: 'maturity',
                                label: 'Jatuh tempo',
                                render: (r) => fmtMaturity(r.maturity_date),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                render: (r) => (
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-xs font-bold',
                                            r.status === 'active'
                                                ? 'bg-dashboard-secondary-container text-dashboard-inverse-surface'
                                                : 'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
                                        )}
                                    >
                                        {r.status}
                                    </span>
                                ),
                            },
                        ]}
                    />
                </div>
            </DashboardLayout>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={editing ? 'Edit Bond' : 'New Bond'}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={submit}
                            disabled={processing}
                        >
                            {editing ? 'Save' : 'Create'}
                        </Button>
                    </>
                }
            >
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Code"
                            name="code"
                            required
                            placeholder="INDOFR0001"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            error={errors.code}
                        />
                        <Input
                            label="Name"
                            name="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />
                    </div>
                    <div>
                        <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            Tipe
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {BOND_TYPES.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setData('type', t)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                                        data.type === t
                                            ? 'bg-landing-primary text-landing-on-primary'
                                            : 'bg-landing-surface-container-low text-landing-on-surface-variant dark:bg-white/5 dark:text-landing-surface-variant',
                                    )}
                                >
                                    {bondTypeLabel(t)}
                                </button>
                            ))}
                        </div>
                        {errors.type && (
                            <span className="font-body mt-1.5 block text-label-sm text-landing-error">
                                {errors.type}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Issuer"
                            name="issuer"
                            value={data.issuer}
                            onChange={(e) => setData('issuer', e.target.value)}
                            error={errors.issuer}
                        />
                        <Input
                            label="Coupon (%)"
                            name="coupon"
                            type="number"
                            step="0.01"
                            value={data.coupon}
                            onChange={(e) => setData('coupon', e.target.value)}
                            error={errors.coupon}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Maturity date"
                            name="maturity_date"
                            type="date"
                            value={data.maturity_date}
                            onChange={(e) =>
                                setData('maturity_date', e.target.value)
                            }
                            error={errors.maturity_date}
                        />
                        <Input
                            label="Issue date"
                            name="issue_date"
                            type="date"
                            value={data.issue_date}
                            onChange={(e) =>
                                setData('issue_date', e.target.value)
                            }
                            error={errors.issue_date}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Face value (nominal)"
                            name="face_value"
                            type="number"
                            value={data.face_value}
                            onChange={(e) =>
                                setData('face_value', e.target.value)
                            }
                            error={errors.face_value}
                        />
                        <div>
                            <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                Frekuensi kupon
                            </span>
                            <div className="flex gap-2">
                                {(['semiannual', 'annual'] as const).map(
                                    (f) => (
                                        <button
                                            key={f}
                                            type="button"
                                            onClick={() =>
                                                setData('payment_frequency', f)
                                            }
                                            className={cn(
                                                'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                                                data.payment_frequency === f
                                                    ? 'bg-landing-primary text-landing-on-primary'
                                                    : 'bg-landing-surface-container-low text-landing-on-surface-variant dark:bg-white/5 dark:text-landing-surface-variant',
                                            )}
                                        >
                                            {f === 'semiannual'
                                                ? 'Semester'
                                                : 'Tahunan'}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Last price (par 100)"
                            name="last_price"
                            type="number"
                            step="0.01"
                            value={data.last_price}
                            onChange={(e) =>
                                setData('last_price', e.target.value)
                            }
                            error={errors.last_price}
                        />
                        <Input
                            label="Yield (%)"
                            name="yield"
                            type="number"
                            step="0.01"
                            value={data.yield}
                            onChange={(e) => setData('yield', e.target.value)}
                            error={errors.yield}
                        />
                        <Input
                            label="Currency"
                            name="currency"
                            value={data.currency}
                            onChange={(e) =>
                                setData(
                                    'currency',
                                    e.target.value.toUpperCase(),
                                )
                            }
                            error={errors.currency}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Benchmark yield (%)"
                            name="benchmark_yield"
                            type="number"
                            step="0.01"
                            value={data.benchmark_yield}
                            onChange={(e) =>
                                setData('benchmark_yield', e.target.value)
                            }
                            error={errors.benchmark_yield}
                        />
                        <Input
                            label="Benchmark label"
                            name="benchmark_label"
                            placeholder="SBN 10Y"
                            value={data.benchmark_label}
                            onChange={(e) =>
                                setData('benchmark_label', e.target.value)
                            }
                            error={errors.benchmark_label}
                        />
                    </div>
                    <div>
                        <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            Status
                        </span>
                        <div className="flex gap-2">
                            {BOND_STATUS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setData('status', s)}
                                    className={cn(
                                        'rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors',
                                        data.status === s
                                            ? 'bg-landing-primary text-landing-on-primary'
                                            : 'bg-landing-surface-container-low text-landing-on-surface-variant dark:bg-white/5 dark:text-landing-surface-variant',
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        {errors.status && (
                            <span className="font-body mt-1.5 block text-label-sm text-landing-error">
                                {errors.status}
                            </span>
                        )}
                    </div>
                </form>
            </Modal>

            <Modal
                open={importOpen}
                onClose={() => setImportOpen(false)}
                title="Import Excel"
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setImportOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            onClick={importExcel}
                            disabled={
                                importForm.processing || !importForm.data.file
                            }
                        >
                            {importForm.processing ? 'Uploading…' : 'Upload'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Kolom:{' '}
                            <code className="rounded bg-dashboard-surface-container-low px-1.5 py-0.5 font-mono text-xs">
                                code
                            </code>
                            ,{' '}
                            <code className="rounded bg-dashboard-surface-container-low px-1.5 py-0.5 font-mono text-xs">
                                name
                            </code>
                            , type, issuer, coupon, maturity_date, status. Kode
                            sama akan di-update.
                        </p>
                        <a
                            href="/admin/bonds/template"
                            className="shrink-0 text-sm font-semibold text-dashboard-primary hover:underline"
                        >
                            Download template
                        </a>
                    </div>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) =>
                            importForm.setData(
                                'file',
                                e.target.files?.[0] ?? null,
                            )
                        }
                        className="w-full rounded-xl border border-dashed border-dashboard-outline-variant/50 p-4 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-landing-primary file:px-4 file:py-2 file:font-semibold file:text-landing-on-primary dark:border-white/15"
                    />
                    {importForm.errors.file && (
                        <span className="font-body block text-label-sm text-landing-error">
                            {importForm.errors.file}
                        </span>
                    )}
                </div>
            </Modal>

            <ConfirmModal
                open={confirmDelete !== null}
                title="Delete bond?"
                message={`Are you sure you want to delete "${confirmDelete?.code ?? ''}"? This cannot be undone.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
