<?php

namespace App\Services;

use App\Contracts\IpsWriter;
use App\Models\InvestmentProfile;
use Carbon\Carbon;

/**
 * Orchestrates IPS generation.
 *
 * Structure and every numeric value (allocation %, goals, risk score, dates,
 * benchmark, review) are ALWAYS computed here from profile data — never by
 * the writer. The writer only supplies prose for a few narrative sections.
 */
class IpsGenerationService
{
    /**
     * @param  array{language: string, objective?: ?string, benchmark?: string,
     *                rebalancing_policy?: string, review_schedule?: string,
     *                restrictions?: string[]}  $options
     * @return array<string, mixed>
     */
    public function build(InvestmentProfile $profile, array $options): array
    {
        $lang = $options['language'];

        $riskSlug = 'balanced';
        $allocations = collect();

        if ($profile->risk_profile_id) {
            $risk = $profile->riskProfile;
            $riskSlug = $risk->slug;
            $allocations = $risk->allocations;
        }

        $objective = $options['objective'] ?? IpsTemplates::objectiveFor($riskSlug, $lang);
        $horizon = $this->horizonFor($profile, $lang);
        $goals = $this->goalsFor($profile);
        $rebalancing = $options['rebalancing_policy'] ?? IpsTemplates::defaultRebalancing($lang);

        $narrative = app(IpsWriter::class)->write(new IpsInput(
            language: $lang,
            objective: $objective,
            riskSlug: $riskSlug,
            riskName: $profile->riskProfile?->name,
            riskDescription: $profile->riskProfile?->description,
            riskScore: $profile->risk_score,
            timeHorizon: $horizon,
            goals: $goals,
            allocations: $allocations->map(fn ($a) => ['asset' => $a->asset, 'pct' => $a->pct])->values()->all(),
            annualIncome: (float) $profile->annual_income,
            monthlyExpenses: (float) $profile->monthly_expenses,
            emergencyFund: (float) $profile->emergency_fund,
            totalAssets: (float) $profile->total_assets,
            totalLiabilities: (float) $profile->total_liabilities,
            constraints: $options['restrictions'] ?? [],
            benchmark: $options['benchmark'] ?? 'IDX Composite (IHSG) & LQ45',
            rebalancingPolicy: $rebalancing,
        ));

        $prose = $narrative->sections;

        // A user-provided objective always wins over any writer output.
        if (isset($options['objective']) && $options['objective'] !== '') {
            $prose['investment_objective'] = $options['objective'];
        }

        return [
            'investor_info' => [
                'name' => $profile->full_name,
                'created_at' => Carbon::now()->format('Y-m-d'),
                'advisor' => null,
            ],
            'investment_objective' => $prose['investment_objective'],
            'investment_goals' => $goals,
            'risk_profile' => $profile->riskProfile?->name,
            'risk_tolerance' => $prose['risk_tolerance'],
            'time_horizon' => $horizon,
            'asset_allocation' => $allocations->map(fn ($a) => ['asset' => $a->asset, 'pct' => $a->pct])->values()->all(),
            'liquidity_requirement' => $prose['liquidity_requirement'],
            'investment_constraints' => $options['restrictions'] ?? [],
            'benchmark' => $options['benchmark'] ?? 'IDX Composite (IHSG) & LQ45',
            'tax_consideration' => IpsTemplates::taxNote($lang),
            'rebalancing_policy' => $prose['rebalancing_policy'],
            'review_schedule' => $options['review_schedule'] ?? 'Annual',
            'declaration' => IpsTemplates::declaration($lang),
        ];
    }

    private function horizonFor(InvestmentProfile $profile, string $lang): string
    {
        $horizons = $profile->goals
            ->map(fn ($goal) => Carbon::now()->diffInYears(Carbon::parse($goal->target_date)))
            ->filter()
            ->all();

        $years = $horizons ? (int) max($horizons) : 0;

        if ($years === 0) {
            $years = match ($profile->riskProfile?->slug) {
                'conservative' => 2,
                'moderate' => 3,
                'balanced' => 5,
                'growth' => 7,
                'aggressive' => 10,
                default => 5,
            };
        }

        return IpsTemplates::horizonFor($years, $lang);
    }

    /**
     * @return array<int, array{type: string, target_amount: string, target_date: string, priority: string}>
     */
    private function goalsFor(InvestmentProfile $profile): array
    {
        return $profile->goals
            ->map(fn ($goal) => [
                'type' => $goal->type,
                'target_amount' => $goal->target_amount,
                'target_date' => $goal->target_date,
                'priority' => $goal->priority,
            ])
            ->values()
            ->all();
    }
}
