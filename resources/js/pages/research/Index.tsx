import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { PaginatedData } from '@/types/pagination';
import type {
    Research,
    ResearchFilters,
    CategoryOption,
    StatusOption,
} from '@/types/research';

type Props = {
    researches: PaginatedData<
        Research & { created_by_user?: { id: number; name: string } }
    >;
    filters: ResearchFilters;
    categories: CategoryOption[];
    statuses: StatusOption[];
};

export default function Index({
    researches,
    filters,
    categories,
    statuses,
}: Props) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.q);

    const handleFilter = (key: keyof ResearchFilters, value: string) => {
        router.get(
            '/research',
            { ...filters, [key]: value },
            { preserveState: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilter('q', search);
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-700',
            processing: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            published: 'bg-emerald-100 text-emerald-700',
            archived: 'bg-gray-200 text-gray-500',
        };

        return colors[status] || colors.draft;
    };

    const getCategoryIcon = (category: string) => {
        const icons: Record<string, string> = {
            stock: 'query_stats',
            fund: 'shopping_bag',
            bond: 'payments',
            macro: 'public',
            sector: 'layers',
            theme: 'lightbulb',
            economic_outlook: 'analytics',
        };

        return icons[category] || 'description';
    };

    return (
        <DashboardLayout>
            <div className="col-span-full">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="font-headline text-headline-lg font-bold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                            Research Center
                        </h1>
                        <p className="mt-1 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                            AI-powered investment analysis and research reports
                        </p>
                    </div>
                    {auth.role === 'admin' && (
                        <Link href="/research/create">
                            <Button>
                                <Icon name="add" size="text-sm" />
                                Generate Research
                            </Button>
                        </Link>
                    )}
                </div>

                <Card className="mb-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                label=""
                                name="search"
                                type="text"
                                placeholder="Search by title, asset code, or summary..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select
                            name="category"
                            options={categories}
                            value={filters.category}
                            onChange={(e) =>
                                handleFilter('category', e.target.value)
                            }
                        />
                        <Select
                            name="status"
                            options={statuses}
                            value={filters.status}
                            onChange={(e) =>
                                handleFilter('status', e.target.value)
                            }
                        />
                        <Button type="submit">
                            <Icon name="search" size="text-sm" />
                        </Button>
                    </form>
                </Card>

                <div className="space-y-4">
                    {researches.data.length === 0 ? (
                        <Card className="py-12 text-center">
                            <Icon
                                name="description"
                                size="text-4xl"
                                className="mx-auto mb-4 text-dashboard-on-surface-variant"
                            />
                            <p className="text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                No research reports found.{' '}
                                {auth.role === 'admin' &&
                                    'Generate your first analysis.'}
                            </p>
                        </Card>
                    ) : (
                        researches.data.map(
                            (
                                research: Research & {
                                    created_by_user?: {
                                        id: number;
                                        name: string;
                                    };
                                },
                            ) => (
                                <Link
                                    key={research.id}
                                    href={`/research/${research.id}`}
                                >
                                    <Card className="transition-all hover:shadow-lg">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dashboard-primary/10">
                                                <Icon
                                                    name={getCategoryIcon(
                                                        research.category,
                                                    )}
                                                    className="text-dashboard-primary"
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex items-start justify-between gap-4">
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">
                                                            {research.title}
                                                        </h3>
                                                        {research.summary && (
                                                            <p className="mt-1 line-clamp-2 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                                {
                                                                    research.summary
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(research.status)}`}
                                                    >
                                                        {research.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                                    {research.asset_code && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                name="label"
                                                                size="text-xs"
                                                            />
                                                            {
                                                                research.asset_code
                                                            }
                                                        </span>
                                                    )}
                                                    {research.created_by_user && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                name="person"
                                                                size="text-xs"
                                                            />
                                                            {
                                                                research
                                                                    .created_by_user
                                                                    .name
                                                            }
                                                        </span>
                                                    )}
                                                    {research.published_at && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                name="schedule"
                                                                size="text-xs"
                                                            />
                                                            {new Date(
                                                                research.published_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {research.version > 1 && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                name="history"
                                                                size="text-xs"
                                                            />
                                                            v{research.version}
                                                        </span>
                                                    )}
                                                    {research.confidence && (
                                                        <span className="flex items-center gap-1">
                                                            <Icon
                                                                name="verified"
                                                                size="text-xs"
                                                            />
                                                            {
                                                                research.confidence
                                                            }
                                                            % confidence
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ),
                        )
                    )}
                </div>

                {researches.links && researches.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {researches.links.map(
                            (
                                link: {
                                    url: string | null;
                                    label: string;
                                    active: boolean;
                                },
                                idx: number,
                            ) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`rounded-lg px-4 py-2 text-sm ${
                                        link.active
                                            ? 'bg-dashboard-primary font-semibold text-dashboard-on-primary'
                                            : 'bg-dashboard-surface text-dashboard-on-surface hover:bg-dashboard-surface-container dark:bg-dashboard-inverse-surface dark:text-dashboard-inverse-on-surface'
                                    } ${!link.url && 'pointer-events-none opacity-50'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
