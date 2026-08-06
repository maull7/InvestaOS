<?php

namespace Database\Seeders;

use App\Models\RiskProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RiskProfileSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $profiles = [
            ['slug' => 'conservative', 'name' => 'Conservative', 'description' => 'Prefers capital preservation over growth.', 'min_score' => 4, 'max_score' => 7],
            ['slug' => 'moderate', 'name' => 'Moderate', 'description' => 'Balances safety with modest growth.', 'min_score' => 8, 'max_score' => 10],
            ['slug' => 'balanced', 'name' => 'Balanced', 'description' => 'Aims for steady growth with managed risk.', 'min_score' => 11, 'max_score' => 13],
            ['slug' => 'growth', 'name' => 'Growth', 'description' => 'Focuses on long-term growth, tolerates volatility.', 'min_score' => 14, 'max_score' => 16],
            ['slug' => 'aggressive', 'name' => 'Aggressive', 'description' => 'High growth appetite, accepts significant swings.', 'min_score' => 17, 'max_score' => 20],
        ];

        foreach ($profiles as $profile) {
            RiskProfile::firstOrCreate(['slug' => $profile['slug']], $profile);
        }
    }
}
