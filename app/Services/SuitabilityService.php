<?php

namespace App\Services;

use App\Models\InvestmentProfile;
use App\Models\RiskAllocation;
use App\Models\RiskProfile;
use Illuminate\Support\Collection;

class SuitabilityService
{
    /**
     * Return the asset classes suitable for an investor's risk profile.
     *
     * @return array{risk_profile: RiskProfile|null, allocations: Collection<int, RiskAllocation>}
     */
    public function suitableAssets(InvestmentProfile $profile): array
    {
        $risk = $profile->riskProfile;

        return [
            'risk_profile' => $risk,
            'allocations' => $risk?->allocations ?? collect(),
        ];
    }
}
