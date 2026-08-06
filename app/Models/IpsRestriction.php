<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['ips_id', 'content'])]
class IpsRestriction extends Model
{
    /** @return BelongsTo<InvestmentPolicyStatement, $this> */
    public function statement(): BelongsTo
    {
        return $this->belongsTo(InvestmentPolicyStatement::class, 'ips_id');
    }
}
