<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MutualFund extends Model
{
    protected $fillable = [
        'investment_manager_id',
        'code',
        'name',
        'fund_type',
        'currency',
        'risk_level',
        'custodian_bank',
        'launch_date',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'risk_level' => 'integer',
            'launch_date' => 'date',
        ];
    }

    /** @return BelongsTo<InvestmentManager, $this> */
    public function investmentManager()
    {
        return $this->belongsTo(InvestmentManager::class);
    }
}
