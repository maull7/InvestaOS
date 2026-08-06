import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

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

type Props = {
    stocks: Paginated<Stock>;
    filters: { q: string; sector: string; board: string };
    sectors: string[];
    boards: string[];
};

const emptyForm = {
    code: '',
    name: '',
    sector: '',
    industry: '',
    listing_board: '',
    ipo_date: '',
    website: '',
    status: 'active',
};

const selectCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function Stocks({ stocks, filters, sectors, boards }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Stock | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Stock | null>(null);
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
                message: `${imported} saham diproses (baru atau diupdate).`,
            });
        }
    }, [imported, toast]);

    function navigate(over: { q?: string; sector?: string; board?: string }) {
        router.get(
            '/admin/stocks',
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

    function openCreate() {
        setEditing(null);
        reset();
        setOpen(true);
    }

    function openEdit(stock: Stock) {
        setEditing(stock);
        setData({
            code: stock.code,
            name: stock.name,
            sector: stock.sector ?? '',
            industry: stock.industry ?? '',
            listing_board: stock.listing_board ?? '',
            ipo_date: stock.ipo_date ?? '',
            website: stock.website ?? '',
            status: stock.status,
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing ? 'Stock updated.' : 'Stock created.',
            });
        };

        if (editing) {
            put(`/admin/stocks/${editing.id}`, { onSuccess });
        } else {
            post('/admin/stocks', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/stocks/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({ title: 'Deleted', message: 'Stock removed.' });
                setConfirmDelete(null);
            },
        });
    }

    function importExcel() {
        importForm.post('/admin/stocks/import', {
            preserveScroll: true,
            onSuccess: () => {
                setImportOpen(false);
                importForm.reset();
            },
        });
    }

    return (
        <>
            <Head title="Master Stocks" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Master Stocks
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Manage the master list of stocks. Live prices are
                            pulled from Yahoo Finance on the detail page.
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
                                    placeholder="Kode atau nama saham…"
                                    className={selectCls}
                                />
                            </div>
                            <div className="w-40">
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
                            <div className="w-40">
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
                            <Button
                                type="submit"
                                variant="solid"
                                size="md"
                                className="h-11"
                            >
                                Cari
                            </Button>
                            {(filters.q || filters.sector || filters.board) && (
                                <Button
                                    variant="outline"
                                    size="md"
                                    className="h-11"
                                    onClick={() => {
                                        setSearch('');
                                        navigate({
                                            q: '',
                                            sector: '',
                                            board: '',
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

                    <DataTable<Stock>
                        title="Stocks"
                        createLabel="Stock"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(stock) => setConfirmDelete(stock)}
                        rows={stocks.data}
                        keyField="id"
                        pagination={stocks}
                        columns={[
                            {
                                key: 'code',
                                label: 'Code',
                                render: (r) => (
                                    <Link
                                        href={`/admin/stocks/${r.code}`}
                                        className="font-bold text-dashboard-primary hover:underline"
                                    >
                                        {r.code}
                                    </Link>
                                ),
                            },
                            {
                                key: 'name',
                                label: 'Name',
                                render: (r) => r.name,
                            },
                            {
                                key: 'detail',
                                label: 'Detail',
                                render: (r) => (
                                    <Link
                                        href={`/admin/stocks/${r.code}`}
                                        className="inline-flex rounded-full border border-dashboard-outline-variant px-3 py-1 text-xs font-semibold text-dashboard-on-surface transition-colors hover:bg-dashboard-surface-container-high dark:border-white/15 dark:text-dashboard-inverse-on-surface dark:hover:bg-white/5"
                                    >
                                        Detail
                                    </Link>
                                ),
                            },
                            {
                                key: 'listing_board',
                                label: 'Board',
                                render: (r) => r.listing_board ?? '—',
                            },
                            {
                                key: 'sector',
                                label: 'Sector',
                                render: (r) => r.sector ?? '—',
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
                title={editing ? 'Edit Stock' : 'New Stock'}
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
                            placeholder="BBCA"
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
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Sector"
                            name="sector"
                            value={data.sector}
                            onChange={(e) => setData('sector', e.target.value)}
                            error={errors.sector}
                        />
                        <Input
                            label="Industry"
                            name="industry"
                            value={data.industry}
                            onChange={(e) =>
                                setData('industry', e.target.value)
                            }
                            error={errors.industry}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Listing board"
                            name="listing_board"
                            placeholder="Main / Development / Acceleration"
                            value={data.listing_board}
                            onChange={(e) =>
                                setData('listing_board', e.target.value)
                            }
                            error={errors.listing_board}
                        />
                        <Input
                            label="IPO date"
                            name="ipo_date"
                            type="date"
                            value={data.ipo_date}
                            onChange={(e) =>
                                setData('ipo_date', e.target.value)
                            }
                            error={errors.ipo_date}
                        />
                    </div>
                    <Input
                        label="Website"
                        name="website"
                        type="url"
                        placeholder="https://"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        error={errors.website}
                    />
                    <div>
                        <span className="font-body mb-2 block text-label-md text-landing-on-surface dark:text-landing-inverse-on-surface">
                            Status
                        </span>
                        <div className="flex gap-2">
                            {(['active', 'inactive'] as const).map((s) => (
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
                            Kolom wajib:{' '}
                            <code className="rounded bg-dashboard-surface-container-low px-1.5 py-0.5 font-mono text-xs">
                                code
                            </code>
                            ,{' '}
                            <code className="rounded bg-dashboard-surface-container-low px-1.5 py-0.5 font-mono text-xs">
                                name
                            </code>
                            . Opsional: sector, industry, listing_board,
                            ipo_date, website, status. Kode yang sama akan
                            di-update.
                        </p>
                        <a
                            href="/admin/stocks/template"
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
                title="Delete stock?"
                message={`Are you sure you want to delete "${confirmDelete?.code ?? ''}"? This cannot be undone.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
