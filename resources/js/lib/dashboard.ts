export type NavItem = {
    icon: string;
    label: string;
    href: string;
    active?: boolean;
};

export type NavSection = {
    label: string | null;
    items: NavItem[];
};

export const investorNavSections: NavSection[] = [
    {
        label: null,
        items: [
            { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
            {
                icon: 'lightbulb',
                label: 'Investment Planning',
                href: '/planning',
            },
            { icon: 'file', label: 'Investment Policy', href: '/policy' },
            { icon: 'query_stats', label: 'Stocks', href: '/stocks' },
            { icon: 'payments', label: 'Bonds', href: '/bonds' },
            {
                icon: 'group',
                label: 'Manajer Investasi',
                href: '/investment-managers',
            },
            { icon: 'shopping_bag', label: 'Reksa Dana', href: '/reksa-dana' },
            { icon: 'person', label: 'Profile Settings', href: '/profile' },
        ],
    },
];

export const adminNavSections: NavSection[] = [
    {
        label: 'Menu',
        items: [{ icon: 'dashboard', label: 'Dashboard', href: '/dashboard' }],
    },
    {
        label: 'Management',
        items: [
            {
                icon: 'help',
                label: 'Investment Questions',
                href: '/admin/questions',
            },
            {
                icon: 'query_stats',
                label: 'Risk Profiles',
                href: '/admin/risk-profiles',
            },
            {
                icon: 'layers',
                label: 'Suitability',
                href: '/admin/suitability',
            },
            {
                icon: 'lightbulb',
                label: 'Goal Rules',
                href: '/admin/goal-rules',
            },
        ],
    },
    {
        label: 'Data Master',
        items: [
            {
                icon: 'query_stats',
                label: 'Master Stocks',
                href: '/admin/stocks',
            },
            { icon: 'payments', label: 'Master Bonds', href: '/admin/bonds' },
            {
                icon: 'group',
                label: 'Investment Manager',
                href: '/admin/investment-managers',
            },
            {
                icon: 'shopping_bag',
                label: 'Master Mutual Funds',
                href: '/admin/mutual-funds',
            },
        ],
    },
];

export type StatItem = {
    id: string;
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
};

export const statItems: StatItem[] = [
    {
        id: 'revenue',
        label: 'Total Revenue',
        value: '$47,163.87',
        change: '+6.8%',
        trend: 'up',
        icon: 'account_balance_wallet',
    },
    {
        id: 'users',
        label: 'Total Users',
        value: '1,248',
        change: '+12.4%',
        trend: 'up',
        icon: 'group',
    },
    {
        id: 'transactions',
        label: 'Transactions',
        value: '3,842',
        change: '+8.2%',
        trend: 'up',
        icon: 'query_stats',
    },
    {
        id: 'investments',
        label: 'Active Investments',
        value: '214',
        change: '-2.1%',
        trend: 'down',
        icon: 'shopping_bag',
    },
];

export type TransactionStatus = 'Success' | 'Pending' | 'Failed';

export type TransactionRow = {
    id: string;
    user: string;
    type: 'Deposit' | 'Withdrawal' | 'Investment';
    amount: string;
    status: TransactionStatus;
    date: string;
};

export const recentTransactions: TransactionRow[] = [
    {
        id: 'tx1',
        user: 'Ahmad Fauzi',
        type: 'Deposit',
        amount: '+$2,400.00',
        status: 'Success',
        date: '04 Aug 2026',
    },
    {
        id: 'tx2',
        user: 'Siti Rahma',
        type: 'Investment',
        amount: '-$850.00',
        status: 'Success',
        date: '04 Aug 2026',
    },
    {
        id: 'tx3',
        user: 'Budi Santoso',
        type: 'Withdrawal',
        amount: '-$320.50',
        status: 'Pending',
        date: '03 Aug 2026',
    },
    {
        id: 'tx4',
        user: 'Dewi Lestari',
        type: 'Deposit',
        amount: '+$1,150.00',
        status: 'Success',
        date: '03 Aug 2026',
    },
    {
        id: 'tx5',
        user: 'Rizky Pratama',
        type: 'Investment',
        amount: '-$2,000.00',
        status: 'Failed',
        date: '02 Aug 2026',
    },
    {
        id: 'tx6',
        user: 'Maya Anggraini',
        type: 'Withdrawal',
        amount: '-$75.00',
        status: 'Success',
        date: '02 Aug 2026',
    },
];

export type Candle = {
    height: string;
    tone: 'primary' | 'secondary';
};

export const candles: Candle[] = [
    { height: '20%', tone: 'primary' },
    { height: '35%', tone: 'primary' },
    { height: '50%', tone: 'primary' },
    { height: '65%', tone: 'primary' },
    { height: '40%', tone: 'secondary' },
    { height: '70%', tone: 'primary' },
    { height: '85%', tone: 'primary' },
    { height: '60%', tone: 'secondary' },
    { height: '45%', tone: 'secondary' },
    { height: '55%', tone: 'primary' },
];

export const timeframes = ['1H', '24H', '7D', '1M', '1Y'] as const;

export const chartLabels = ['75,000', '50,000', '25,000', '0'];
export const xLabels = ['Th', 'Fr', 'Sa', 'Su', 'Today'];
