export type Bar = {
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
};

function sma(values: number[], period: number): (number | null)[] {
    const out: (number | null)[] = Array(values.length).fill(null);
    let sum = 0;

    for (let i = 0; i < values.length; i++) {
        sum += values[i];

        if (i >= period) {
            sum -= values[i - period];
        }

        if (i >= period - 1) {
            out[i] = sum / period;
        }
    }

    return out;
}

function ema(values: number[], period: number): (number | null)[] {
    const out: (number | null)[] = Array(values.length).fill(null);
    const k = 2 / (period + 1);
    let prev = 0;
    let seeded = false;

    for (let i = 0; i < values.length; i++) {
        if (!seeded) {
            prev = values[i];
            seeded = true;
            out[i] = prev;
            continue;
        }

        prev = values[i] * k + prev * (1 - k);
        out[i] = prev;
    }

    return out;
}

export function indicators(bars: Bar[]) {
    const closes = bars.map((b) => b.c);
    const n = bars.length;

    const ma20 = sma(closes, 20);
    const ma50 = sma(closes, 50);
    const ema12 = ema(closes, 12);
    const ema26 = ema(closes, 26);
    const ema20 = ema(closes, 20);

    const macdLine: (number | null)[] = Array(n).fill(null);
    const macdSignal: (number | null)[] = Array(n).fill(null);

    for (let i = 0; i < n; i++) {
        if (ema12[i] !== null && ema26[i] !== null) {
            macdLine[i] = ema12[i]! - ema26[i]!;
        }
    }

    let signalPrev: number | null = null;

    for (let i = 0; i < n; i++) {
        if (macdLine[i] === null) {
            continue;
        }

        signalPrev =
            signalPrev === null
                ? macdLine[i]!
                : macdLine[i]! * (2 / 10) + signalPrev * (8 / 10);
        macdSignal[i] = signalPrev;
    }

    const macdHist = macdLine.map((v, i) =>
        v !== null && macdSignal[i] !== null ? v - macdSignal[i]! : null,
    );

    const bollBasis = sma(closes, 20);
    const bollUpper: (number | null)[] = Array(n).fill(null);
    const bollLower: (number | null)[] = Array(n).fill(null);

    for (let i = 19; i < n; i++) {
        let sumSq = 0;

        for (let j = i - 19; j <= i; j++) {
            sumSq += Math.pow(closes[j] - bollBasis[i]!, 2);
        }

        const sd = Math.sqrt(sumSq / 20);
        bollUpper[i] = bollBasis[i]! + 2 * sd;
        bollLower[i] = bollBasis[i]! - 2 * sd;
    }

    let cumTPV = 0;
    let cumV = 0;
    const vwap: (number | null)[] = Array(n).fill(null);

    for (let i = 0; i < n; i++) {
        const tp = (bars[i].h + bars[i].l + bars[i].c) / 3;
        cumV += bars[i].v;
        cumTPV += tp * bars[i].v;

        if (cumV > 0) {
            vwap[i] = cumTPV / cumV;
        }
    }

    const rsi: (number | null)[] = Array(n).fill(null);
    let avgGain = 0;
    let avgLoss = 0;

    for (let i = 1; i < n; i++) {
        const change = closes[i] - closes[i - 1];
        const gain = Math.max(change, 0);
        const loss = Math.max(-change, 0);
        avgGain += gain;
        avgLoss += loss;

        if (i === 14) {
            avgGain /= 14;
            avgLoss /= 14;
            rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
        } else if (i > 14) {
            avgGain = (avgGain * 13 + gain) / 14;
            avgLoss = (avgLoss * 13 + loss) / 14;
            rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
        }
    }

    const stochK: (number | null)[] = Array(n).fill(null);

    for (let i = 13; i < n; i++) {
        let hh = -Infinity;
        let ll = Infinity;

        for (let j = i - 13; j <= i; j++) {
            if (bars[j].h > hh) {
                hh = bars[j].h;
            }

            if (bars[j].l < ll) {
                ll = bars[j].l;
            }
        }

        stochK[i] = hh - ll === 0 ? 50 : ((bars[i].c - ll) / (hh - ll)) * 100;
    }

    const stochSignal: (number | null)[] = Array(n).fill(null);

    for (let i = 14; i < n; i++) {
        if (stochK[i] === null) {
            continue;
        }

        let s = 0;
        let c = 0;

        for (let j = i - 2; j <= i; j++) {
            if (stochK[j] !== null) {
                s += stochK[j]!;
                c++;
            }
        }

        if (c > 0) {
            stochSignal[i] = s / c;
        }
    }

    const atr: (number | null)[] = Array(n).fill(null);
    let atrPrev = bars.length > 0 ? bars[0].h - bars[0].l : 0;

    for (let i = 1; i < n; i++) {
        const tr = Math.max(
            bars[i].h - bars[i].l,
            Math.abs(bars[i].h - bars[i - 1].c),
            Math.abs(bars[i].l - bars[i - 1].c),
        );
        atrPrev =
            i < 14 ? (atrPrev * i + tr) / (i + 1) : (atrPrev * 13 + tr) / 14;
        atr[i] = atrPrev;
    }

    return {
        closes,
        ma20,
        ma50,
        ema20,
        macd: macdLine,
        macdSignal,
        macdHist,
        bollUpper,
        bollBasis,
        bollLower,
        vwap,
        rsi,
        stochK,
        stochSignal,
        atr,
    };
}

export const lastValid = (arr: (number | null)[]) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] !== null) {
            return arr[i];
        }
    }

    return null;
};
