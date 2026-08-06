import Icon from '@/components/ui/Icon';
import { candles, chartLabels, timeframes, xLabels } from '@/lib/dashboard';
import { cn } from '@/lib/utils';
import Card from './Card';

const candleTones = {
    primary: 'bg-dashboard-primary',
    secondary: 'bg-dashboard-secondary',
} as const;

export default function BalanceChart() {
    return (
        <Card className="p-4 md:p-6" variant="light-primary">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-end">
                <div>
                    <p className="font-body mb-1 text-label-sm tracking-wider text-dashboard-on-surface-variant uppercase">
                        Current Balance
                    </p>
                    <div className="flex items-end gap-2">
                        <span className="pb-1 text-xl font-medium text-dashboard-on-surface-variant">
                            $
                        </span>
                        <h2 className="font-headline text-3xl leading-none font-bold tracking-tight text-dashboard-on-surface md:text-display-lg">
                            47,163.87
                        </h2>
                        <div className="flex items-center pb-1 text-sm font-semibold text-dashboard-secondary">
                            <Icon name="arrow_drop_up" size="text-[16px]" />
                            6.8%
                        </div>
                    </div>
                </div>
                <div className="flex rounded-full border border-dashboard-outline-variant/20 bg-dashboard-surface-container-low p-1 dark:bg-white/10">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            type="button"
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                                tf === '7D'
                                    ? 'bg-dashboard-secondary-container text-dashboard-on-secondary-container shadow-sm'
                                    : 'text-dashboard-on-surface-variant hover:text-dashboard-on-surface dark:hover:text-dashboard-inverse-on-surface',
                            )}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative mt-6 h-[220px] border-b border-l border-dashboard-outline-variant/20 md:mt-8 md:h-[300px]">
                <div className="absolute top-0 bottom-0 -left-9 flex flex-col justify-between pb-6 text-[10px] text-dashboard-on-surface-variant dark:text-white">
                    {chartLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
                <div className="absolute inset-0 flex flex-col justify-between pb-6">
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-full border-b border-dashboard-outline-variant/10"
                        />
                    ))}
                </div>

                <div className="absolute inset-0 pr-2 pb-6 pl-2">
                    <div className="relative flex h-full w-full items-end justify-between px-2 pt-10">
                        {candles.map((candle, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'relative w-1.5',
                                    candle.height,
                                    candleTones[candle.tone],
                                )}
                            >
                                <div
                                    className={cn(
                                        'absolute top-1/2 left-1/2 w-px -translate-x-1/2',
                                        candleTones[candle.tone],
                                    )}
                                    style={{ height: '140%' }}
                                />
                            </div>
                        ))}
                        <svg
                            className="pointer-events-none absolute inset-0 h-full w-full pb-6"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                        >
                            <defs>
                                <linearGradient
                                    id="trend-gradient"
                                    x1="0"
                                    x2="0"
                                    y1="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor="#2563eb" />
                                    <stop
                                        offset="100%"
                                        stopColor="transparent"
                                    />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,80 L10,65 L20,50 L30,35 L40,60 L50,30 L60,15 L70,40 L80,55 L90,45 L100,50"
                                fill="none"
                                stroke="#2563eb"
                                strokeOpacity="0.5"
                                strokeWidth="0.5"
                            />
                            <path
                                d="M0,80 L10,65 L20,50 L30,35 L40,60 L50,30 L60,15 L70,40 L80,55 L90,45 L100,50 L100,100 L0,100 Z"
                                fill="url(#trend-gradient)"
                                opacity="0.1"
                            />
                        </svg>
                    </div>
                </div>

                <div className="absolute right-0 bottom-[-24px] left-0 flex justify-between border-t border-dashboard-outline-variant/20 px-2 pt-2 text-[10px] text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                    {xLabels.map((label) => (
                        <span key={label}>{label}</span>
                    ))}
                </div>
            </div>
        </Card>
    );
}
