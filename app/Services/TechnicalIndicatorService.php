<?php

namespace App\Services;

class TechnicalIndicatorService
{
    public function sma(array $prices, int $period): array
    {
        $result = [];
        $count = count($prices);

        for ($i = $period - 1; $i < $count; $i++) {
            $slice = array_slice($prices, $i - $period + 1, $period);
            $result[] = array_sum($slice) / $period;
        }

        return $result;
    }

    public function ema(array $prices, int $period): array
    {
        if (count($prices) < $period) {
            return [];
        }

        $multiplier = 2 / ($period + 1);
        $result = [];
        $smaSlice = array_slice($prices, 0, $period);
        $ema = array_sum($smaSlice) / $period;
        $result[] = $ema;

        for ($i = $period; $i < count($prices); $i++) {
            $ema = ($prices[$i] - $ema) * $multiplier + $ema;
            $result[] = $ema;
        }

        return $result;
    }

    public function rsi(array $prices, int $period = 14): ?float
    {
        if (count($prices) < $period + 1) {
            return null;
        }

        $gains = [];
        $losses = [];

        for ($i = 1; $i < count($prices); $i++) {
            $change = $prices[$i] - $prices[$i - 1];
            $gains[] = $change > 0 ? $change : 0;
            $losses[] = $change < 0 ? abs($change) : 0;
        }

        $avgGain = array_sum(array_slice($gains, -$period)) / $period;
        $avgLoss = array_sum(array_slice($losses, -$period)) / $period;

        if ($avgLoss == 0) {
            return 100;
        }

        $rs = $avgGain / $avgLoss;

        return 100 - (100 / (1 + $rs));
    }

    public function macd(array $prices): ?array
    {
        $ema12 = $this->ema($prices, 12);
        $ema26 = $this->ema($prices, 26);

        if (count($ema12) < 14 || count($ema26) < 1) {
            return null;
        }

        $macdLine = [];
        $offset = count($prices) - count($ema12);

        for ($i = 0; $i < count($ema12); $i++) {
            $idx26 = $i + $offset - (count($prices) - count($ema26));
            if ($idx26 >= 0 && $idx26 < count($ema26)) {
                $macdLine[] = $ema12[$i] - $ema26[$idx26];
            }
        }

        if (empty($macdLine)) {
            return null;
        }

        $signal = $this->ema($macdLine, 9);

        if (empty($signal)) {
            return null;
        }

        $histogram = [];
        $signalOffset = count($macdLine) - count($signal);

        foreach ($signal as $i => $val) {
            $histogram[] = $macdLine[$i + $signalOffset] - $val;
        }

        return [
            'macd' => end($macdLine),
            'signal' => end($signal),
            'histogram' => end($histogram),
        ];
    }

    public function supportResistance(array $history, int $period = 20): array
    {
        if (count($history) < $period) {
            return ['support' => null, 'resistance' => null];
        }

        $recent = array_slice($history, -$period);
        $lows = array_column($recent, 'l');
        $highs = array_column($recent, 'h');

        return [
            'support' => min($lows),
            'resistance' => max($highs),
        ];
    }

    public function trend(array $prices): ?string
    {
        if (count($prices) < 20) {
            return null;
        }

        $sma20 = $this->sma($prices, 20);
        $sma50 = count($prices) >= 50 ? $this->sma($prices, 50) : null;

        $currentPrice = end($prices);
        $current20 = end($sma20);

        if ($sma50 === null) {
            return $currentPrice > $current20 ? 'uptrend' : 'downtrend';
        }

        $current50 = end($sma50);

        if ($currentPrice > $current20 && $current20 > $current50) {
            return 'uptrend';
        }

        if ($currentPrice < $current20 && $current20 < $current50) {
            return 'downtrend';
        }

        return 'sideways';
    }

    public function analyze(array $history): array
    {
        $closes = array_column($history, 'c');
        $currentPrice = end($closes);

        $sma20 = $this->sma($closes, 20);
        $sma50 = count($closes) >= 50 ? $this->sma($closes, 50) : null;
        $ema12 = $this->ema($closes, 12);
        $rsi = $this->rsi($closes);
        $macd = $this->macd($closes);
        $sr = $this->supportResistance($history);
        $trend = $this->trend($closes);

        return [
            'price' => $currentPrice,
            'sma20' => $sma20 ? end($sma20) : null,
            'sma50' => $sma50 ? end($sma50) : null,
            'ema12' => $ema12 ? end($ema12) : null,
            'rsi' => $rsi,
            'macd' => $macd,
            'support' => $sr['support'],
            'resistance' => $sr['resistance'],
            'trend' => $trend,
        ];
    }
}
