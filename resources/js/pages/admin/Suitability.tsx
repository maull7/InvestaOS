import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import type { Paginated } from '@/types';

type Allocation = { id?: number; asset: string; pct: number };

type RiskProfile = {
    id: number;
    name: string;
    min_score: number;
    max_score: number;
    allocations: Allocation[];
};

type Props = { riskProfiles: Paginated<RiskProfile> };

export default function Suitability({ riskProfiles }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [managing, setManaging] = useState<RiskProfile | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<RiskProfile | null>(
        null,
    );

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        min_score: 0,
        max_score: 10,
        allocations: [{ asset: '', pct: 0 }],
    });

    function openCreate() {
        setManaging(null);
        reset();
        setOpen(true);
    }

    function openManage(riskProfile: RiskProfile) {
        setManaging(riskProfile);
        setData({
            name: riskProfile.name,
            min_score: riskProfile.min_score,
            max_score: riskProfile.max_score,
            allocations: riskProfile.allocations.map((a) => ({
                asset: a.asset,
                pct: a.pct,
            })),
        });
        setOpen(true);
    }

    function addRow() {
        setData('allocations', [...data.allocations, { asset: '', pct: 0 }]);
    }

    function updateRow(
        index: number,
        field: keyof Allocation,
        value: string | number,
    ) {
        setData(
            'allocations',
            data.allocations.map((row, i) =>
                i === index
                    ? {
                          ...row,
                          [field]: field === 'pct' ? Number(value) : value,
                      }
                    : row,
            ),
        );
    }

    function removeRow(index: number) {
        setData(
            'allocations',
            data.allocations.filter((_, i) => i !== index),
        );
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: managing ? 'Updated' : 'Created',
                message: managing
                    ? 'Asset allocations saved.'
                    : 'Suitability created.',
            });
        };

        if (managing) {
            put(`/admin/risk-profiles/${managing.id}/allocations`, {
                onSuccess,
            });
        } else {
            post('/admin/suitability', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/suitability/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({
                    title: 'Deleted',
                    message: 'Suitability removed.',
                });
                setConfirmDelete(null);
            },
        });
    }

    return (
        <>
            <Head title="Suitability" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Suitability
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Define which asset classes suit each risk profile.
                        </p>
                    </div>

                    <DataTable<RiskProfile>
                        title="Risk Profiles"
                        createLabel="Suitability"
                        onCreate={openCreate}
                        rows={riskProfiles.data}
                        keyField="id"
                        pagination={riskProfiles}
                        columns={[
                            {
                                key: 'name',
                                label: 'Risk profile',
                                render: (r) => (
                                    <span className="font-medium capitalize">
                                        {r.name}
                                    </span>
                                ),
                            },
                            {
                                key: 'range',
                                label: 'Score range',
                                render: (r) => (
                                    <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-xs font-bold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                        {r.min_score} – {r.max_score}
                                    </span>
                                ),
                            },
                            {
                                key: 'allocations',
                                label: 'Allocation',
                                render: (r) =>
                                    r.allocations
                                        .map((a) => `${a.asset} ${a.pct}%`)
                                        .join(' · ') || '—',
                            },
                        ]}
                        onEdit={openManage}
                        onDelete={(r) => setConfirmDelete(r)}
                    />
                </div>
            </DashboardLayout>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={
                    managing
                        ? `Allocations - ${managing.name}`
                        : 'New Suitability'
                }
                size="lg"
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
                            {managing ? 'Save' : 'Create'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    {!managing && (
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Name"
                                name="name"
                                required
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                error={errors.name}
                            />
                            <Input
                                label="Min score"
                                name="min_score"
                                type="number"
                                required
                                value={String(data.min_score)}
                                onChange={(e) =>
                                    setData('min_score', Number(e.target.value))
                                }
                                error={errors.min_score}
                            />
                            <Input
                                label="Max score"
                                name="max_score"
                                type="number"
                                required
                                value={String(data.max_score)}
                                onChange={(e) =>
                                    setData('max_score', Number(e.target.value))
                                }
                                error={errors.max_score}
                            />
                        </div>
                    )}

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-body text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Asset classes (percentages)
                            </span>
                            <button
                                type="button"
                                onClick={addRow}
                                className="text-dashboard-primary dark:text-dashboard-inverse-primary"
                            >
                                + Add asset
                            </button>
                        </div>
                        <div className="space-y-2">
                            {data.allocations.map((row, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="text"
                                        placeholder="Asset name (e.g. Stocks)"
                                        value={row.asset}
                                        onChange={(e) =>
                                            updateRow(
                                                i,
                                                'asset',
                                                e.target.value,
                                            )
                                        }
                                        className="flex-1 rounded-lg border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-3 py-2 text-sm focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                                    />
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        placeholder="%"
                                        value={row.pct}
                                        onChange={(e) =>
                                            updateRow(i, 'pct', e.target.value)
                                        }
                                        className="w-24 rounded-lg border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-3 py-2 text-sm focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                                    />
                                    <button
                                        type="button"
                                        aria-label="Remove asset"
                                        disabled={data.allocations.length === 1}
                                        onClick={() => removeRow(i)}
                                        className="text-dashboard-error disabled:opacity-30"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        {errors.allocations && (
                            <p className="mt-1 text-sm text-dashboard-error">
                                {errors.allocations}
                            </p>
                        )}
                    </div>
                </div>
            </Modal>

            <ConfirmModal
                open={confirmDelete !== null}
                title="Delete suitability?"
                message={`Are you sure you want to delete "${confirmDelete?.name ?? ''}"? Its asset allocations will be removed and investors lose this label. This cannot be undone.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
