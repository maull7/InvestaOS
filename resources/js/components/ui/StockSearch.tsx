import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

type StockHit = { code: string; name: string; listing_board: string | null };

type StockSearchProps = {
    onSelect: (code: string) => void;
    exclude?: string[];
    placeholder?: string;
    disabled?: boolean;
};

export default function StockSearch({ onSelect, exclude = [], placeholder = 'Cari kode atau nama saham…', disabled }: StockSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<StockHit[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        const q = query.trim();
        if (q === '') {
            setResults([]);
            return;
        }

        timer.current = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/stocks/search?q=${encodeURIComponent(q)}`);
                const list: StockHit[] = (await res.json()) ?? [];
                setResults(list.filter((h) => !exclude.includes(h.code)));
                setOpen(true);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300); // debounce

        return () => {
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    }, [query, exclude]);

    return (
        <div className="relative">
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full rounded-xl border border-dashboard-outline-variant/40 bg-dashboard-surface px-4 py-2.5 font-body text-body-md text-dashboard-on-surface placeholder:text-dashboard-on-surface-variant/50 focus:border-dashboard-primary focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-dashboard-inverse-on-surface"
            />
            {open && (
                <div className="absolute top-full left-0 z-30 mt-1 w-full overflow-hidden rounded-xl border border-dashboard-outline-variant/20 bg-dashboard-surface-container-lowest shadow-lg dark:border-white/10 dark:bg-dashboard-inverse-surface">
                    {loading && <p className="px-4 py-3 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">Mencari…</p>}
                    {!loading && results.length === 0 && query.trim() !== '' && (
                        <p className="px-4 py-3 text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">Tidak ditemukan.</p>
                    )}
                    {results.map((h) => (
                        <button
                            key={h.code}
                            type="button"
                            onClick={() => {
                                onSelect(h.code);
                                setQuery('');
                                setResults([]);
                                setOpen(false);
                            }}
                            className="flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-dashboard-surface-container-high dark:hover:bg-white/10"
                        >
                            <span className="font-semibold text-dashboard-on-surface dark:text-dashboard-inverse-on-surface">{h.code}</span>
                            <span className="flex items-center gap-2 text-xs text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                                <span className={cn('max-w-[180px] truncate')}>{h.name}</span>
                                {h.listing_board && <span className="rounded-full bg-dashboard-surface-variant px-1.5 py-0.5 text-[10px] capitalize dark:bg-white/10">{h.listing_board}</span>}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}