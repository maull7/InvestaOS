<?php

namespace Database\Seeders;

use App\Models\RiskAllocation;
use App\Models\RiskProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RiskAllocationSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $allocations = [
            'conservative' => [
                ['asset' => 'Bonds', 'pct' => 55],
                ['asset' => 'Stocks', 'pct' => 20],
                ['asset' => 'Cash', 'pct' => 20],
                ['asset' => 'Real Estate', 'pct' => 5],
            ],
            'moderate' => [
                ['asset' => 'Bonds', 'pct' => 45],
                ['asset' => 'Stocks', 'pct' => 35],
                ['asset' => 'Cash', 'pct' => 10],
                ['asset' => 'Real Estate', 'pct' => 10],
            ],
            'balanced' => [
                ['asset' => 'Stocks', 'pct' => 50],
                ['asset' => 'Bonds', 'pct' => 30],
                ['asset' => 'Cash', 'pct' => 10],
                ['asset' => 'Real Estate', 'pct' => 10],
            ],
            'growth' => [
                ['asset' => 'Stocks', 'pct' => 65],
                ['asset' => 'Bonds', 'pct' => 20],
                ['asset' => 'Real Estate', 'pct' => 10],
                ['asset' => 'Cash', 'pct' => 5],
            ],
            'aggressive' => [
                ['asset' => 'Stocks', 'pct' => 80],
                ['asset' => 'Bonds', 'pct' => 10],
                ['asset' => 'Real Estate', 'pct' => 5],
                ['asset' => 'Cash', 'pct' => 5],
            ],
        ];

        foreach ($allocations as $slug => $rows) {
            $risk = RiskProfile::where('slug', $slug)->first();

            if (! $risk) {
                continue;
            }

            $risk->allocations()->delete();

            foreach ($rows as $row) {
                RiskAllocation::create([
                    'risk_profile_id' => $risk->id,
                    'asset' => $row['asset'],
                    'pct' => $row['pct'],
                ]);
            }
        }
    }
}
