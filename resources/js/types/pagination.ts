export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

export type PaginatedData<T> = Paginated<T>;
