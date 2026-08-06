export const FUND_TYPES = [
    'money_market',
    'fixed_income',
    'balanced',
    'equity',
    'protected',
    'index',
    'etf',
    'islamic_money_market',
    'islamic_fixed_income',
    'islamic_balanced',
    'islamic_equity',
] as const;

export const FUND_TYPE_LABELS: Record<string, string> = {
    money_market: 'Pasar Uang',
    fixed_income: 'Pendapatan Tetap',
    balanced: 'Campuran',
    equity: 'Saham',
    protected: 'Terproteksi',
    index: 'Indeks',
    etf: 'ETF',
    islamic_money_market: 'Pasar Uang Syariah',
    islamic_fixed_income: 'Pendapatan Tetap Syariah',
    islamic_balanced: 'Campuran Syariah',
    islamic_equity: 'Saham Syariah',
};

export function fundTypeLabel(type: string): string {
    return FUND_TYPE_LABELS[type] ?? type;
}

export const RISK_LABELS: Record<number, string> = {
    1: 'Sangat Rendah',
    2: 'Rendah',
    3: 'Sedang',
    4: 'Tinggi',
    5: 'Sangat Tinggi',
};

export function riskLabel(level: number | null): string {
    return level === null ? '—' : (RISK_LABELS[level] ?? String(level));
}

export function riskTone(level: number | null): string {
    if (level === null) {
        return '';
    }

    if (level <= 2) {
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400';
    }

    if (level === 3) {
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400';
    }

    return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
}

export function fmtLaunch(date: string | null): string {
    return date
        ? new Date(date).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
          })
        : '—';
}
