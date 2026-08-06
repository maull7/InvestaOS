<?php

namespace App\Services\Writers;

use App\Ai\Agents\IpsNarrativeWriter;
use App\Contracts\IpsWriter;
use App\Services\IpsInput;
use App\Services\IpsNarrative;
use Throwable;

/**
 * Writes IPS narrative via the 9router gateway (OpenAI-compatible API).
 * Never trusts the model with numbers: the rule-based writer is the base,
 * and only valid prose sections returned by the model override it. Any
 * failure, timeout, or malformed reply silently falls back to rule-based.
 */
class AiWriter implements IpsWriter
{
    /** @var string[] */
    private const NARRATIVE_SECTIONS = [
        'investment_objective',
        'risk_tolerance',
        'liquidity_requirement',
        'rebalancing_policy',
    ];

    /**
     * @param  array{timeout: int}  $config
     */
    public function __construct(
        private readonly RuleBasedWriter $fallback,
        private readonly array $config,
    ) {}

    public function write(IpsInput $input): IpsNarrative
    {
        $base = $this->fallback->write($input);

        $aiSections = $this->ask($input);

        return new IpsNarrative(array_merge($base->sections, $aiSections));
    }

    public function label(): string
    {
        return 'ai';
    }

    /**
     * @return array<string, string>
     */
    private function ask(IpsInput $input): array
    {
        try {
            $content = (string) IpsNarrativeWriter::make()->prompt(
                $this->prompt($input),
                provider: '9router',
                timeout: $this->config['timeout'] ?? 30,
            );

            if ($content === '') {
                return [];
            }

            $decoded = json_decode($this->extractJson($content), true);

            if (! is_array($decoded)) {
                return [];
            }

            $allowed = collect(self::NARRATIVE_SECTIONS);

            return collect($decoded)
                ->only($allowed)
                ->filter(fn (mixed $value) => is_string($value) && trim($value) !== '')
                ->map(fn (mixed $value) => trim((string) $value))
                ->all();
        } catch (Throwable) {
            return [];
        }
    }

    private function prompt(IpsInput $input): string
    {
        $payload = [
            'language' => $input->language,
            'investor_name' => null,
            'objective' => $input->objective,
            'risk_profile' => $input->riskName,
            'risk_score' => $input->riskScore,
            'risk_tolerance_notes' => $input->riskDescription,
            'time_horizon' => $input->timeHorizon,
            'goals' => $input->goals,
            'asset_allocation' => $input->allocations,
            'annual_income' => $input->annualIncome,
            'monthly_expenses' => $input->monthlyExpenses,
            'emergency_fund' => $input->emergencyFund,
            'total_assets' => $input->totalAssets,
            'total_liabilities' => $input->totalLiabilities,
            'constraints' => $input->constraints,
            'benchmark' => $input->benchmark,
            'rebalancing_policy' => $input->rebalancingPolicy,
        ];

        return 'Write the narrative for an Investment Policy Statement based ONLY on this structured data: '.json_encode($payload, JSON_UNESCAPED_UNICODE).PHP_EOL
            .'Language: '.($input->language === 'id' ? 'Indonesian' : 'English').'.'.PHP_EOL
            .'Return a JSON object with ONLY these keys: '.implode(', ', self::NARRATIVE_SECTIONS).'.'.PHP_EOL
            .'Each value is a short prose paragraph (2-3 sentences). Do not change, add, or invent any numbers. Do not wrap in markdown.';
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
}
