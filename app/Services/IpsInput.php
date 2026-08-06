<?php

namespace App\Services;

/**
 * Structured snapshot handed to an IpsWriter. Carries only what a writer
 * needs to compose prose; all numeric/structure values are pre-resolved.
 */
final class IpsInput
{
    /**
     * @param  array<int, array{type: string, target_amount: string, target_date: string, priority: string}>  $goals
     * @param  array<int, array{asset: string, pct: int}>  $allocations
     * @param  array<int, string>  $constraints
     */
    public function __construct(
        public readonly string $language,
        public readonly string $objective,
        public readonly string $riskSlug,
        public readonly ?string $riskName,
        public readonly ?string $riskDescription,
        public readonly ?int $riskScore,
        public readonly string $timeHorizon,
        public readonly array $goals,
        public readonly array $allocations,
        public readonly float $annualIncome,
        public readonly float $monthlyExpenses,
        public readonly float $emergencyFund,
        public readonly float $totalAssets,
        public readonly float $totalLiabilities,
        public readonly array $constraints,
        public readonly string $benchmark,
        public readonly string $rebalancingPolicy,
    ) {}
}
