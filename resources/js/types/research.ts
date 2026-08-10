export type ResearchCategory =
    | 'stock'
    | 'fund'
    | 'bond'
    | 'macro'
    | 'sector'
    | 'theme'
    | 'economic_outlook';

export type ResearchStatus =
    'draft' | 'processing' | 'completed' | 'published' | 'archived';

export type Research = {
    id: number;
    category: ResearchCategory;
    asset_type: string | null;
    asset_id: number | null;
    asset_code: string | null;
    title: string;
    slug: string;
    summary: string | null;
    content: ResearchContent;
    status: ResearchStatus;
    source_type: string;
    model: string | null;
    confidence: number | null;
    created_by: number | null;
    parent_id: number | null;
    version: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    created_by_user?: {
        id: number;
        name: string;
    };
    sources?: ResearchSource[];
    parent?: Research;
    versions?: Research[];
};

export type ResearchContent = {
    [section: string]:
        | string
        | 'buy'
        | 'hold'
        | 'sell'
        | 'bullish'
        | 'neutral'
        | 'bearish'
        | 'undervalued'
        | 'fair'
        | 'overvalued'
        | 'premium'
        | 'discount'
        | 'low'
        | 'medium'
        | 'high'
        | number;
    recommendation: 'buy' | 'hold' | 'sell';
    outlook: 'bullish' | 'neutral' | 'bearish';
    valuation_assessment:
        'undervalued' | 'fair' | 'overvalued' | 'premium' | 'discount';
    risk_level: 'low' | 'medium' | 'high';
    confidence: number;
    executive_summary: string;
};

export type ResearchContentSection = { key: string; text: string };

export type ResearchSource = {
    id: number;
    research_id: number;
    claim_key: string;
    data: Record<string, unknown>;
    source: string;
    period: string | null;
    url: string | null;
    as_of: string | null;
    created_at: string;
    updated_at: string;
};

export type ResearchFilters = {
    q: string;
    category: string;
    status: string;
};

export type CategoryOption = {
    value: string;
    label: string;
};

export type StatusOption = {
    value: string;
    label: string;
};
