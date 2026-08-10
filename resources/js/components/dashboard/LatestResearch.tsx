import Card from '@/components/dashboard/Card';
import Icon from '@/components/ui/Icon';

export type LatestResearchItem = {
    id: number;
    title: string;
    category: string;
    asset_code: string | null;
    published_at: string | null;
    source_type: string;
};

type Props = {
    latestResearch: LatestResearchItem[];
};

const CATEGORY_ICONS: Record<string, string> = {
    stock: 'query_stats',
    fund: 'shopping_bag',
    bond: 'payments',
    macro: 'public',
    sector: 'layers',
    theme: 'lightbulb',
    economic_outlook: 'analytics',
};

export default function LatestResearchCard({ latestResearch }: Props) {
    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-dashboard-outline-variant/20 px-6 py-4 dark:border-white/10">
                <h4 className="font-headline text-headline-md font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                    Research Terbaru
                </h4>
                <a
                    href="/research"
                    className="text-sm font-semibold text-dashboard-primary hover:underline"
                >
                    Lihat semua →
                </a>
            </div>
            {latestResearch.length === 0 ? (
                <p className="px-6 py-8 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    Belum ada research. Buka halaman saham, obligasi, atau reksa
                    dana lalu klik "AI Analisis".
                </p>
            ) : (
                <div className="divide-y divide-dashboard-outline-variant/10 dark:divide-white/5">
                    {latestResearch.map((r) => (
                        <a
                            key={r.id}
                            href={`/research/${r.id}`}
                            className="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-dashboard-surface-container-low dark:hover:bg-white/5"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dashboard-primary/10">
                                <Icon
                                    name={
                                        CATEGORY_ICONS[r.category] ||
                                        'description'
                                    }
                                    className="text-dashboard-primary"
                                    size="text-sm"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    {r.title}
                                </p>
                                <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    {r.asset_code ?? '—'} ·{' '}
                                    {r.source_type === 'ai'
                                        ? 'AI'
                                        : 'Rule-based'}
                                    {r.published_at
                                        ? ` · ${new Date(r.published_at).toLocaleDateString()}`
                                        : ''}
                                </p>
                            </div>
                            <Icon
                                name="chevron_right"
                                size="text-sm"
                                className="shrink-0 text-dashboard-on-surface-variant dark:text-dashboard-surface-variant"
                            />
                        </a>
                    ))}
                </div>
            )}
        </Card>
    );
}
