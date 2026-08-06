<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Bond extends Model
{
    protected $fillable = [
        'code',
        'name',
        'type',
        'issuer',
        'coupon',
        'maturity_date',
        'status',
        'issue_date',
        'face_value',
        'payment_frequency',
        'last_price',
        'yield',
        'benchmark_yield',
        'benchmark_label',
        'currency',
    ];

    protected function casts(): array
    {
        return [
            'coupon' => 'float',
            'face_value' => 'float',
            'last_price' => 'float',
            'yield' => 'float',
            'benchmark_yield' => 'float',
            'issue_date' => 'date',
            'maturity_date' => 'date',
        ];
    }

    /** @return BelongsToMany<User, $this> */
    public function watchedBy()
    {
        return $this->belongsToMany(User::class, 'bond_watchlists')->withTimestamps();
    }
}
