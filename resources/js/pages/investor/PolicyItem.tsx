import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import Card from '@/components/dashboard/Card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

type Statement = {
    id: number;
    status: 'draft' | 'final' | 'superseded';
    written_by: 'ai' | 'rule' | null;
    language: 'en' | 'id';
    objective: string;
    generated_at: string | null;
    declared_at: string | null;
};

type Goal = {
    type: string;
    target_amount: string;
    target_date: string;
    priority: string;
};
type Allocation = { asset: string; pct: number };

type Document = {
    investor_info: { name: string | null; created_at: string | null };
    investment_objective: string;
    investment_goals: Goal[];
    risk_profile: string | null;
    risk_tolerance: string | null;
    time_horizon: string;
    asset_allocation: Allocation[];
    liquidity_requirement: string;
    investment_constraints: string[];
    benchmark: string;
    tax_consideration: string;
    rebalancing_policy: string;
    review_schedule: string;
    declaration: string;
};

type Props = { statement: Statement; document: Document };

const label: Record<string, { en: string; id: string }> = {
    investor: { en: 'Investor Information', id: 'Informasi Investor' },
    objective: { en: 'Investment Objective', id: 'Tujuan Investasi Utama' },
    goals: { en: 'Investment Goals', id: 'Tujuan Investasi' },
    risk_profile: { en: 'Risk Profile', id: 'Profil Risiko' },
    risk_tolerance: { en: 'Risk Tolerance', id: 'Toleransi Risiko' },
    horizon: { en: 'Investment Time Horizon', id: 'Cakrawala Waktu Investasi' },
    allocation: {
        en: 'Recommended Asset Allocation',
        id: 'Alokasi Aset yang Direkomendasikan',
    },
    liquidity: { en: 'Liquidity Requirement', id: 'Kebutuhan Likuiditas' },
    constraints: { en: 'Investment Constraints', id: 'Batasan Investasi' },
    benchmark: { en: 'Benchmark', id: 'Benchmark' },
    tax: { en: 'Tax Consideration', id: 'Pertimbangan Pajak' },
    rebalancing: { en: 'Rebalancing Policy', id: 'Kebijakan Rebalancing' },
    review: { en: 'Review Schedule', id: 'Jadwal Peninjauan' },
    declaration: { en: 'Declaration', id: 'Pernyataan' },
};

export default function PolicyItem({ statement, document }: Props) {
    const toast = useToast();
    const lang = statement.language;
    const t = (key: string) => label[key][lang];

    const [agreed, setAgreed] = useState(false);
    const { post, processing } = useForm({});

    function finalize() {
        post(`/policy/${statement.id}/finalize`, {
            onSuccess: () =>
                toast.success({
                    title: 'Finalized',
                    message: 'Statement confirmed and finalized.',
                }),
        });
    }

    return (
        <>
            <Head title="Investment Policy" />
            <DashboardLayout>
                <div className="space-y-6 lg:col-span-12 lg:max-w-4xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <Link
                                href="/policy"
                                className="text-sm text-dashboard-primary hover:underline dark:text-dashboard-inverse-primary"
                            >
                                ← Back to statements
                            </Link>
                            <h3 className="mt-1 font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                {document.investment_objective}
                            </h3>
                            <p className="mt-0.5 flex items-center gap-2 text-sm text-dashboard-on-surface-variant capitalize dark:text-dashboard-surface-variant">
                                {statement.status} ·{' '}
                                {lang === 'id' ? 'Indonesia' : 'English'} ·{' '}
                                {statement.generated_at}
                                <span
                                    className={cn(
                                        'inline-block rounded-full px-2 py-0.5 text-[10px] font-bold normal-case',
                                        statement.written_by === 'ai'
                                            ? 'text-dashboard-on-primary-fixed bg-dashboard-primary-fixed-dim'
                                            : 'bg-dashboard-surface-variant text-dashboard-on-surface-variant dark:bg-white/10 dark:text-dashboard-surface-variant',
                                    )}
                                >
                                    {statement.written_by === 'ai'
                                        ? 'Written by AI'
                                        : 'Generated by rules'}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {statement.status === 'final' && (
                                <a href={`/policy/${statement.id}/download`}>
                                    <Button variant="solid">
                                        <Icon name="save" size="text-sm" />{' '}
                                        Download PDF
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    <Card className="space-y-6 p-6 md:p-8">
                        <Section title={t('investor')}>
                            <Row
                                label={
                                    lang === 'id'
                                        ? 'Nama Investor'
                                        : 'Investor Name'
                                }
                                value={document.investor_info.name}
                            />
                            <Row
                                label={
                                    lang === 'id'
                                        ? 'Tanggal Pembuatan'
                                        : 'Date of Issue'
                                }
                                value={document.investor_info.created_at}
                            />
                        </Section>

                        <Section title={t('objective')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.investment_objective}
                            </p>
                        </Section>

                        {document.investment_goals.length > 0 && (
                            <Section title={t('goals')}>
                                <div className="space-y-2">
                                    {document.investment_goals.map(
                                        (goal, i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between rounded-xl border border-dashboard-outline-variant/30 px-4 py-3 text-sm dark:border-white/10"
                                            >
                                                <span className="font-medium text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                                    {goal.type.replaceAll(
                                                        '_',
                                                        ' ',
                                                    )}
                                                </span>
                                                <span className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    $
                                                    {Number(
                                                        goal.target_amount,
                                                    ).toLocaleString()}{' '}
                                                    · {goal.target_date} ·{' '}
                                                    {goal.priority}
                                                </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </Section>
                        )}

                        <Section title={t('risk_profile')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.risk_profile ?? '—'}
                            </p>
                        </Section>

                        <Section title={t('risk_tolerance')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.risk_tolerance ?? '—'}
                            </p>
                        </Section>

                        <Section title={t('horizon')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.time_horizon}
                            </p>
                        </Section>

                        {document.asset_allocation.length > 0 && (
                            <Section title={t('allocation')}>
                                <div className="space-y-2">
                                    {document.asset_allocation.map((row) => (
                                        <div
                                            key={row.asset}
                                            className="flex items-center gap-3"
                                        >
                                            <span className="w-28 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {row.asset}
                                            </span>
                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-dashboard-surface-variant dark:bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-dashboard-primary"
                                                    style={{
                                                        width: `${row.pct}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="w-12 text-right text-sm font-semibold">
                                                {row.pct}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Section>
                        )}

                        <Section title={t('liquidity')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.liquidity_requirement}
                            </p>
                        </Section>

                        <Section title={t('constraints')}>
                            {document.investment_constraints.length === 0 ? (
                                <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    —
                                </p>
                            ) : (
                                <ul className="list-disc space-y-1 pl-5 text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    {document.investment_constraints.map(
                                        (c, i) => (
                                            <li key={i}>{c}</li>
                                        ),
                                    )}
                                </ul>
                            )}
                        </Section>

                        <Section title={t('benchmark')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.benchmark}
                            </p>
                        </Section>

                        <Section title={t('tax')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.tax_consideration}
                            </p>
                        </Section>

                        <Section title={t('rebalancing')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.rebalancing_policy}
                            </p>
                        </Section>

                        <Section title={t('review')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.review_schedule}
                            </p>
                        </Section>

                        <Section title={t('declaration')}>
                            <p className="text-body-md text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                {document.declaration}
                            </p>
                            {statement.status === 'final' &&
                                statement.declared_at && (
                                    <p className="mt-3 text-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        {lang === 'id'
                                            ? `Deklarasi pada ${statement.declared_at}`
                                            : `Declared on ${statement.declared_at}`}
                                    </p>
                                )}
                        </Section>

                        {statement.status === 'draft' && (
                            <div className="border-t border-dashboard-outline-variant/20 pt-6 dark:border-white/10">
                                <label className="flex items-start gap-3 text-sm text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) =>
                                            setAgreed(e.target.checked)
                                        }
                                        className="mt-0.5 h-4 w-4 accent-dashboard-primary"
                                    />
                                    <span>
                                        {lang === 'id'
                                            ? 'Saya menyatakan telah membaca dan memahami dokumen ini.'
                                            : 'I confirm that I have read and understood this document.'}
                                    </span>
                                </label>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="solid"
                                        onClick={finalize}
                                        disabled={processing || !agreed}
                                    >
                                        Finalize Statement
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </DashboardLayout>
        </>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div>
            <h4 className="text-title-md mb-3 font-headline font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {title}
            </h4>
            {children}
        </div>
    );
}

function Row({ label, value }: { label: string; value?: string | null }) {
    return (
        <div className="flex justify-between gap-4 border-b border-dashboard-outline-variant/10 py-2 last:border-0 dark:border-white/5">
            <span className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                {label}
            </span>
            <span className="text-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                {value || '—'}
            </span>
        </div>
    );
}
