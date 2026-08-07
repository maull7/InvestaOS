<?php

namespace App\Services;

use App\Models\Stock;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Throwable;

class StockMarketService
{
    public const RANGES = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y'];

    private const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

    /** @return array<string, mixed>|null */
    public function chart(Stock|string $symbol, string $range = '1y'): ?array
    {
        $range = in_array($range, self::RANGES, true) ? $range : '1y';
        $code = $symbol instanceof Stock ? $this->symbol($symbol) : $symbol;

        return Cache::remember(
            "stock.chart.{$code}.{$range}",
            900,
            fn () => $this->fetchChart($code, $range),
        );
    }

    /** @return array<string, mixed>|null */
    public function quote(Stock|string $symbol): ?array
    {
        return $this->chart($symbol, '1d');
    }

    public function symbol(Stock $stock): string
    {
        return str_contains($stock->code, '.') ? $stock->code : $stock->code.'.JK';
    }

    /** @return array<string, mixed> */
    public function fundamentals(string $symbol): array
    {
        return Cache::remember("stock.fund.$symbol", 86400, fn () => $this->fetchFundamentals($symbol));
    }

    /** @return array{dividends: list<array{date: int, amount: float}>, splits: list<array{date: int, numerator: int, denominator: int}>} */
    public function corporateActions(string $symbol): array
    {
        return Cache::remember("stock.corp.$symbol", 86400, fn () => $this->fetchCorporateActions($symbol));
    }

    /** @return array<string, mixed> */
    private function fetchFundamentals(string $symbol): array
    {
        $data = $this->quoteSummary($symbol, 'summaryDetail,financialData,defaultKeyStatistics');

        if (! is_array($data)) {
            return [];
        }

        $trailingPE = $this->raw($data, 'trailingPE');
        $dividendYear = $this->raw($data, 'dividendYield');

        return collect([
            'currency' => $this->raw($data, 'currency'),
            'price' => $this->raw($data, 'regularMarketPrice') ?? $this->raw($data, 'currentPrice'),
            'marketCap' => $this->raw($data, 'marketCap'),
            'trailingPE' => $trailingPE,
            'forwardPE' => $this->raw($data, 'forwardPE'),
            'pegRatio' => $this->raw($data, 'pegRatio'),
            'eps' => $this->raw($data, 'epsTrailingTwelveMonths'),
            'bookValue' => $this->raw($data, 'bookValue'),
            'priceToBook' => $this->raw($data, 'priceToBook'),
            'beta' => $this->raw($data, 'beta'),
            'dividendRate' => $this->raw($data, 'dividendRate'),
            'dividendYield' => $dividendYear,
            'dividendYieldPercent' => $dividendYear !== null ? (float) $dividendYear * 100 : null,
            'payoutRatio' => $this->raw($data, 'payoutRatio'),
            'revenue' => $this->raw($data, 'totalRevenue'),
            'revenueGrowth' => $this->raw($data, 'revenueGrowth'),
            'profitMargins' => $this->raw($data, 'profitMargins'),
            'returnOnEquity' => $this->raw($data, 'returnOnEquity'),
            'returnOnAssets' => $this->raw($data, 'returnOnAssets'),
            'debtToEquity' => $this->raw($data, 'debtToEquity'),
            'freeCashFlow' => $this->raw($data, 'freeCashflow'),
            'asOf' => $this->raw($data, 'regularMarketTime'),
        ])->filter(fn ($v) => is_numeric($v))->all();
    }

    /** @return array<int, array{title: string|null, publisher: string|null, link: string|null, publishedAt: int|null}> */
    public function news(string $symbol, int $count = 5): array
    {
        try {
            $response = $this->http()->get(
                'https://query1.finance.yahoo.com/v1/finance/search',
                ['q' => $symbol, 'quotesCount' => 0, 'newsCount' => $count],
            );
        } catch (Throwable) {
            return [];
        }

        $items = (array) $response->json('news', []);

        return collect($items)->map(fn (array $n) => [
            'title' => $n['title'] ?? null,
            'publisher' => $n['publisher'] ?? null,
            'link' => $n['link'] ?? null,
            'publishedAt' => $n['providerPublishTime'] ?? null,
        ])->filter(fn ($n) => $n['title'] && $n['link'])->values()->all();
    }

    /** @return array{dividends: list<array{date: int, amount: float}>, splits: list<array{date: int, numerator: int, denominator: int}>} */
    private function fetchCorporateActions(string $symbol): array
    {
        try {
            $response = $this->http()->get(
                "https://query1.finance.yahoo.com/v8/finance/chart/$symbol",
                ['range' => 'max', 'interval' => '1d', 'events' => 'div,splits'],
            );
        } catch (Throwable) {
            return ['dividends' => [], 'splits' => []];
        }

        $events = $response->json('chart.result.0.events', []);
        $dividends = [];
        foreach ((array) ($events['dividends'] ?? []) as $d) {
            if (isset($d['date'], $d['amount']) && is_numeric($d['amount'])) {
                $dividends[] = ['date' => (int) $d['date'], 'amount' => (float) $d['amount']];
            }
        }
        $splits = [];
        foreach ((array) ($events['splits'] ?? []) as $s) {
            if (isset($s['date'], $s['numerator'], $s['denominator'])) {
                $splits[] = [
                    'date' => (int) $s['date'],
                    'numerator' => (int) $s['numerator'],
                    'denominator' => (int) $s['denominator'],
                ];
            }
        }

        return ['dividends' => $dividends, 'splits' => $splits];
    }

    /** @return array<string, mixed>|null */
    private function fetchChart(string $code, string $range): ?array
    {
        try {
            $response = $this->http()->get(
                "https://query1.finance.yahoo.com/v8/finance/chart/$code",
                ['range' => $range, 'interval' => in_array($range, ['1d', '5d'], true) ? '1h' : '1d'],
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
                'symbol' => $meta['symbol'] ?? $code,
                'range' => $range,
                'longName' => $meta['longName'] ?? null,
                'shortName' => $meta['shortName'] ?? null,
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

    /** @return array<string, mixed>|null */
    private function quoteSummary(string $symbol, string $modules): ?array
    {
        $auth = Cache::remember('stock.crumb', 1800, fn () => $this->yahooAuth());

        if (! is_array($auth)) {
            return null;
        }

        try {
            $response = $this->http()
                ->withHeaders(['Cookie' => $auth['cookie']])
                ->get(
                    "https://query1.finance.yahoo.com/v10/finance/quoteSummary/$symbol",
                    ['modules' => $modules, 'crumb' => $auth['crumb']],
                );

            return $response->json('quoteSummary.result.0');
        } catch (Throwable) {
            return null;
        }
    }

    /** @return array{crumb:string,cookie:string}|null */
    private function yahooAuth(): ?array
    {
        try {
            $first = $this->http()->get('https://fc.yahoo.com/');

            $setCookies = [];
            foreach ($first->headers() as $name => $vals) {
                if (strtolower((string) $name) !== 'set-cookie') {
                    continue;
                }
                foreach ((array) $vals as $v) {
                    if (is_string($v) && preg_match('/^([^=]+)=([^;]*)/', $v, $m)) {
                        $setCookies[] = trim("$m[1]=$m[2]");
                    }
                }
            }
            if ($setCookies === []) {
                return null;
            }
            $cookie = implode('; ', $setCookies);

            $crumb = trim((string) $this->http()
                ->withHeader('Cookie', $cookie)
                ->get('https://query1.finance.yahoo.com/v1/test/getcrumb')
                ->body());

            if ($crumb === '') {
                return null;
            }

            return ['crumb' => $crumb, 'cookie' => $cookie];
        } catch (Throwable) {
            return null;
        }
    }

    /** @param array<string, mixed>|null $data */
    private function raw(?array $data, string $key): mixed
    {
        if (! is_array($data)) {
            return null;
        }
        foreach ($data as $module) {
            if (isset($module[$key]['raw'])) {
                return $module[$key]['raw'];
            }
        }

        return null;
    }

    private function http(): PendingRequest
    {
        return Http::withHeader('User-Agent', self::UA)->timeout(8);
    }
}
