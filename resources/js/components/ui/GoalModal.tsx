import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';

import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import { useToast } from './Toast';

const goalTypes = ['retirement', 'education', 'house', 'emergency_fund', 'wealth_growth', 'debt_paydown'];

const inputClass =
    'w-full rounded-xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-4 py-3 text-sm text-dashboard-on-surface transition-colors focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export type GoalFormData = {
    id: number;
    type: string;
    target_amount: string;
    target_date: string;
    priority: string;
};

type GoalModalProps = {
    open: boolean;
    goal?: GoalFormData | null;
    onClose: () => void;
};

export default function GoalModal({ open, goal, onClose }: GoalModalProps) {
    const toast = useToast();
    const { data, setData, post, put, processing, errors, reset } = useForm({
        type: '',
        target_amount: '',
        target_date: '',
        priority: 'medium',
    });

    useEffect(() => {
        if (open) {
            if (goal) {
                setData({
                    type: goal.type,
                    target_amount: goal.target_amount,
                    target_date: goal.target_date,
                    priority: goal.priority,
                });
            } else {
                reset();
            }
        }
    }, [open, goal, setData, reset]);

    function submit(e: FormEvent) {
        e.preventDefault();
        const onSuccess = () => {
            onClose();
            toast.success({
                title: goal ? 'Updated' : 'Goal added',
                message: goal ? 'Your goal was updated.' : 'Your investment goal was saved.',
            });
        };

        if (goal) {
            put(`/goals/${goal.id}`, { onSuccess });
        } else {
            post('/goals', { onSuccess });
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={goal ? 'Edit Investment Goal' : 'Add Investment Goal'}
            size="md"
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" type="submit" form="goal-form" disabled={processing}>
                        {goal ? 'Save' : 'Add Goal'}
                    </Button>
                </>
            }
        >
            <form id="goal-form" className="space-y-4" onSubmit={submit}>
                <div>
                    <span className="mb-2 block font-body text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        Goal type
                    </span>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className={inputClass}
                        required
                    >
                        <option value="" disabled>Select goal</option>
                        {goalTypes.map((g) => (
                            <option key={g} value={g}>
                                {g.replaceAll('_', ' ')}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Target amount"
                        name="target_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={data.target_amount}
                        onChange={(e) => setData('target_amount', e.target.value)}
                        error={errors.target_amount}
                    />
                    <Input
                        label="Target date"
                        name="target_date"
                        type="date"
                        required
                        value={data.target_date}
                        onChange={(e) => setData('target_date', e.target.value)}
                        error={errors.target_date}
                    />
                </div>
                <div>
                    <span className="mb-2 block font-body text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        Priority
                    </span>
                    <select
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                        className={inputClass}
                    >
                        {['low', 'medium', 'high'].map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </Modal>
    );
}