export const BOND_TYPES = [
    'government_bond',
    'corporate_bond',
    'sukuk',
] as const;
export const BOND_STATUS = ['active', 'inactive'] as const;

const LABELS: Record<string, string> = {
    government_bond: 'Obligasi Pemerintah',
    corporate_bond: 'Obligasi Korporasi',
    sukuk: 'Sukuk',
};

export function bondTypeLabel(type: string): string {
    return LABELS[type] ?? type;
}

export function freqLabel(freq: string): string {
    return freq === 'annual' ? 'Tahunan' : 'Semester';
}

export function fmtMoney(
    v: number | null | undefined,
    currency = 'IDR',
): string {
    if (v === null || v === undefined) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(v);
}

export function fmtPct(v: number | null | undefined, digits = 2): string {
    if (v === null || v === undefined) {
        return '—';
    }

    return `${v.toFixed(digits)}%`;
}

export function fmtYears(v: number | null | undefined): string {
    if (v === null || v === undefined) {
        return '—';
    }

    return `${v.toFixed(1)} thn`;
}

export type BondCalc = {
    yearsRemaining: number | null;
    couponPerYear: number | null;
    couponValuePerPayment: number | null;
    couponPerPayment: number | null;
    ytm: number | null;
    estimated: boolean;
    durationYears: number | null;
    accruedPct: number | null;
    cleanPrice: number | null;
    dirtyPrice: number | null;
    spread: number | null;
    paymentsPerYear: number;
};
