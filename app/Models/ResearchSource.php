<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResearchSource extends Model
{
    protected $fillable = [
        'research_id',
        'claim_key',
        'data',
        'source',
        'period',
        'url',
        'as_of',
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'as_of' => 'datetime',
        ];
    }

    public function research(): BelongsTo
    {
        return $this->belongsTo(Research::class);
    }
}
