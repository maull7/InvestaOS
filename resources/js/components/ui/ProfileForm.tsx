import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import type { FormEvent } from 'react';

import Button from './Button';
import Input from './Input';
import { useToast } from './Toast';

export type ProfileData = {
    full_name: string | null;
    date_of_birth: string | null;
    gender: string | null;
    occupation: string | null;
    company: string | null;
    annual_income: string | null;
    monthly_expenses: string | null;
    total_assets: string | null;
    total_liabilities: string | null;
    emergency_fund: string | null;
};

const genderOptions = ['Male', 'Female', 'Other'];

const inputClass =
    'w-full rounded-xl border border-dashboard-outline-variant/30 bg-dashboard-surface-container-low px-4 py-3 text-sm text-dashboard-on-surface transition-colors focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface';

export default function ProfileForm({ profile }: { profile: ProfileData | null }) {
    const toast = useToast();
    const { data, setData, put, processing, errors } = useForm({
        full_name: '',
        date_of_birth: '',
        gender: '',
        occupation: '',
        company: '',
        annual_income: '',
        monthly_expenses: '',
        total_assets: '',
        total_liabilities: '',
        emergency_fund: '',
    });

    useEffect(() => {
        if (profile) {
            setData({
                full_name: profile.full_name ?? '',
                date_of_birth: profile.date_of_birth ?? '',
                gender: profile.gender ?? '',
                occupation: profile.occupation ?? '',
                company: profile.company ?? '',
                annual_income: profile.annual_income ?? '',
                monthly_expenses: profile.monthly_expenses ?? '',
                total_assets: profile.total_assets ?? '',
                total_liabilities: profile.total_liabilities ?? '',
                emergency_fund: profile.emergency_fund ?? '',
            });
        }
    }, [profile, setData]);

    function submit(e: FormEvent) {
        e.preventDefault();
        put('/profile', {
            onSuccess: () => toast.success({ title: 'Updated', message: 'Your profile was updated.' }),
        });
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full name" name="full_name" required value={data.full_name} onChange={(e) => setData('full_name', e.target.value)} error={errors.full_name} />
                <Input label="Date of birth" name="date_of_birth" type="date" required value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} error={errors.date_of_birth} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <span className="mb-2 block font-body text-label-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        Gender
                    </span>
                    <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className={inputClass} required>
                        <option value="" disabled>Select gender</option>
                        {genderOptions.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
                <Input label="Occupation" name="occupation" required value={data.occupation} onChange={(e) => setData('occupation', e.target.value)} error={errors.occupation} />
            </div>

            <Input label="Company" name="company" value={data.company} onChange={(e) => setData('company', e.target.value)} error={errors.company} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <MoneyField label="Annual income" data={data} errors={errors} field="annual_income" setData={setData} />
                <MoneyField label="Monthly expenses" data={data} errors={errors} field="monthly_expenses" setData={setData} />
                <MoneyField label="Total assets" data={data} errors={errors} field="total_assets" setData={setData} />
                <MoneyField label="Total liabilities" data={data} errors={errors} field="total_liabilities" setData={setData} />
                <MoneyField label="Emergency fund" data={data} errors={errors} field="emergency_fund" setData={setData} />
            </div>

            <div className="flex justify-end">
                <Button variant="solid" type="submit" disabled={processing}>
                    Save Changes
                </Button>
            </div>
        </form>
    );
}

type MoneyFieldProps = {
    label: string;
    data: Record<string, string>;
    errors: Record<string, string>;
    field: 'annual_income' | 'monthly_expenses' | 'total_assets' | 'total_liabilities' | 'emergency_fund';
    setData: (key: string, value: string) => void;
};

function MoneyField({ label, data, errors, field, setData }: MoneyFieldProps) {
    return (
        <Input
            label={label}
            name={field}
            type="number"
            step="0.01"
            min="0"
            required
            value={data[field]}
            onChange={(e) => setData(field, e.target.value)}
            error={errors[field]}
        />
    );
}