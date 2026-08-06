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

type RiskProfile = {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    min_score: number;
    max_score: number;
};

type Props = { riskProfiles: Paginated<RiskProfile> };

export default function RiskProfiles({ riskProfiles }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<RiskProfile | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<RiskProfile | null>(
        null,
    );

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        min_score: 0,
        max_score: 10,
    });

    function openCreate() {
        setEditing(null);
        reset();
        setOpen(true);
    }

    function openEdit(riskProfile: RiskProfile) {
        setEditing(riskProfile);
        setData({
            name: riskProfile.name,
            description: riskProfile.description ?? '',
            min_score: riskProfile.min_score,
            max_score: riskProfile.max_score,
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing
                    ? 'Risk profile updated.'
                    : 'Risk profile created.',
            });
        };

        if (editing) {
            put(`/admin/risk-profiles/${editing.id}`, { onSuccess });
        } else {
            post('/admin/risk-profiles', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/risk-profiles/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({
                    title: 'Deleted',
                    message: 'Risk profile removed.',
                });
                setConfirmDelete(null);
            },
        });
    }

    return (
        <>
            <Head title="Risk Profiles" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Risk Profiles
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Define the score ranges that map to each risk
                            profile.
                        </p>
                    </div>

                    <DataTable<RiskProfile>
                        title="Risk Profiles"
                        createLabel="Risk Profile"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(profile) => setConfirmDelete(profile)}
                        rows={riskProfiles.data}
                        keyField="id"
                        pagination={riskProfiles}
                        columns={[
                            {
                                key: 'name',
                                label: 'Name',
                                render: (r) => (
                                    <span className="font-medium capitalize">
                                        {r.name}
                                    </span>
                                ),
                            },
                            {
                                key: 'slug',
                                label: 'Slug',
                                render: (r) => r.slug,
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
                                key: 'description',
                                label: 'Description',
                                render: (r) => r.description ?? '—',
                            },
                        ]}
                    />
                </div>
            </DashboardLayout>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title={editing ? 'Edit Risk Profile' : 'New Risk Profile'}
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
                    <Input
                        label="Name"
                        name="name"
                        required
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                    />
                    <Input
                        label="Description"
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        error={errors.description}
                    />
                    <div className="grid grid-cols-2 gap-4">
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
                </form>
            </Modal>

            <ConfirmModal
                open={confirmDelete !== null}
                title="Delete risk profile?"
                message={`Are you sure you want to delete "${confirmDelete?.name ?? ''}"? Investors assigned to it will lose their profile label. This cannot be undone.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
