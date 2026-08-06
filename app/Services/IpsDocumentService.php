<?php

namespace App\Services;

use App\Models\InvestmentPolicyStatement;

/**
 * Reconstructs the 14 IPS sections from a persisted snapshot so preview and
 * PDF render the stored (immutable) document, not live data.
 */
class IpsDocumentService
{
    /**
     * @return array<string, mixed>
     */
    public function sections(InvestmentPolicyStatement $ips): array
    {
        $lang = $ips->language;

        return [
            'investor_info' => [
                'name' => $ips->profile?->full_name,
                'created_at' => $ips->generated_at?->format('Y-m-d'),
                'advisor' => null,
            ],
            'investment_objective' => $ips->objective,
            'investment_goals' => $ips->goals->map(fn ($goal) => [
                'type' => $goal->type,
                'target_amount' => $goal->target_amount,
                'target_date' => $goal->target_date,
                'priority' => $goal->priority,
            ])->all(),
            'risk_profile' => $ips->riskProfile?->name,
            'risk_tolerance' => $ips->risk_tolerance,
            'time_horizon' => $ips->time_horizon,
            'asset_allocation' => $ips->allocations
                ->map(fn ($a) => ['asset' => $a->asset, 'pct' => $a->pct])
                ->values()
                ->all(),
            'liquidity_requirement' => $ips->liquidity_requirement,
            'investment_constraints' => $ips->restrictions->pluck('content')->all(),
            'benchmark' => $ips->benchmark,
            'tax_consideration' => $ips->tax_note,
            'rebalancing_policy' => $ips->rebalancing_policy,
            'review_schedule' => $ips->review_schedule,
            'declaration' => IpsTemplates::declaration($lang),
        ];
    }
}
