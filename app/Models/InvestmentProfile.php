<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property-read User $user
 * @property-read RiskProfile|null $riskProfile
 * @property-read Collection<int, InvestmentAnswer> $answers
 * @property-read Collection<int, InvestmentGoal> $goals
 * @property-read Collection<int, InvestmentPolicyStatement> $policyStatements
 */
#[Fillable([
    'user_id', 'full_name', 'date_of_birth', 'gender', 'occupation', 'company',
    'annual_income', 'monthly_expenses', 'total_assets', 'total_liabilities', 'emergency_fund',
    'risk_profile_id', 'risk_score', 'current_step', 'status',
])]
class InvestmentProfile extends Model
{
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date:Y-m-d',
            'annual_income' => 'decimal:2',
            'monthly_expenses' => 'decimal:2',
            'total_assets' => 'decimal:2',
            'total_liabilities' => 'decimal:2',
            'emergency_fund' => 'decimal:2',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<RiskProfile, $this> */
    public function riskProfile(): BelongsTo
    {
        return $this->belongsTo(RiskProfile::class);
    }

    /** @return HasMany<InvestmentAnswer, $this> */
    public function answers(): HasMany
    {
        return $this->hasMany(InvestmentAnswer::class, 'profile_id');
    }

    /** @return HasMany<InvestmentGoal, $this> */
    public function goals(): HasMany
    {
        return $this->hasMany(InvestmentGoal::class, 'profile_id');
    }

    /** @return HasMany<InvestmentPolicyStatement, $this> */
    public function policyStatements(): HasMany
    {
        return $this->hasMany(InvestmentPolicyStatement::class, 'profile_id');
    }
}
