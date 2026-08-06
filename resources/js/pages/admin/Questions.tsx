import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import DataTable from '@/components/ui/DataTable';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types';

type Option = { id?: number; label: string; score: number; order?: number };
type Question = {
    id: number;
    title: string;
    description: string | null;
    category: string;
    order: number;
    active: boolean;
    options: Option[];
};

type Props = { questions: Paginated<Question> };

export default function Questions({ questions }: Props) {
    const toast = useToast();
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Question | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Question | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        order: 0,
        active: true,
        options: [{ label: '', score: 1 }],
    });

    function openCreate() {
        setEditing(null);
        reset();
        setOpen(true);
    }

    function openEdit(question: Question) {
        setEditing(question);
        setData({
            title: question.title,
            description: question.description ?? '',
            category: question.category,
            order: question.order,
            active: question.active,
            options: question.options.map((o, i) => ({
                label: o.label,
                score: o.score,
                order: i,
            })),
        });
        setOpen(true);
    }

    function submit() {
        const onSuccess = () => {
            setOpen(false);
            toast.success({
                title: editing ? 'Updated' : 'Created',
                message: editing ? 'Question updated.' : 'Question created.',
            });
        };

        if (editing) {
            put(`/admin/questions/${editing.id}`, { onSuccess });
        } else {
            post('/admin/questions', { onSuccess });
        }
    }

    function destroy() {
        if (!confirmDelete) {
            return;
        }

        router.delete(`/admin/questions/${confirmDelete.id}`, {
            onSuccess: () => {
                toast.success({
                    title: 'Deleted',
                    message: 'Question removed.',
                });

                setConfirmDelete(null);
            },
        });
    }

    function addOption() {
        setData('options', [...data.options, { label: '', score: 1 }]);
    }

    function updateOption(
        index: number,
        field: keyof Option,
        value: string | number,
    ) {
        setData(
            'options',
            data.options.map((o, i) =>
                i === index
                    ? {
                          ...o,
                          [field]: field === 'score' ? Number(value) : value,
                      }
                    : o,
            ),
        );
    }

    function removeOption(index: number) {
        setData(
            'options',
            data.options.filter((_, i) => i !== index),
        );
    }

    return (
        <>
            <Head title="Investment Questions" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12">
                    <div>
                        <h3 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Investment Questions
                        </h3>
                        <p className="font-body mt-1 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            Configure the investor profiling questionnaire.
                        </p>
                    </div>

                    <DataTable<Question>
                        title="Questions"
                        createLabel="Question"
                        onCreate={openCreate}
                        onEdit={openEdit}
                        onDelete={(question) => setConfirmDelete(question)}
                        rows={questions.data}
                        keyField="id"
                        pagination={questions}
                        columns={[
                            {
                                key: 'order',
                                label: '#',
                                className: 'w-14',
                                render: (q) => q.order,
                            },
                            {
                                key: 'title',
                                label: 'Title',
                                render: (q) => (
                                    <span className="font-medium">
                                        {q.title}
                                    </span>
                                ),
                            },
                            {
                                key: 'category',
                                label: 'Category',
                                render: (q) => q.category,
                            },
                            {
                                key: 'options',
                                label: 'Options',
                                render: (q) => (
                                    <span className="rounded-full bg-dashboard-surface-variant px-2 py-0.5 text-xs font-bold text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant">
                                        {q.options.length}
                                    </span>
                                ),
                            },
                            {
                                key: 'active',
                                label: 'Status',
                                render: (q) => (
                                    <span
                                        className={cn(
                                            'inline-block rounded-full px-2 py-0.5 text-[11px] font-bold',
                                            q.active
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                                                : 'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
                                        )}
                                    >
                                        {q.active ? 'Active' : 'Inactive'}
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
                title={editing ? 'Edit Question' : 'New Question'}
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
                        label="Title"
                        name="title"
                        required
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        error={errors.title}
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
                            label="Category"
                            name="category"
                            required
                            value={data.category}
                            onChange={(e) =>
                                setData('category', e.target.value)
                            }
                            error={errors.category}
                        />
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
                    </div>
                    <label className="flex items-center gap-2 text-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        <input
                            type="checkbox"
                            checked={data.active}
                            onChange={(e) =>
                                setData('active', e.target.checked)
                            }
                            className="h-4 w-4 accent-dashboard-primary"
                        />
                        Active
                    </label>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-body text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                Answer options (with score)
                            </span>
                            <button
                                type="button"
                                onClick={addOption}
                                className="text-dashboard-primary dark:text-dashboard-inverse-primary"
                            >
                                + Add option
                            </button>
                        </div>
                        {data.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Option label"
                                    value={opt.label}
                                    onChange={(e) =>
                                        updateOption(i, 'label', e.target.value)
                                    }
                                    className="flex-1 rounded-lg border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-3 py-2 text-sm focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                                />
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="Score"
                                    value={opt.score}
                                    onChange={(e) =>
                                        updateOption(i, 'score', e.target.value)
                                    }
                                    className="w-20 rounded-lg border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-3 py-2 text-sm focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5"
                                />
                                <button
                                    type="button"
                                    aria-label="Remove option"
                                    disabled={data.options.length === 1}
                                    onClick={() => removeOption(i)}
                                    className="text-dashboard-error disabled:opacity-30"
                                >
                                    <Icon name="remove" size="text-sm" />
                                </button>
                            </div>
                        ))}
                        {errors.options && (
                            <p className="mt-1 text-sm text-dashboard-error">
                                {errors.options}
                            </p>
                        )}
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                open={confirmDelete !== null}
                title="Delete question?"
                message={`Are you sure you want to delete "${confirmDelete?.title ?? ''}"? All of its answer options will also be removed. This cannot be undone.`}
                onClose={() => setConfirmDelete(null)}
                onConfirm={destroy}
            />
        </>
    );
}
