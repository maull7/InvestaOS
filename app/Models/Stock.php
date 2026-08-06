<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Stock extends Model
{
    protected $fillable = [
        'code',
        'name',
        'sector',
        'industry',
        'listing_board',
        'ipo_date',
        'website',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'ipo_date' => 'date',
        ];
    }

    /** @return BelongsToMany<User, $this> */
    public function watchedBy()
    {
        return $this->belongsToMany(User::class, 'watchlists')->withTimestamps();
    }
}
