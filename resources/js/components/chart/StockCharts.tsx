import {
    CandlestickSeries,
    ColorType,
    LineSeries,
    createChart,
} from 'lightweight-charts';
import type { UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';

import { indicators } from '@/lib/indicators';
import type { Bar } from '@/lib/indicators';
import { cn } from '@/lib/utils';

const COLORS = {
    candleUp: '#22c55e',
    candleDown: '#ef4444',
    ma20: '#3b82f6',
    ma50: '#f97316',
    ema20: '#a855f7',
    boll: '#94a3b8',
    vwap: '#06b6d4',
    rsi: '#8b5cf6',
    macd: '#3b82f6',
    macdSignal: '#f97316',
    stoch: '#14b8a6',
    atr: '#eab308',
};

type OverlayState = { ma: boolean; ema: boolean; boll: boolean; vwap: boolean };
type OscState = { rsi: boolean; macd: boolean; stoch: boolean; atr: boolean };

const OVERLAY_CHIPS: { key: keyof OverlayState; label: string }[] = [
    { key: 'ma', label: 'MA' },
    { key: 'ema', label: 'EMA' },
    { key: 'boll', label: 'BB' },
    { key: 'vwap', label: 'VWAP' },
];

const OSC_CHIPS: { key: keyof OscState; label: string }[] = [
    { key: 'rsi', label: 'RSI' },
    { key: 'macd', label: 'MACD' },
    { key: 'stoch', label: 'Stoch' },
    { key: 'atr', label: 'ATR' },
];

function toPoints(
    bars: Bar[],
    values: (number | null)[],
): { time: UTCTimestamp; value: number }[] {
    const out: { time: UTCTimestamp; value: number }[] = [];

    for (let i = 0; i < bars.length; i++) {
        const v = values[i];

        if (v !== null) {
            out.push({ time: bars[i].t as UTCTimestamp, value: v });
        }
    }

    return out;
}

function chartOptions(height: number) {
    return {
        layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#94a3b8',
            fontFamily: 'inherit',
        },
        grid: {
            vertLines: { color: 'rgba(128,128,128,0.08)' },
            horzLines: { color: 'rgba(128,128,128,0.08)' },
        },
        rightPriceScale: { borderVisible: false },
        timeScale: {
            borderVisible: false,
            timeVisible: true,
            rightOffset: 2,
            tickMarkFormatter: (t: UTCTimestamp) =>
                new Date((t as number) * 1000).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                }),
        },
        crosshair: { mode: 0 },
        autoSize: true,
        height,
    };
}

function candleOptions() {
    return {
        upColor: COLORS.candleUp,
        downColor: COLORS.candleDown,
        borderUpColor: COLORS.candleUp,
        borderDownColor: COLORS.candleDown,
        wickUpColor: COLORS.candleUp,
        wickDownColor: COLORS.candleDown,
    };
}

function Chip({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                active
                    ? 'bg-landing-primary text-landing-on-primary'
                    : 'bg-dashboard-surface-container-low text-dashboard-on-surface-variant hover:bg-dashboard-surface-container-high dark:bg-white/5 dark:text-dashboard-surface-variant',
            )}
        >
            {children}
        </button>
    );
}

type MainProps = {
    bars: Bar[];
    type: 'candle' | 'line';
    overlays: OverlayState;
    ind: ReturnType<typeof indicators>;
};

function MainChart({ bars, type, overlays, ind }: MainProps) {
    const ref = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
    const topRef = useRef<unknown>(null);
    const overlaysRef = useRef<unknown[]>([]);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const chart = createChart(ref.current, chartOptions(340));
        chartRef.current = chart;

        return () => {
            chart.remove();
            chartRef.current = null;
            overlaysRef.current = [];
            topRef.current = null;
        };
    }, []);

    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) {
            return;
        }

        if (topRef.current) {
            chart.removeSeries(topRef.current as never);
        }

        const isCandle = type === 'candle';
        const s = isCandle
            ? chart.addSeries(CandlestickSeries, candleOptions())
            : chart.addSeries(LineSeries, { color: COLORS.ma20 });

        if (isCandle) {
            s.setData(
                bars.map((b) => ({
                    time: b.t as UTCTimestamp,
                    open: b.o,
                    high: b.h,
                    low: b.l,
                    close: b.c,
                })),
            );
        } else {
            s.setData(
                bars.map((b) => ({ time: b.t as UTCTimestamp, value: b.c })),
            );
        }

        topRef.current = s;
        chart.timeScale().fitContent();
    }, [type, bars]);

    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) {
            return;
        }

        overlaysRef.current.forEach((s) => chart.removeSeries(s as never));
        overlaysRef.current = [];

        const specs: {
            value: (number | null)[];
            color: string;
            width: number;
        }[] = [];

        if (overlays.ma) {
            specs.push({ value: ind.ma20, color: COLORS.ma20, width: 2 });
            specs.push({ value: ind.ma50, color: COLORS.ma50, width: 2 });
        }

        if (overlays.ema) {
            specs.push({ value: ind.ema20, color: COLORS.ema20, width: 2 });
        }

        if (overlays.vwap) {
            specs.push({ value: ind.vwap, color: COLORS.vwap, width: 2 });
        }

        if (overlays.boll) {
            specs.push({ value: ind.bollUpper, color: COLORS.boll, width: 1 });
            specs.push({ value: ind.bollBasis, color: COLORS.boll, width: 1 });
            specs.push({ value: ind.bollLower, color: COLORS.boll, width: 1 });
        }

        specs.forEach(({ value, color, width }) => {
            const s = chart.addSeries(LineSeries, {
                color,
                lineWidth: width as 1 | 2 | 3 | 4,
                priceLineVisible: false,
                lastValueVisible: false,
            });
            s.setData(toPoints(bars, value));
            overlaysRef.current.push(s);
        });
    }, [type, overlays, bars, ind]);

    return <div ref={ref} className="w-full" />;
}

function OscChart({
    label,
    color,
    data,
}: {
    label: string;
    color: string;
    data: { time: UTCTimestamp; value: number }[];
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const chart = createChart(ref.current, chartOptions(110));
        const s = chart.addSeries(LineSeries, {
            color,
            lineWidth: 2,
            priceLineVisible: false,
        });
        s.setData(data);
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [data, color]);

    return (
        <div className="rounded-xl bg-dashboard-surface-container-low/40 p-2 dark:bg-white/5">
            <p className="mb-1 px-2 font-mono text-[11px] font-semibold tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                {label}
            </p>
            <div ref={ref} className="w-full" />
        </div>
    );
}

function MacdChart({
    bars,
    ind,
}: {
    bars: Bar[];
    ind: ReturnType<typeof indicators>;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return;
        }

        const chart = createChart(ref.current, chartOptions(110));
        const macd = chart.addSeries(LineSeries, {
            color: COLORS.macd,
            lineWidth: 2,
            priceLineVisible: false,
        });
        const signal = chart.addSeries(LineSeries, {
            color: COLORS.macdSignal,
            lineWidth: 1,
            priceLineVisible: false,
        });
        macd.setData(toPoints(bars, ind.macd));
        signal.setData(toPoints(bars, ind.macdSignal));
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [bars, ind]);

    return (
        <div className="rounded-xl border border-dashboard-outline-variant/10 bg-dashboard-surface-container-low/40 p-2 dark:border-white/5 dark:bg-white/5">
            <p className="mb-1 px-2 font-mono text-[11px] font-semibold tracking-wider text-dashboard-on-surface-variant uppercase dark:text-dashboard-surface-variant">
                MACD
            </p>
            <div ref={ref} className="w-full" />
        </div>
    );
}

export default function StockCharts({ bars }: { bars: Bar[] }) {
    const [type, setType] = useState<'candle' | 'line'>('candle');
    const [overlays, setOverlays] = useState<OverlayState>({
        ma: true,
        ema: false,
        boll: false,
        vwap: false,
    });
    const [oscState, setOscState] = useState<OscState>({
        rsi: true,
        macd: false,
        stoch: false,
        atr: false,
    });

    const ind = indicators(bars);

    if (bars.length < 2) {
        return (
            <div className="flex h-56 items-center justify-center text-sm text-dashboard-on-surface-variant dark:text-dashboard-surface-variant">
                Data grafik belum cukup untuk rentang ini.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Chip
                    active={type === 'candle'}
                    onClick={() => setType('candle')}
                >
                    Candlestick
                </Chip>
                <Chip active={type === 'line'} onClick={() => setType('line')}>
                    Line
                </Chip>
                <span className="mx-1 h-4 w-px bg-dashboard-outline-variant/30 dark:bg-white/10" />
                {OVERLAY_CHIPS.map((c) => (
                    <Chip
                        key={c.key}
                        active={overlays[c.key]}
                        onClick={() =>
                            setOverlays((p) => ({ ...p, [c.key]: !p[c.key] }))
                        }
                    >
                        {c.label}
                    </Chip>
                ))}
                <span className="mx-1 h-4 w-px bg-dashboard-outline-variant/30 dark:bg-white/10" />
                {OSC_CHIPS.map((c) => (
                    <Chip
                        key={c.key}
                        active={oscState[c.key]}
                        onClick={() =>
                            setOscState((p) => ({ ...p, [c.key]: !p[c.key] }))
                        }
                    >
                        {c.label}
                    </Chip>
                ))}
            </div>

            <MainChart bars={bars} type={type} overlays={overlays} ind={ind} />

            <div className="space-y-3">
                {oscState.rsi && (
                    <OscChart
                        label="RSI (14)"
                        color={COLORS.rsi}
                        data={toPoints(bars, ind.rsi)}
                    />
                )}
                {oscState.macd && <MacdChart bars={bars} ind={ind} />}
                {oscState.stoch && (
                    <OscChart
                        label="Stochastic (14,3)"
                        color={COLORS.stoch}
                        data={toPoints(bars, ind.stochSignal)}
                    />
                )}
                {oscState.atr && (
                    <OscChart
                        label="ATR (14)"
                        color={COLORS.atr}
                        data={toPoints(bars, ind.atr)}
                    />
                )}
            </div>
        </div>
    );
}
