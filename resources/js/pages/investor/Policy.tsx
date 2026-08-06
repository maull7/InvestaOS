import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DataTable from '@/components/ui/DataTable';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type Statement = {
    id: number;
    objective: string;
    status: 'draft' | 'final' | 'superseded';
    written_by: 'ai' | 'rule' | null;
    language: 'en' | 'id';
    generated_at: string | null;
};

type RiskProfile = { name: string };

type Props = {
    statements: Statement[];
    riskProfile: RiskProfile | null;
};

const statusTone: Record<Statement['status'], string> = {
    draft: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    final: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    superseded:
        'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
};

const reviewSchedules = ['Monthly', 'Quarterly', 'Semi Annual', 'Annual'];

const inputClass =
    'w-full rounded-xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-4 py-2.5 text-sm text-dashboard-on-surface transition-colors focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function Policy({ statements, riskProfile }: Props) {
    const toast = useToast();
    const [regen, setRegen] = useState<Statement | null>(null);
    const [del, setDel] = useState<Statement | null>(null);
    const [autoLoading, setAutoLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        language: 'en',
        objective: '',
        benchmark: '',
        rebalancing_policy: '',
        review_schedule: 'Annual',
        restrictions: [''],
    });

    function addRestriction() {
        setData('restrictions', [...data.restrictions, '']);
    }

    function updateRestriction(index: number, value: string) {
        setData(
            'restrictions',
            data.restrictions.map((r, i) => (i === index ? value : r)),
        );
    }

    function removeRestriction(index: number) {
        setData(
            'restrictions',
            data.restrictions.filter((_, i) => i !== index),
        );
    }

    function generate() {
        post('/policy', {
            onSuccess: () =>
                toast.success({
                    title: 'Generated',
                    message: 'Investment Policy Statement created.',
                }),
        });
    }

    function autoGenerate() {
        setAutoLoading(true);
        router.post(
            '/policy',
            { language: data.language },
            {
                onSuccess: () => {
                    toast.success({
                        title: 'Generated',
                        message: 'Statement created from your profile and AI.',
                    });
                    setAutoLoading(false);
                },
                onError: () => setAutoLoading(false),
            },
        );
    }

    function confirmRegen() {
        if (!regen) {
            return;
        }

        router.post(
            `/policy/${regen.id}/regenerate`,
            {},
            {
                onSuccess: () => {
                    toast.success({
                        title: 'Regenerated',
                        message: 'A new statement was generated.',
                    });
                    setRegen(null);
                },
            },
        );
    }

    function confirmDelete() {
        if (!del) {
            return;
        }

        router.delete(`/policy/${del.id}`, {
            onSuccess: () => {
                toast.success({
                    title: 'Deleted',
                    message: 'Statement removed.',
                });
                setDel(null);
            },
        });
    }

    return (
        <>
            <Head title="Investment Policy" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Investment Policy
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Generate and manage your Investment Policy
                            Statement.
                        </p>
                    </div>

                    <Card className="p-6">
                        <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            New Statement
                        </h4>
                        <p className="mt-0.5 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Objective is set automatically from your{' '}
                            {riskProfile?.name ?? 'risk'} profile. You can
                            override it.
                        </p>

                        <div className="mt-5 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <span className="font-body mb-2 block text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        Language
                                    </span>
                                    <select
                                        value={data.language}
                                        onChange={(e) =>
                                            setData('language', e.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        <option value="en">English</option>
                                        <option value="id">Indonesia</option>
                                    </select>
                                </div>
                                <Input
                                    label="Objective (optional)"
                                    name="objective"
                                    placeholder="Leave empty to auto-fill"
                                    value={data.objective}
                                    onChange={(e) =>
                                        setData('objective', e.target.value)
                                    }
                                    error={errors.objective}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <Input
                                    label="Benchmark"
                                    name="benchmark"
                                    placeholder="IDX Composite (IHSG) & LQ45"
                                    value={data.benchmark}
                                    onChange={(e) =>
                                        setData('benchmark', e.target.value)
                                    }
                                    error={errors.benchmark}
                                />
                                <Input
                                    label="Rebalancing policy"
                                    name="rebalancing_policy"
                                    placeholder="Every 6 months or drift >5%"
                                    value={data.rebalancing_policy}
                                    onChange={(e) =>
                                        setData(
                                            'rebalancing_policy',
                                            e.target.value,
                                        )
                                    }
                                    error={errors.rebalancing_policy}
                                />
                                <div>
                                    <span className="font-body mb-2 block text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        Review schedule
                                    </span>
                                    <select
                                        value={data.review_schedule}
                                        onChange={(e) =>
                                            setData(
                                                'review_schedule',
                                                e.target.value,
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        {reviewSchedules.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-body text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        Investment constraints
                                    </span>
                                    <button
                                        type="button"
                                        onClick={addRestriction}
                                        className="text-dashboard-primary dark:text-dashboard-inverse-primary"
                                    >
                                        + Add constraint
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.restrictions.map((restriction, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder="e.g. Syariah only, Max 40% stocks"
                                                value={restriction}
                                                onChange={(e) =>
                                                    updateRestriction(
                                                        i,
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex-1 rounded-lg border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-3 py-2 text-sm focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                                            />
                                            <button
                                                type="button"
                                                aria-label="Remove constraint"
                                                disabled={
                                                    data.restrictions.length ===
                                                    1
                                                }
                                                onClick={() =>
                                                    removeRestriction(i)
                                                }
                                                className="text-dashboard-error disabled:opacity-30"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3">
                                <Button
                                    variant="primary"
                                    onClick={autoGenerate}
                                    disabled={autoLoading || processing}
                                    className="px-4 py-2 text-xs"
                                >
                                    <Icon name="bolt" size="text-sm" />
                                    {autoLoading
                                        ? 'Generating…'
                                        : 'Auto Generate (AI)'}
                                </Button>
                                <Button
                                    variant="solid"
                                    onClick={generate}
                                    disabled={processing || autoLoading}
                                >
                                    <Icon name="file" size="text-sm" />
                                    {processing
                                        ? 'Generating…'
                                        : 'Generate Statement'}
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <DataTable<Statement>
                        title="Statements"
                        rows={statements}
                        keyField="id"
                        columns={[
                            {
                                key: 'objective',
                                label: 'Objective',
                                render: (s) => (
                                    <span className="font-medium">
                                        {s.objective}
                                    </span>
                                ),
                            },
                            {
                                key: 'status',
                                label: 'Status',
                                render: (s) => (
                                    <span
                                        className={cn(
                                            'inline-block rounded-full px-2 py-0.5 text-[11px] font-bold capitalize',
                                            statusTone[s.status],
                                        )}
                                    >
                                        {s.status}
                                    </span>
                                ),
                            },
                            {
                                key: 'written_by',
                                label: 'Source',
                                render: (s) => (
                                    <span
                                        className={cn(
                                            'inline-block rounded-full px-2 py-0.5 text-[11px] font-bold',
                                            s.written_by === 'ai'
                                                ? 'text-dashboard-on-primary-fixed bg-dashboard-primary-fixed-dim'
                                                : 'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
                                        )}
                                    >
                                        {s.written_by === 'ai' ? 'AI' : 'Rule'}
                                    </span>
                                ),
                            },
                            {
                                key: 'language',
                                label: 'Language',
                                render: (s) =>
                                    s.language === 'id'
                                        ? 'Indonesia'
                                        : 'English',
                            },
                            {
                                key: 'generated_at',
                                label: 'Generated',
                                render: (s) => s.generated_at ?? '—',
                            },
                            {
                                key: 'actions',
                                label: 'Actions',
                                render: (s) => (
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/policy/${s.id}`}
                                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-dashboard-primary hover:underline dark:text-dashboard-inverse-primary"
                                        >
                                            <Icon name="file" size="text-sm" />{' '}
                                            View
                                        </Link>
                                        {s.status === 'final' && (
                                            <a
                                                href={`/policy/${s.id}/download`}
                                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-dashboard-on-surface-variant hover:text-dashboard-on-surface dark:text-dashboard-surface-variant"
                                            >
                                                <Icon
                                                    name="save"
                                                    size="text-sm"
                                                />{' '}
                                                PDF
                                            </a>
                                        )}
                                        <button
                                            type="button"
                                            aria-label="Regenerate"
                                            onClick={() => setRegen(s)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-dashboard-on-surface-variant transition-colors hover:bg-dashboard-surface-container-high dark:text-dashboard-surface-variant"
                                        >
                                            <Icon
                                                name="refresh"
                                                size="text-sm"
                                            />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Delete"
                                            onClick={() => setDel(s)}
                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-dashboard-error transition-colors hover:bg-dashboard-error/10"
                                        >
                                            <Icon name="trash" size="text-sm" />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </DashboardLayout>

            <ConfirmModal
                open={regen !== null}
                title="Regenerate statement?"
                message="This creates a new statement from your latest profile data and marks the current one as superseded."
                confirmLabel="Regenerate"
                onClose={() => setRegen(null)}
                onConfirm={confirmRegen}
            />

            <ConfirmModal
                open={del !== null}
                title="Delete statement?"
                message="Are you sure you want to delete this Investment Policy Statement? This cannot be undone."
                onClose={() => setDel(null)}
                onConfirm={confirmDelete}
            />
        </>
    );
}
