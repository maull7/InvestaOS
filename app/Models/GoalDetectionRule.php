<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['goal_type', 'condition', 'threshold', 'target_multiplier', 'target_months', 'priority', 'reason', 'enabled', 'order'])]
class GoalDetectionRule extends Model
{
    protected function casts(): array
    {
        return [
            'threshold' => 'decimal:2',
            'target_multiplier' => 'decimal:2',
            'enabled' => 'boolean',
        ];
    }
}
