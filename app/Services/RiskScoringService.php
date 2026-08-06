<?php

namespace App\Services;

use App\Models\InvestmentProfile;
use App\Models\RiskProfile;

class RiskScoringService
{
    public function scoreFor(InvestmentProfile $profile): InvestmentProfile
    {
        $total = (int) $profile
            ->answers()
            ->with('option')
            ->get()
            ->sum(fn ($answer) => (int) $answer->option->score);

        $risk = RiskProfile::query()
            ->where('min_score', '<=', $total)
            ->where('max_score', '>=', $total)
            ->first();

        $profile->forceFill([
            'risk_score' => $total,
            'risk_profile_id' => $risk?->id,
        ])->save();

        return $profile->fresh();
    }
}
