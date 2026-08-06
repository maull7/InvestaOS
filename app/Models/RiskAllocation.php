<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['risk_profile_id', 'asset', 'pct'])]
class RiskAllocation extends Model
{
    public function riskProfile()
    {
        return $this->belongsTo(RiskProfile::class);
    }
}
