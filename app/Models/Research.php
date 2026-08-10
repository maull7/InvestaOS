<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Research extends Model
{
    protected $table = 'researches';

    protected $fillable = [
        'category',
        'asset_type',
        'asset_id',
        'asset_code',
        'title',
        'slug',
        'summary',
        'content',
        'status',
        'source_type',
        'model',
        'confidence',
        'created_by',
        'parent_id',
        'version',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'content' => 'array',
            'confidence' => 'decimal:2',
            'published_at' => 'datetime',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sources(): HasMany
    {
        return $this->hasMany(ResearchSource::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Research::class, 'parent_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(Research::class, 'parent_id');
    }
}
