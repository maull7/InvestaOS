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
    investment_manager_id: number | null;
    code: string | null;
    name: string;
    fund_type: string;
    currency: string;
    risk_level: number | null;
    custodian_bank: string | null;
    launch_date: string | null;
    status: string;
    investment_manager?: { id: number; name: string } | null;
};

type Props = {
    funds: Paginated<Fund>;
    filters: { q: string; type: string; manager: string; custodian: string };
    managers: { id: number; name: string }[];
    custodians: string[];
};

const emptyForm = {
    name: '',
    code: '',
    investment_manager_id: '',
    fund_type: 'money_market',
    currency: 'IDR',
    risk_level: '',
    custodian_bank: '',
    launch_date: '',
    status: 'active',
};

const selectCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function MutualFunds({
    funds,
    filters,
    managers,
    custodians,
}: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Fund | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Fund | null>(null);
    const [importOpen, setImportOpen] = useState(false);
    const [search, setSearch] = useState(filters.q);

    const { data, setData, post, put, processing, errors, reset } =
        useForm(emptyForm);
    const importForm = useForm<{ file: File | null }>({ file: null });
    const imported = (
        usePage().props.flash as
            { imported?: { count?: number; skipped?: number } } | undefined
    )?.imported;

    useEffect(() => {
        if (imported) {
            toast.success({
                title: 'Import selesai',
                message: `${imported.count ?? 0} reksa dana diproses${imported.skipped ? `, ${imported.skipped} dilewati (tipe tidak dikenal)` : ''}.`,
            });
        }
    }, [imported, toast]);

    function navigate(over: {
        q?: string;
        type?: string;
        manager?: string;
        custodian?: string;
    }) {
        router.get(
            '/admin/mutual-funds',
            {
                q: filters.q,
                type: filters.type,
                manager: filters.manager,
                custodian: filters.custodian,
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

    function openEdit(fund: Fund) {
        setEditing(fund);
        setData({
            name: fund.name,
            code: fund.code ?? '',
            investment_manager_id:
                fund.investment_manager_id !== null
                    ? String(fund.investment_manager_id)
                    : '',
            fund_type: fund.fund_type,
            currency: fund.currency,
            risk_level: fund.risk_level !== null ? String(fund.risk_level) : '',
            custodian_bank: fund.custodian_bank ?? '',
            launch_date: fund.launch_date ?? '',
            status: fund.status,
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing ? 'Fund updated.' : 'Fund created.',
            });
        };

        if (editing) {
            put(`/admin/mutual-funds/${editing.id}`, { onSuccess });
        } else {
            post('/admin/mutual-funds', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/mutual-funds/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({ title: 'Deleted', message: 'Fund removed.' });
                setConfirmDelete(null);
            },
        });
    }

    function importCsv() {
        importForm.post('/admin/mutual-funds/import', {
            preserveScroll: true,
            onSuccess: () => {
                setImportOpen(false);
                importForm.reset();
            },
        });
    }

    return (
        <>
            <Head title="Master Mutual Funds" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Master Mutual Funds
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Kelola seluruh produk Reksa Dana.
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
                                    placeholder="Kode atau nama…"
                                    className={selectCls}
                                />
                            </div>
                            <div className="w-44">
                                <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    Jenis
                                </span>
                                <select
                                    value={filters.type}
                                    onChange={(e) =>
                                        navigate({ type: e.target.value })
                                    }
                                    className={selectCls}
                                >
                                    <option value="">Semua jenis</option>
                                    {FUND_TYPES.map((t) => (
                                        <option key={t} value={t}>
                                            {fundTypeLabel(t)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-44">
                                <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    MI
                                </span>
                                <select
                                    value={filters.manager}
                                    onChange={(e) =>
                                        navigate({ manager: e.target.value })
                                    }
                                    className={selectCls}
                                >
                                    <option value="">Semua MI</option>
                                    {managers.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-44">
                                <span className="font-body mb-1 block text-label-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    Kustodian
                                </span>
                                <select
                                    value={filters.custodian}
                                    onChange={(e) =>
                                        navigate({ custodian: e.target.value })
                                    }
                                    className={selectCls}
                                >
                                    <option value="">Semua kustodian</option>
                                    {custodians.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
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
                            {(filters.q ||
                                filters.type ||
                                filters.manager ||
                                filters.custodian) && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="h-11"
                                    onClick={() => {
                                        setSearch('');
                                        navigate({
                                            q: '',
                                            type: '',
                                            manager: '',
                                            custodian: '',
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
                                Import CSV
                            </Button>
                        </div>
                    </div>

                    <DataTable<Fund>
                        title="Mutual Funds"
                        createLabel="Fund"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(fund) => setConfirmDelete(fund)}
                        rows={funds.data}
                        keyField="id"
                        pagination={funds}
                        columns={[
                            {
                                key: 'name',
                                label: 'Nama',
                                render: (r) => (
                                    <span className="font-semibold">
                                        {r.name}
                                    </span>
                                ),
                            },
                            {
                                key: 'code',
                                label: 'Kode',
                                render: (r) => r.code ?? '—',
                            },
                            {
                                key: 'type',
                                label: 'Jenis',
                                render: (r) => (
                                    <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-xs font-semibold dark:bg-white/10 dark:text-dashboard-surface-variant">
                                        {fundTypeLabel(r.fund_type)}
                                    </span>
                                ),
                            },
                            {
                                key: 'manager',
                                label: 'MI',
                                render: (r) =>
                                    r.investment_manager?.name ?? '—',
                            },
                            {
                                key: 'risk',
                                label: 'Risiko',
                                render: (r) => (
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-xs font-bold',
                                            riskTone(r.risk_level),
                                        )}
                                    >
                                        {riskLabel(r.risk_level)}
                                    </span>
                                ),
                            },
                            {
                                key: 'custodian',
                                label: 'Kustodian',
                                render: (r) => r.custodian_bank ?? '—',
                            },
                            {
                                key: 'currency',
                                label: 'Cur',
                                render: (r) => r.currency,
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
                title={editing ? 'Edit Fund' : 'New Fund'}
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
                            label="Nama"
                            name="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                        />
                        <Input
                            label="Kode (opsional)"
                            name="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            error={errors.code}
                        />
                    </div>
                    <div>
                        <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            Jenis
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {FUND_TYPES.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setData('fund_type', t)}
                                    className={cn(
                                        'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                                        data.fund_type === t
                                            ? 'bg-landing-primary text-landing-on-primary'
                                            : 'bg-landing-surface-container-low text-landing-on-surface-variant dark:bg-white/5 dark:text-landing-surface-variant',
                                    )}
                                >
                                    {fundTypeLabel(t)}
                                </button>
                            ))}
                        </div>
                        {errors.fund_type && (
                            <span className="font-body mt-1.5 block text-label-sm text-landing-error">
                                {errors.fund_type}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                Manajer Investasi
                            </span>
                            <select
                                value={data.investment_manager_id}
                                onChange={(e) =>
                                    setData(
                                        'investment_manager_id',
                                        e.target.value,
                                    )
                                }
                                className={selectCls}
                            >
                                <option value="">—</option>
                                {managers.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                Tingkat risiko
                            </span>
                            <select
                                value={data.risk_level}
                                onChange={(e) =>
                                    setData('risk_level', e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="">—</option>
                                {[1, 2, 3, 4, 5].map((r) => (
                                    <option key={r} value={r}>
                                        {r} — {riskLabel(r)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
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
                        <Input
                            label="Launch date"
                            name="launch_date"
                            type="date"
                            value={data.launch_date}
                            onChange={(e) =>
                                setData('launch_date', e.target.value)
                            }
                            error={errors.launch_date}
                        />
                        <div>
                            <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                                Status
                            </span>
                            <select
                                value={data.status}
                                onChange={(e) =>
                                    setData('status', e.target.value)
                                }
                                className={selectCls}
                            >
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                            </select>
                        </div>
                    </div>
                    <Input
                        label="Bank Kustodian"
                        name="custodian_bank"
                        value={data.custodian_bank}
                        onChange={(e) =>
                            setData('custodian_bank', e.target.value)
                        }
                        error={errors.custodian_bank}
                    />
                </form>
            </Modal>

            <Modal
                open={importOpen}
                onClose={() => setImportOpen(false)}
                title="Import CSV"
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
                            onClick={importCsv}
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
                            Kolom: code, name, fund_type, currency, risk_level,
                            custodian_bank, launch_date, status,
                            investment_manager_code. Kode sama akan di-update.
                        </p>
                        <a
                            href="/admin/mutual-funds/template"
                            className="shrink-0 text-sm font-semibold text-dashboard-primary hover:underline"
                        >
                            Download template
                        </a>
                    </div>
                    <input
                        type="file"
                        accept=".csv,.txt"
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
                title="Delete fund?"
                message={`Hapus "${confirmDelete?.name ?? ''}"?`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
