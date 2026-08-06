<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestmentManager extends Model
{
    protected $fillable = [
        'name',
        'code',
        'website',
        'email',
        'phone',
        'address',
        'status',
    ];

    /** @return HasMany<MutualFund, $this> */
    public function mutualFunds()
    {
        return $this->hasMany(MutualFund::class);
    }
}
