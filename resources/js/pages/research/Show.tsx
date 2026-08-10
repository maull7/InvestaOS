import { Link } from '@inertiajs/react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import type {
    Research,
    ResearchContent,
    ResearchSource,
} from '@/types/research';

type Props = {
    research: Research & {
        created_by_user?: { id: number; name: string };
        sources?: ResearchSource[];
        parent?: Research;
        versions?: Research[];
    };
    assetUrl?: string | null;
};

const META_KEYS = [
    'recommendation',
    'outlook',
    'valuation_assessment',
    'risk_level',
    'confidence',
    'status',
    'error',
];

const SECTION_LABELS: Record<string, string> = {
    executive_summary: 'Executive Summary',
    fundamental_analysis: 'Fundamental Analysis',
    technical_analysis: 'Technical Analysis',
    valuation: 'Valuation',
    risk_analysis: 'Risk Analysis',
    yield_assessment: 'Yield Assessment',
    credit_risk: 'Credit Risk',
    interest_rate_risk: 'Interest Rate Risk',
    fund_profile: 'Fund Profile',
    risk_assessment: 'Risk Assessment',
    manager_assessment: 'Manager Assessment',
    conclusion: 'Conclusion',
};

const SECTION_ICONS: Record<string, string> = {
    executive_summary: 'summarize',
    fundamental_analysis: 'analytics',
    technical_analysis: 'show_chart',
    valuation: 'paid',
    risk_analysis: 'warning',
    yield_assessment: 'percent',
    credit_risk: 'shield',
    interest_rate_risk: 'trending_up',
    fund_profile: 'account_balance',
    risk_assessment: 'warning',
    manager_assessment: 'group',
    conclusion: 'fact_check',
};

export default function Show({ research, assetUrl }: Props) {
    const content = research.content as ResearchContent;

    const sections = Object.entries(content).filter(
        ([key]) => !META_KEYS.includes(key),
    );

    const getRecommendationColor = (rec: string) => {
        const colors: Record<string, string> = {
            buy: 'bg-green-100 text-green-700',
            hold: 'bg-yellow-100 text-yellow-700',
            sell: 'bg-red-100 text-red-700',
        };

        return colors[rec] || colors.hold;
    };

    const getRiskColor = (risk: string) => {
        const colors: Record<string, string> = {
            low: 'bg-emerald-100 text-emerald-700',
            medium: 'bg-amber-100 text-amber-700',
            high: 'bg-red-100 text-red-700',
        };

        return colors[risk] || colors.medium;
    };

    const getOutlookIcon = (outlook: string) => {
        const icons: Record<string, string> = {
            bullish: 'trending_up',
            neutral: 'trending_flat',
            bearish: 'trending_down',
        };

        return icons[outlook] || 'trending_flat';
    };

    return (
        <DashboardLayout>
            <div className="col-span-full">
                <div className="mb-6">
                    <Link
                        href="/research"
                        className="mb-4 inline-flex items-center gap-2 text-sm text-dashboard-primary hover:underline"
                    >
                        <Icon name="arrow_back" size="text-sm" />
                        Back to Research Center
                    </Link>
                    <h1 className="font-headline text-headline-lg font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                        {research.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                        {research.asset_code && (
                            <span className="flex items-center gap-1">
                                <Icon name="label" size="text-sm" />
                                {research.asset_code}
                            </span>
                        )}
                        {assetUrl && (
                            <a
                                href={assetUrl}
                                className="inline-flex items-center gap-1 rounded-full bg-dashboard-surface-container-low px-3 py-1 text-xs font-semibold text-dashboard-primary hover:bg-dashboard-surface-container-high dark:bg-white/5"
                            >
                                Lihat halaman aset
                                <Icon name="open_in_new" size="text-xs" />
                            </a>
                        )}
                        {research.created_by_user && (
                            <span className="flex items-center gap-1">
                                <Icon name="person" size="text-sm" />
                                {research.created_by_user.name}
                            </span>
                        )}
                        {research.published_at && (
                            <span className="flex items-center gap-1">
                                <Icon name="schedule" size="text-sm" />
                                {new Date(
                                    research.published_at,
                                ).toLocaleDateString()}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Icon name="history" size="text-sm" />
                            Version {research.version}
                        </span>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="mb-6">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div>
                                    <p className="mb-1 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        Recommendation
                                    </p>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold uppercase ${getRecommendationColor(content.recommendation)}`}
                                    >
                                        {content.recommendation}
                                    </span>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        Outlook
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Icon
                                            name={getOutlookIcon(
                                                content.outlook,
                                            )}
                                            className="text-dashboard-primary"
                                        />
                                        <span className="text-sm font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                            {content.outlook}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        Valuation
                                    </p>
                                    <span className="text-sm font-semibold text-dashboard-on-surface capitalize dark:text-dashboard-inverse-on-surface">
                                        {content.valuation_assessment}
                                    </span>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        Risk Level
                                    </p>
                                    <span
                                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getRiskColor(content.risk_level)}`}
                                    >
                                        {content.risk_level}
                                    </span>
                                </div>
                            </div>

                            {typeof content.confidence === 'number' && (
                                <div className="mt-6 rounded-lg bg-dashboard-surface-container p-4 dark:bg-white/5">
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                            Confidence Score
                                        </span>
                                        <span className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                            {content.confidence}%
                                        </span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-dashboard-surface dark:bg-dashboard-inverse-surface">
                                        <div
                                            className="h-full bg-dashboard-primary"
                                            style={{
                                                width: `${content.confidence}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Card>

                        <div className="space-y-6">
                            {sections.map(([key, value]) => (
                                <Card key={key}>
                                    <h2 className="mb-3 flex items-center gap-2 font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                        <Icon
                                            name={
                                                SECTION_ICONS[key] ||
                                                'description'
                                            }
                                        />
                                        {SECTION_LABELS[key] ||
                                            key
                                                .replace(/_/g, ' ')
                                                .replace(/\b\w/g, (l) =>
                                                    l.toUpperCase(),
                                                )}
                                    </h2>
                                    <p className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                        {value}
                                    </p>
                                </Card>
                            ))}
                            {sections.length === 0 && (
                                <Card className="py-8 text-center text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                    No analysis content available.
                                </Card>
                            )}
                        </div>
                    </div>

                    <div>
                        {research.sources && research.sources.length > 0 && (
                            <Card className="mb-6">
                                <h2 className="mb-4 flex items-center gap-2 font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    <Icon name="source" />
                                    Sources & Citations
                                </h2>
                                <div className="space-y-4">
                                    {research.sources.map((source) => (
                                        <div
                                            key={source.id}
                                            className="border-l-2 border-dashboard-primary pl-3 text-sm"
                                        >
                                            <p className="mb-1 font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                {source.claim_key
                                                    .replace(/_/g, ' ')
                                                    .replace(/\b\w/g, (l) =>
                                                        l.toUpperCase(),
                                                    )}
                                            </p>
                                            <p className="mb-1 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                {source.source}
                                            </p>
                                            {source.period && (
                                                <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    Period: {source.period}
                                                </p>
                                            )}
                                            {source.as_of && (
                                                <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    As of:{' '}
                                                    {new Date(
                                                        source.as_of,
                                                    ).toLocaleString()}
                                                </p>
                                            )}
                                            {source.url && (
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-1 inline-flex items-center gap-1 text-xs text-dashboard-primary hover:underline"
                                                >
                                                    View source
                                                    <Icon
                                                        name="open_in_new"
                                                        size="text-xs"
                                                    />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {research.versions && research.versions.length > 0 && (
                            <Card>
                                <h2 className="mb-4 flex items-center gap-2 font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                    <Icon name="history" />
                                    Version History
                                </h2>
                                <div className="space-y-3">
                                    {research.versions.map((version) => (
                                        <Link
                                            key={version.id}
                                            href={`/research/${version.id}`}
                                            className="block rounded-lg bg-dashboard-surface-container p-3 transition-all hover:bg-dashboard-surface-container-high dark:bg-white/5 dark:hover:bg-white/10"
                                        >
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-sm font-medium text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                    Version {version.version}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs ${version.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                                                >
                                                    {version.status}
                                                </span>
                                            </div>
                                            {version.published_at && (
                                                <p className="text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    {new Date(
                                                        version.published_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
