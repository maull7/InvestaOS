<?php

namespace App\Services\Writers;

use App\Contracts\IpsWriter;
use App\Services\IpsInput;
use App\Services\IpsNarrative;
use App\Services\IpsTemplates;

/**
 * Default writer: deterministic prose built from templates and profile data.
 * Also serves as the fallback when the AI writer is unavailable.
 */
class RuleBasedWriter implements IpsWriter
{
    public function write(IpsInput $input): IpsNarrative
    {
        return new IpsNarrative([
            'investment_objective' => $input->objective,
            'risk_tolerance' => $input->riskDescription ?? '—',
            'liquidity_requirement' => IpsTemplates::liquidity(
                $input->emergencyFund,
                $input->monthlyExpenses,
                $input->language,
            ),
            'rebalancing_policy' => $input->rebalancingPolicy,
        ]);
    }

    public function label(): string
    {
        return 'rule';
    }
}
