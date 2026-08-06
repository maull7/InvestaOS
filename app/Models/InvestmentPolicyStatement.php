<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $profile_id
 * @property string $status
 * @property string $language
 * @property Carbon|null $generated_at
 * @property Carbon|null $declared_at
 */
#[Fillable([
    'profile_id', 'status', 'written_by', 'objective', 'risk_profile_id', 'risk_score', 'risk_tolerance',
    'time_horizon', 'liquidity_requirement', 'benchmark', 'tax_note', 'rebalancing_policy',
    'review_schedule', 'language', 'generated_at', 'declared_at',
])]
class InvestmentPolicyStatement extends Model
{
    protected function casts(): array
    {
        return [
            'risk_score' => 'integer',
            'generated_at' => 'datetime',
            'declared_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<InvestmentProfile, $this> */
    public function profile(): BelongsTo
    {
        return $this->belongsTo(InvestmentProfile::class, 'profile_id');
    }

    /** @return BelongsTo<RiskProfile, $this> */
    public function riskProfile(): BelongsTo
    {
        return $this->belongsTo(RiskProfile::class);
    }

    /** @return HasMany<IpsAllocation, $this> */
    public function allocations(): HasMany
    {
        return $this->hasMany(IpsAllocation::class, 'ips_id');
    }

    /** @return HasMany<IpsGoal, $this> */
    public function goals(): HasMany
    {
        return $this->hasMany(IpsGoal::class, 'ips_id');
    }

    /** @return HasMany<IpsRestriction, $this> */
    public function restrictions(): HasMany
    {
        return $this->hasMany(IpsRestriction::class, 'ips_id');
    }
}
