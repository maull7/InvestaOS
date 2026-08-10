import { router } from '@inertiajs/react';
import { useState } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Select from '@/components/ui/Select';
import StockSearch from '@/components/ui/StockSearch';

type Props = {
    categories: Array<{ value: string; label: string }>;
};

export default function Generate({ categories }: Props) {
    const [category, setCategory] = useState('stock');
    const [selectedCode, setSelectedCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCode) {
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/research/generate',
            {
                category,
                asset_code: selectedCode,
            },
            {
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <DashboardLayout>
            <div className="col-span-full">
                <div className="mb-6">
                    <h1 className="font-headline text-headline-lg font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        Generate Research
                    </h1>
                    <p className="mt-1 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        Create AI-powered investment analysis for stocks
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                label="Research Type"
                                name="category"
                                options={categories}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />

                            {category === 'stock' && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        Select Stock
                                    </label>
                                    <StockSearch
                                        onSelect={setSelectedCode}
                                        placeholder="Search by stock code or name..."
                                    />
                                    {selectedCode && (
                                        <div className="mt-3 rounded-lg bg-dashboard-surface-container p-4 dark:bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dashboard-primary text-dashboard-on-primary">
                                                    <Icon name="query_stats" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                        {selectedCode}
                                                    </p>
                                                    <p className="text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                        Stock selected for
                                                        analysis
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="rounded-lg border border-dashboard-outline bg-dashboard-surface-container p-4 dark:border-white/10 dark:bg-white/5">
                                <div className="mb-2 flex items-start gap-2">
                                    <Icon
                                        name="info"
                                        size="text-sm"
                                        className="mt-0.5 text-dashboard-primary"
                                    />
                                    <div>
                                        <p className="mb-1 text-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                            AI-Powered Analysis
                                        </p>
                                        <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                            The research will be generated using
                                            AI based on real-time market data,
                                            fundamentals, technical indicators,
                                            and recent news. This process may
                                            take a few moments.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    onClick={() => router.visit('/research')}
                                    disabled={isSubmitting}
                                    className="bg-dashboard-surface-container text-dashboard-on-surface hover:bg-dashboard-surface-container-high"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!selectedCode || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Icon
                                                name="hourglass_empty"
                                                size="text-sm"
                                                className="animate-spin"
                                            />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Icon
                                                name="auto_awesome"
                                                size="text-sm"
                                            />
                                            Generate Research
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
