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
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

type Manager = {
    id: number;
    name: string;
    code: string | null;
    website: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    status: string;
};

type Props = {
    managers: Paginated<Manager>;
    filters: { q: string; status: string };
};

const emptyForm = {
    name: '',
    code: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
};

const selectCls =
    'w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-3 py-2.5 font-body text-body-md text-dashboard-on-surface focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function InvestmentManagers({ managers, filters }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Manager | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Manager | null>(null);
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
                message: `${imported} manajer investasi diproses (baru atau diupdate).`,
            });
        }
    }, [imported, toast]);

    function navigate(over: { q?: string; status?: string }) {
        router.get(
            '/admin/investment-managers',
            { q: filters.q, status: filters.status, ...over },
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

    function openEdit(manager: Manager) {
        setEditing(manager);
        setData({
            name: manager.name,
            code: manager.code ?? '',
            website: manager.website ?? '',
            email: manager.email ?? '',
            phone: manager.phone ?? '',
            address: manager.address ?? '',
            status: manager.status,
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing ? 'Manager updated.' : 'Manager created.',
            });
        };

        if (editing) {
            put(`/admin/investment-managers/${editing.id}`, { onSuccess });
        } else {
            post('/admin/investment-managers', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/investment-managers/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({
                    title: 'Deleted',
                    message: 'Manager removed.',
                });
                setConfirmDelete(null);
            },
        });
    }

    function importExcel() {
        importForm.post('/admin/investment-managers/import', {
            preserveScroll: true,
            onSuccess: () => {
                setImportOpen(false);
                importForm.reset();
            },
        });
    }

    return (
        <>
            <Head title="Investment Managers" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Investment Managers
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Kelola data seluruh Manajer Investasi.
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
                                placeholder="Nama, kode, atau email…"
                                className={selectCls}
                            />
                        </div>
                        <div className="w-40">
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
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
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
                        {(filters.q || filters.status) && (
                            <Button
                                variant="outline"
                                size="md"
                                className="h-11"
                                onClick={() => {
                                    setSearch('');
                                    navigate({ q: '', status: '' });
                                }}
                            >
                                Reset
                            </Button>
                        )}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setImportOpen(true)}
                            >
                                Import Excel
                            </Button>
                        </div>
                    </form>

                    <DataTable<Manager>
                        title="Managers"
                        createLabel="Manager"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(manager) => setConfirmDelete(manager)}
                        rows={managers.data}
                        keyField="id"
                        pagination={managers}
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
                                key: 'website',
                                label: 'Website',
                                render: (r) => r.website ?? '—',
                            },
                            {
                                key: 'email',
                                label: 'Email',
                                render: (r) => r.email ?? '—',
                            },
                            {
                                key: 'phone',
                                label: 'Telepon',
                                render: (r) => r.phone ?? '—',
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
                title={editing ? 'Edit Manager' : 'New Manager'}
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
                    <Input
                        label="Website"
                        name="website"
                        type="url"
                        placeholder="https://"
                        value={data.website}
                        onChange={(e) => setData('website', e.target.value)}
                        error={errors.website}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                        />
                        <Input
                            label="Telepon"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            error={errors.phone}
                        />
                    </div>
                    <Input
                        label="Alamat"
                        name="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        error={errors.address}
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
                                name
                            </code>
                            . Opsional: code, website, email, phone, address,
                            status. Kode yang sama akan di-update.
                        </p>
                        <a
                            href="/admin/investment-managers/template"
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
                title="Delete manager?"
                message={`Hapus "${confirmDelete?.name ?? ''}"? Reksa dana terkait akan kehilangan relasi manajer.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
