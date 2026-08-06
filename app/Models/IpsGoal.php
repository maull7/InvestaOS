<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['ips_id', 'type', 'target_amount', 'target_date', 'priority'])]
class IpsGoal extends Model
{
    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'target_date' => 'date:Y-m-d',
        ];
    }

    /** @return BelongsTo<InvestmentPolicyStatement, $this> */
    public function statement(): BelongsTo
    {
        return $this->belongsTo(InvestmentPolicyStatement::class, 'ips_id');
    }
}
