<?php

namespace App\Services;

use App\Models\Stock;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class StockMarketService
{
    public const RANGES = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y'];

    // ponytail: single-flight lock + negative cache (5m on failure) jika kena 429 massal
    public function chart(Stock $stock, string $range = '1y'): ?array
    {
        $range = in_array($range, self::RANGES, true) ? $range : '1y';

        return Cache::remember(
            "stock.chart.{$this->symbol($stock)}.{$range}",
            900,
            fn () => $this->fetch($stock, $range),
        );
    }

    public function quote(Stock $stock): ?array
    {
        return $this->chart($stock, '1d');
    }

    public function symbol(Stock $stock): string
    {
        return str_contains($stock->code, '.') ? $stock->code : $stock->code.'.JK';
    }

    private function fetch(Stock $stock, string $range): ?array
    {
        try {
            $response = Http::timeout(8)->get(
                "https://query1.finance.yahoo.com/v8/finance/chart/{$this->symbol($stock)}",
                [
                    'range' => $range,
                    'interval' => in_array($range, ['1d', '5d'], true) ? '1h' : '1d',
                ],
            );

            $result = $response->json('chart.result.0');

            if (! is_array($result) || ! is_array($result['meta'] ?? null)) {
                return null; // veto: data tak bisa dirender
            }

            $meta = $result['meta'];
            $timestamps = $result['timestamp'] ?? [];
            $quote = $result['indicators']['quote'][0] ?? [];
            $price = $meta['regularMarketPrice'] ?? null;
            $previousClose = $meta['chartPreviousClose'] ?? $meta['previousClose'] ?? null;

            if (! is_numeric($price) || ! is_numeric($previousClose)) {
                return null; // veto
            }

            $history = [];
            foreach ($timestamps as $i => $ts) {
                $close = $quote['close'][$i] ?? null;
                if (! is_numeric($close)) {
                    continue;
                }
                $history[] = [
                    't' => $ts,
                    'o' => (float) ($quote['open'][$i] ?? $close),
                    'h' => (float) ($quote['high'][$i] ?? $close),
                    'l' => (float) ($quote['low'][$i] ?? $close),
                    'c' => (float) $close,
                    'v' => (int) ($quote['volume'][$i] ?? 0),
                ];
            }

            return [
                'symbol' => $meta['symbol'] ?? $this->symbol($stock),
                'range' => $range,
                'longName' => $meta['longName'] ?? null,
                'exchangeName' => $meta['exchangeName'] ?? null,
                'currency' => $meta['currency'] ?? null,
                'price' => (float) $price,
                'previousClose' => (float) $previousClose,
                'change' => (float) $price - $previousClose,
                'changePercent' => (float) (($price - $previousClose) / $previousClose * 100),
                'dayHigh' => $meta['regularMarketDayHigh'] ?? null,
                'dayLow' => $meta['regularMarketDayLow'] ?? null,
                'volume' => $meta['regularMarketVolume'] ?? null,
                'week52Low' => $meta['fiftyTwoWeekLow'] ?? null,
                'week52High' => $meta['fiftyTwoWeekHigh'] ?? null,
                'marketCap' => $meta['marketCap'] ?? null,
                'asOf' => $meta['regularMarketTime'] ?? null,
                'history' => $history,
            ];
        } catch (Throwable) {
            return null;
        }
    }
}
