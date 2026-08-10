import { router } from '@inertiajs/react';
import { useState } from 'react';

import Icon from '@/components/ui/Icon';

type AiResearchButtonProps = {
    assetType: 'stock' | 'bond' | 'fund';
    assetId: number;
};

export default function AiResearchButton({ assetType, assetId }: AiResearchButtonProps) {
    const [loading, setLoading] = useState(false);

    const run = () => {
        if (loading) {
            return;
        }

        setLoading(true);

        router.post(
            '/research/generate',
            {
                category: assetType,
                asset_type: assetType,
                asset_id: assetId,
            },
            {
                onFinish: () => setLoading(false),
                preserveScroll: false,
            },
        );
    };

    return (
        <button
            type="button"
            onClick={run}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-dashboard-primary px-3 py-1.5 text-sm font-bold text-dashboard-on-primary transition-colors hover:bg-dashboard-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <Icon name="auto_awesome" size="text-sm" className={loading ? 'animate-spin' : ''} />
            {loading ? 'Menganalisa…' : 'AI Analisis'}
        </button>
    );
}