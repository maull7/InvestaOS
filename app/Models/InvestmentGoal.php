<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['profile_id', 'type', 'target_amount', 'target_date', 'priority'])]
class InvestmentGoal extends Model
{
    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'target_date' => 'date:Y-m-d',
        ];
    }

    public function profile()
    {
        return $this->belongsTo(InvestmentProfile::class);
    }
}
