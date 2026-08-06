import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DataTable from '@/components/ui/DataTable';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

type Rule = {
    id: number;
    goal_type: string;
    condition: string;
    threshold: string;
    target_multiplier: string;
    target_months: number;
    priority: string;
    reason: string;
    enabled: boolean;
    order: number;
};

type Props = { rules: Paginated<Rule> };

const conditions = [
    'emergency_gap',
    'debt_ratio',
    'disposable',
    'age_retirement',
];
const goalTypes = [
    'emergency_fund',
    'debt_paydown',
    'wealth_growth',
    'retirement',
    'education',
    'house',
];
const priorities = ['low', 'medium', 'high'];

const inputClass =
    'w-full rounded-xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-4 py-3 text-sm text-dashboard-on-surface transition-colors focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function GoalRules({ rules }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Rule | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Rule | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        goal_type: 'wealth_growth',
        condition: 'disposable',
        threshold: 0,
        target_multiplier: 1,
        target_months: 12,
        priority: 'medium',
        reason: '',
        enabled: true,
        order: 0,
    });

    function openCreate() {
        setEditing(null);
        reset();
        setOpen(true);
    }

    function openEdit(rule: Rule) {
        setEditing(rule);
        setData({
            goal_type: rule.goal_type,
            condition: rule.condition,
            threshold: Number(rule.threshold),
            target_multiplier: Number(rule.target_multiplier),
            target_months: rule.target_months,
            priority: rule.priority,
            reason: rule.reason,
            enabled: rule.enabled,
            order: rule.order,
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing ? 'Rule updated.' : 'Rule created.',
            });
        };

        if (editing) {
            put(`/admin/goal-rules/${editing.id}`, { onSuccess });
        } else {
            post('/admin/goal-rules', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/goal-rules/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({ title: 'Deleted', message: 'Rule removed.' });
                setConfirmDelete(null);
            },
        });
    }

    return (
        <>
            <Head title="Goal Rules" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Goal Detection Rules
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Rules that suggest investment goals from a profile's
                            financial data.
                        </p>
                    </div>

                    <DataTable<Rule>
                        title="Rules"
                        createLabel="Rule"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(r) => setConfirmDelete(r)}
                        rows={rules.data}
                        keyField="id"
                        pagination={rules}
                        columns={[
                            {
                                key: 'order',
                                label: '#',
                                className: 'w-14',
                                render: (r) => r.order,
                            },
                            {
                                key: 'goal_type',
                                label: 'Goal',
                                render: (r) => (
                                    <span className="font-medium capitalize">
                                        {r.goal_type.replaceAll('_', ' ')}
                                    </span>
                                ),
                            },
                            {
                                key: 'condition',
                                label: 'Condition',
                                render: (r) => r.condition,
                            },
                            {
                                key: 'threshold',
                                label: 'Threshold',
                                render: (r) => String(r.threshold),
                            },
                            {
                                key: 'enabled',
                                label: 'Status',
                                render: (r) => (
                                    <span
                                        className={cn(
                                            'inline-block rounded-full px-2 py-0.5 text-[11px] font-bold',
                                            r.enabled
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                                : 'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
                                        )}
                                    >
                                        {r.enabled ? 'Active' : 'Inactive'}
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
                size="lg"
                title={editing ? 'Edit Rule' : 'New Rule'}
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
                        <div>
                            <span className="font-body mb-2 block text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Goal type
                            </span>
                            <select
                                value={data.goal_type}
                                onChange={(e) =>
                                    setData('goal_type', e.target.value)
                                }
                                className={inputClass}
                            >
                                {goalTypes.map((g) => (
                                    <option key={g} value={g}>
                                        {g.replaceAll('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <span className="font-body mb-2 block text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Condition
                            </span>
                            <select
                                value={data.condition}
                                onChange={(e) =>
                                    setData('condition', e.target.value)
                                }
                                className={inputClass}
                            >
                                {conditions.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Input
                        label="Threshold"
                        name="threshold"
                        type="number"
                        step="0.01"
                        required
                        value={data.threshold}
                        onChange={(e) =>
                            setData('threshold', Number(e.target.value))
                        }
                        error={errors.threshold}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Target multiplier"
                            name="target_multiplier"
                            type="number"
                            step="0.01"
                            required
                            value={data.target_multiplier}
                            onChange={(e) =>
                                setData(
                                    'target_multiplier',
                                    Number(e.target.value),
                                )
                            }
                            error={errors.target_multiplier}
                        />
                        <Input
                            label="Target months"
                            name="target_months"
                            type="number"
                            required
                            value={String(data.target_months)}
                            onChange={(e) =>
                                setData('target_months', Number(e.target.value))
                            }
                            error={errors.target_months}
                        />
                    </div>
                    <div>
                        <span className="font-body mb-2 block text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Priority
                        </span>
                        <select
                            value={data.priority}
                            onChange={(e) =>
                                setData('priority', e.target.value)
                            }
                            className={inputClass}
                        >
                            {priorities.map((p) => (
                                <option key={p} value={p}>
                                    {p}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Input
                        label="Reason (shown to investor)"
                        name="reason"
                        required
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                        error={errors.reason}
                    />
                    <label className="flex items-center gap-2 text-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        <input
                            type="checkbox"
                            checked={data.enabled}
                            onChange={(e) =>
                                setData('enabled', e.target.checked)
                            }
                            className="h-4 w-4 accent-dashboard-primary"
                        />
                        Active
                    </label>
                    <Input
                        label="Order"
                        name="order"
                        type="number"
                        required
                        value={String(data.order)}
                        onChange={(e) =>
                            setData('order', Number(e.target.value))
                        }
                        error={errors.order}
                    />
                </form>
            </Modal>

            <ConfirmModal
                open={confirmDelete !== null}
                title="Delete rule?"
                message={`Are you sure you want to delete this goal detection rule? This cannot be undone.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
