<?php

namespace App\Services;

use App\Ai\Agents\ResearchAgent;
use App\Models\Bond;
use App\Models\MutualFund;
use App\Models\Research;
use App\Models\Stock;
use Illuminate\Support\Str;
use Throwable;

class ResearchGenerationService
{
    /** @var array<string, list<string>> */
    private const SECTIONS = [
        'stock' => ['executive_summary', 'fundamental_analysis', 'technical_analysis', 'valuation', 'risk_analysis', 'conclusion'],
        'bond' => ['executive_summary', 'yield_assessment', 'credit_risk', 'interest_rate_risk', 'valuation', 'conclusion'],
        'fund' => ['executive_summary', 'fund_profile', 'risk_assessment', 'manager_assessment', 'conclusion'],
    ];

    public function __construct(
        private readonly ResearchDataService $data,
        private readonly BondService $bonds,
        private readonly array $config,
    ) {}

    public function generateStockAnalysis(Stock $stock, int $userId): Research
    {
        $research = $this->createResearch('stock', Stock::class, $stock->id, $stock->code, "{$stock->code} — Stock Analysis", $userId);

        try {
            $payload = $this->data->stock($stock);

            if ($payload === null) {
                return $this->fail($research, 'Insufficient data available for analysis.');
            }

            $analysis = $this->analyzeStock($payload);
            $ai = $this->askAi($payload, $analysis, 'stock');
            $content = array_merge($this->stockSections($payload, $analysis, $ai), $this->meta($analysis));

            $this->publish($research, $content, $ai, $analysis['confidence']);
            $this->persistStockSources($research, $payload);

            return $research->fresh();
        } catch (Throwable $e) {
            $this->fail($research, 'Analysis failed: '.$e->getMessage());

            throw $e;
        }
    }

    public function generateBondAnalysis(Bond $bond, int $userId): Research
    {
        $research = $this->createResearch('bond', Bond::class, $bond->id, $bond->code, "{$bond->code} — Bond Analysis", $userId);

        try {
            $payload = [
                'bond' => [
                    'code' => $bond->code,
                    'name' => $bond->name,
                    'type' => $bond->type,
                    'issuer' => $bond->issuer,
                    'coupon' => $bond->coupon,
                    'currency' => $bond->currency,
                    'maturity_date' => $bond->maturity_date?->format('Y-m-d'),
                    'status' => $bond->status,
                ],
                'calc' => $this->bonds->enrich($bond),
            ];

            $analysis = $this->analyzeBond($payload);
            $ai = $this->askAi($payload, $analysis, 'bond');
            $content = array_merge($this->bondSections($payload, $analysis, $ai), $this->meta($analysis));

            $this->publish($research, $content, $ai, $analysis['confidence']);
            $this->persistBondSources($research, $payload);

            return $research->fresh();
        } catch (Throwable $e) {
            $this->fail($research, 'Analysis failed: '.$e->getMessage());

            throw $e;
        }
    }

    public function generateFundAnalysis(MutualFund $fund, int $userId): Research
    {
        $fund->load('investmentManager');
        $assetCode = $fund->code ?? "#{$fund->id}";
        $research = $this->createResearch('fund', MutualFund::class, $fund->id, $assetCode, "{$fund->name} — Fund Analysis", $userId);

        try {
            $payload = [
                'fund' => [
                    'code' => $fund->code,
                    'name' => $fund->name,
                    'fund_type' => $fund->fund_type,
                    'currency' => $fund->currency,
                    'risk_level' => $fund->risk_level,
                    'custodian_bank' => $fund->custodian_bank,
                    'launch_date' => $fund->launch_date?->format('Y-m-d'),
                    'manager' => $fund->investmentManager?->name,
                ],
            ];

            $analysis = $this->analyzeFund($payload);
            $ai = $this->askAi($payload, $analysis, 'fund');
            $content = array_merge($this->fundSections($payload, $analysis, $ai), $this->meta($analysis));

            $this->publish($research, $content, $ai, $analysis['confidence']);
            $this->persistFundSources($research, $payload);

            return $research->fresh();
        } catch (Throwable $e) {
            $this->fail($research, 'Analysis failed: '.$e->getMessage());

            throw $e;
        }
    }

    private function createResearch(string $category, string $assetType, int $assetId, string $assetCode, string $title, int $userId): Research
    {
        $existing = Research::where('asset_type', $assetType)
            ->where('asset_code', $assetCode)
            ->where('category', $category)
            ->orderByDesc('version')
            ->first();

        $version = $existing ? $existing->version + 1 : 1;

        return Research::create([
            'category' => $category,
            'asset_type' => $assetType,
            'asset_id' => $assetId,
            'asset_code' => $assetCode,
            'title' => $title,
            'slug' => Str::slug("{$assetCode}-{$category}-analysis-v{$version}"),
            'status' => 'processing',
            'content' => ['status' => 'processing'],
            'created_by' => $userId,
            'parent_id' => $existing?->id,
            'version' => $version,
        ]);
    }

    private function publish(Research $research, array $content, array $aiSections, float $confidence): void
    {
        $research->update([
            'summary' => $content['executive_summary'] ?? 'Analysis completed.',
            'content' => $content,
            'status' => 'published',
            'source_type' => empty($aiSections) ? 'rule' : 'ai',
            'model' => empty($aiSections) ? null : ($this->config['providers']['9router']['models']['text']['default'] ?? null),
            'confidence' => $confidence,
            'published_at' => now(),
        ]);
    }

    private function fail(Research $research, string $message): Research
    {
        $research->update([
            'status' => 'archived',
            'summary' => $message,
            'content' => ['error' => $message],
        ]);

        return $research->fresh();
    }

    private function analyzeStock(array $payload): array
    {
        $fund = $payload['fundamentals'];
        $tech = $payload['technical'];
        $signals = [];
        $outlook = 'neutral';
        $valuation = 'fair';
        $recommendation = 'hold';
        $confidence = 55.0;

        if (isset($fund['trailingPE'])) {
            if ($fund['trailingPE'] < 15) {
                $signals[] = 'undervalued_pe';
                $valuation = 'undervalued';
            } elseif ($fund['trailingPE'] > 25) {
                $signals[] = 'overvalued_pe';
                $valuation = 'overvalued';
            }
        }
        if (isset($fund['priceToBook']) && $fund['priceToBook'] < 1.5) {
            $signals[] = 'undervalued_pb';
        }
        if (isset($fund['returnOnEquity']) && $fund['returnOnEquity'] > 0.15) {
            $signals[] = 'strong_roe';
        }
        if (isset($tech['rsi'])) {
            if ($tech['rsi'] < 30) {
                $signals[] = 'oversold';
            } elseif ($tech['rsi'] > 70) {
                $signals[] = 'overbought';
            }
        }
        if ($tech['trend'] === 'uptrend') {
            $signals[] = 'uptrend';
            $outlook = 'bullish';
        } elseif ($tech['trend'] === 'downtrend') {
            $signals[] = 'downtrend';
            $outlook = 'bearish';
        }
        if (isset($tech['macd']) && $tech['macd']['histogram'] > 0) {
            $signals[] = 'macd_bullish';
        }

        $bullish = count(array_intersect($signals, ['undervalued_pe', 'undervalued_pb', 'strong_roe', 'uptrend', 'macd_bullish', 'oversold']));
        $bearish = count(array_intersect($signals, ['overvalued_pe', 'downtrend', 'overbought']));

        if ($bullish > $bearish + 1) {
            $recommendation = 'buy';
            $confidence = min(85.0, 60 + ($bullish * 5));
        } elseif ($bearish > $bullish + 1) {
            $recommendation = 'sell';
            $confidence = min(85.0, 60 + ($bearish * 5));
        }

        return [
            'outlook' => $outlook,
            'valuation' => $valuation,
            'risk' => 'medium',
            'recommendation' => $recommendation,
            'confidence' => $confidence,
        ];
    }

    private function analyzeBond(array $payload): array
    {
        $calc = $payload['calc'];
        $duration = $this->num($calc['durationYears']);
        $spread = $this->num($calc['spread']);
        $years = $this->num($calc['yearsRemaining']);
        $ytm = $this->num($calc['ytm']) ?? $this->num($payload['bond']['coupon']);

        $signals = [];
        $outlook = 'neutral';
        $valuation = 'fair';
        $recommendation = 'hold';
        $risk = 'medium';
        $confidence = 55.0;

        if ($spread !== null && $spread != 0) {
            $signals[] = $spread > 0 ? 'yield_premium' : 'yield_discount';
            $valuation = $spread > 0 ? 'premium' : 'discount';
            $outlook = $spread > 0 ? 'bullish' : 'bearish';
        }
        if ($duration !== null) {
            $signals[] = $duration > 7 ? 'high_duration' : ($duration < 3 ? 'low_duration' : '');
        }
        if ($years !== null && $years < 3) {
            $signals[] = 'short_tenor';
        }
        if ($payload['bond']['type'] === 'government_bond') {
            $signals[] = 'low_credit_risk';
        } elseif ($payload['bond']['type'] === 'corporate_bond') {
            $signals[] = 'corporate_risk';
        }

        $signals = array_values(array_filter($signals));

        if (in_array('high_duration', $signals, true)) {
            $risk = 'high';
        } elseif (in_array('low_duration', $signals, true)) {
            $risk = 'low';
        }

        if ($spread !== null && $spread > 0.5 && $ytm !== null && $ytm > 6) {
            $recommendation = 'buy';
            $confidence = min(80.0, 62 + count($signals) * 4);
        } elseif ($spread !== null && $spread < -0.5) {
            $recommendation = 'sell';
            $confidence = 62.0;
        }

        return compact('outlook', 'valuation', 'risk', 'recommendation', 'confidence');
    }

    private function analyzeFund(array $payload): array
    {
        $riskLevel = $payload['fund']['risk_level'];
        $map = [1 => 'low', 2 => 'low', 3 => 'medium', 4 => 'high', 5 => 'high'];
        $recommendation = 'hold';
        $confidence = 50.0;

        // ponytail: belum ada data NAV/return — analisa fund deskriptif; tambah riwayat NAV kalau sumbernya ada.
        if (($payload['fund']['fund_type'] ?? '') === 'equity' && ($riskLevel ?? 3) <= 3) {
            $recommendation = 'buy';
            $confidence = 58.0;
        }

        return [
            'outlook' => 'neutral',
            'valuation' => 'fair',
            'risk' => $map[$riskLevel] ?? 'medium',
            'recommendation' => $recommendation,
            'confidence' => $confidence,
        ];
    }

    private function askAi(array $payload, array $analysis, string $category): array
    {
        if (! config('ai.enabled') || config('ai.providers.9router.key') === '') {
            return [];
        }

        $sections = self::SECTIONS[$category];

        try {
            $prompt = "Write a {$category} analysis report based ONLY on this data: "
                .json_encode(array_merge($payload, ['analysis' => $analysis]), JSON_UNESCAPED_UNICODE).PHP_EOL
                .'Return a JSON object with these keys: '.implode(', ', $sections).'.'.PHP_EOL
                .'Each value is 2-3 sentences. Do not invent numbers. Do not wrap in markdown.';

            $content = (string) ResearchAgent::make()->prompt($prompt, provider: '9router', timeout: $this->config['timeout'] ?? 30);

            if ($content === '') {
                return [];
            }

            $decoded = json_decode($this->extractJson($content), true);
            if (! is_array($decoded)) {
                return [];
            }

            return collect($decoded)
                ->only($sections)
                ->filter(fn (mixed $v) => is_string($v) && trim($v) !== '')
                ->map(fn (mixed $v) => trim((string) $v))
                ->all();
        } catch (Throwable) {
            return [];
        }
    }

    private function stockSections(array $payload, array $analysis, array $ai): array
    {
        $fund = $payload['fundamentals'];
        $tech = $payload['technical'];
        $stock = $payload['stock'];

        $parts = [];
        if (isset($fund['trailingPE'])) {
            $parts[] = 'P/E: '.number_format($fund['trailingPE'], 2);
        }
        if (isset($fund['priceToBook'])) {
            $parts[] = 'P/B: '.number_format($fund['priceToBook'], 2);
        }
        if (isset($fund['returnOnEquity'])) {
            $parts[] = 'ROE: '.number_format($fund['returnOnEquity'] * 100, 2).'%';
        }

        $techParts = [];
        if ($tech['trend']) {
            $techParts[] = ucfirst($tech['trend']);
        }
        if (isset($tech['rsi'])) {
            $techParts[] = 'RSI: '.number_format($tech['rsi'], 2);
        }

        return [
            'executive_summary' => $ai['executive_summary'] ?? "{$stock['name']} ({$stock['code']}) — outlook {$analysis['outlook']}, valuation {$analysis['valuation']}. Rekomendasi: ".ucfirst($analysis['recommendation']).'.',
            'fundamental_analysis' => $ai['fundamental_analysis'] ?? (empty($parts) ? 'Data fundamental terbatas.' : implode(', ', $parts).'.'),
            'technical_analysis' => $ai['technical_analysis'] ?? (empty($techParts) ? 'Indikator teknikal masih campur.' : implode(', ', $techParts).'.'),
            'valuation' => $ai['valuation'] ?? "Valuasi saat ini tampak {$analysis['valuation']} berdasarkan metrik yang tersedia.",
            'risk_analysis' => $ai['risk_analysis'] ?? "Tingkat risiko: {$analysis['risk']}.",
            'conclusion' => $ai['conclusion'] ?? 'Rekomendasi: '.ucfirst($analysis['recommendation'])." dengan keyakinan {$analysis['confidence']}%.",
        ];
    }

    private function bondSections(array $payload, array $analysis, array $ai): array
    {
        $bond = $payload['bond'];
        $calc = $payload['calc'];
        $ytm = $this->num($calc['ytm']) ?? $this->num($bond['coupon']);
        $duration = $this->num($calc['durationYears']);
        $spread = $this->num($calc['spread']);
        $years = $this->num($calc['yearsRemaining']);

        return [
            'executive_summary' => $ai['executive_summary'] ?? "{$bond['name']} — YTM ".($ytm !== null ? number_format($ytm, 2).'%' : 'n/a').', duration '.($duration !== null ? number_format($duration, 1).'y' : 'n/a').'. Rekomendasi: '.ucfirst($analysis['recommendation']).'.',
            'yield_assessment' => $ai['yield_assessment'] ?? ($ytm !== null ? 'Yield to maturity sekitar '.number_format($ytm, 2).'% per tahun.' : 'Data yield tidak tersedia.'),
            'credit_risk' => $ai['credit_risk'] ?? ($bond['type'] === 'government_bond' ? 'Diterbitkan pemerintah — risiko kredit sangat rendah.' : 'Obligasi korporasi — risiko kredit bergantung issuer.'),
            'interest_rate_risk' => $ai['interest_rate_risk'] ?? ($duration !== null ? 'Duration '.number_format($duration, 1).' tahun — '.($duration > 7 ? 'sensitif terhadap kenaikan suku bunga.' : 'moderat terhadap perubahan suku bunga.') : 'Data duration tidak tersedia.'),
            'valuation' => $ai['valuation'] ?? ($spread !== null ? ($spread >= 0 ? 'Yield premium '.number_format($spread, 2).'% terhadap acuan — relatif menarik.' : 'Yield diskonto '.abs($spread).'% terhadap acuan — kurang menarik.') : 'Data spread tidak tersedia.'),
            'conclusion' => $ai['conclusion'] ?? 'Sisa tenor '.($years !== null ? number_format($years, 1).' tahun' : 'n/a').'. Rekomendasi: '.ucfirst($analysis['recommendation']).'.',
        ];
    }

    private function fundSections(array $payload, array $analysis, array $ai): array
    {
        $fund = $payload['fund'];
        $riskNames = [1 => 'Sangat Rendah', 2 => 'Rendah', 3 => 'Sedang', 4 => 'Tinggi', 5 => 'Sangat Tinggi'];

        return [
            'executive_summary' => $ai['executive_summary'] ?? "{$fund['name']} — jenis {$fund['fund_type']}, risiko ".($riskNames[$fund['risk_level']] ?? 'n/a').'. Rekomendasi: '.ucfirst($analysis['recommendation']).'.',
            'fund_profile' => $ai['fund_profile'] ?? "Jenis: {$fund['fund_type']}. Kustodian: ".($fund['custodian_bank'] ?? 'n/a').'. Diluncurkan: '.($fund['launch_date'] ?? 'n/a').'.',
            'risk_assessment' => $ai['risk_assessment'] ?? 'Tingkat risiko fund: '.($riskNames[$fund['risk_level']] ?? 'n/a').'.',
            'manager_assessment' => $ai['manager_assessment'] ?? 'Manajer investasi: '.($fund['manager'] ?? 'n/a').'.',
            'conclusion' => $ai['conclusion'] ?? 'Analisa fund masih deskriptif karena belum ada data NAV/return. Keputusan: '.ucfirst($analysis['recommendation']).'.',
        ];
    }

    private function meta(array $analysis): array
    {
        return [
            'recommendation' => $analysis['recommendation'],
            'outlook' => $analysis['outlook'],
            'valuation_assessment' => $analysis['valuation'],
            'risk_level' => $analysis['risk'],
            'confidence' => $analysis['confidence'],
        ];
    }

    private function num(mixed $v): ?float
    {
        return is_numeric($v) ? (float) $v : null;
    }

    private function extractJson(string $content): string
    {
        if (preg_match('/```(?:json)?\s*(\{.*?\})\s*```/s', $content, $matches)) {
            return $matches[1];
        }

        $start = strpos($content, '{');
        $end = strrpos($content, '}');

        if ($start === false || $end === false || $end < $start) {
            return $content;
        }

        return substr($content, $start, $end - $start + 1);
    }

    private function persistStockSources(Research $research, array $payload): void
    {
        $quote = $payload['quote'];
        $fund = $payload['fundamentals'];
        $tech = $payload['technical'];

        $this->addSource($research, 'current_price', ['price' => $quote['price'] ?? null, 'change' => $quote['change'] ?? null], 'Yahoo Finance', 'Real-time', isset($quote['asOf']) ? now()->setTimestamp($quote['asOf']) : now());

        if (! empty($fund)) {
            $this->addSource($research, 'fundamentals', $fund, 'Yahoo Finance - Quote Summary', 'Trailing Twelve Months', isset($fund['asOf']) ? now()->setTimestamp($fund['asOf']) : now());
        }
        if (! empty($tech)) {
            $this->addSource($research, 'technical_indicators', $tech, 'Calculated from historical price data', '1 Year', now());
        }
        foreach ($payload['news'] as $idx => $item) {
            $this->addSource($research, "news_{$idx}", $item, $item['publisher'] ?? 'News', 'Recent', isset($item['publishedAt']) ? now()->setTimestamp($item['publishedAt']) : now(), $item['link'] ?? null);
        }
    }

    private function persistBondSources(Research $research, array $payload): void
    {
        $this->addSource($research, 'bond_terms', $payload['bond'], 'InvestaOS Master Bonds', 'Fixed', now());
        $this->addSource($research, 'bond_calculation', $payload['calc'], 'Calculated (YTM, duration, spread)', 'At issue/maturity profile', now());
    }

    private function persistFundSources(Research $research, array $payload): void
    {
        $this->addSource($research, 'fund_master', $payload['fund'], 'InvestaOS Master Funds', 'Registration data', now());
    }

    private function addSource(Research $research, string $claimKey, array $data, string $source, ?string $period, $asOf, ?string $url = null): void
    {
        $research->sources()->create([
            'claim_key' => $claimKey,
            'data' => $data,
            'source' => $source,
            'period' => $period,
            'url' => $url,
            'as_of' => $asOf,
        ]);
    }
}
