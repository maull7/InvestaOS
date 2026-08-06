<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string|null $description
 * @property int $min_score
 * @property int $max_score
 * @property-read Collection<int, RiskAllocation> $allocations
 */
#[Fillable(['slug', 'name', 'description', 'min_score', 'max_score'])]
class RiskProfile extends Model
{
    protected static function booted(): void
    {
        static::creating(function (RiskProfile $profile) {
            $profile->slug = self::uniqueSlug($profile->name);
        });

        static::updating(function (RiskProfile $profile) {
            $profile->slug = self::uniqueSlug($profile->name, $profile->id);
        });
    }

    private static function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'risk-profile';
        $slug = $base;
        $i = 2;

        while (static::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }

    /** @return HasMany<InvestmentProfile, $this> */
    public function profiles(): HasMany
    {
        return $this->hasMany(InvestmentProfile::class);
    }

    /** @return HasMany<RiskAllocation, $this> */
    public function allocations(): HasMany
    {
        return $this->hasMany(RiskAllocation::class);
    }
}
