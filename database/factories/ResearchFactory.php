<?php

namespace Database\Factories;

use App\Models\Research;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ResearchFactory extends Factory
{
    protected $model = Research::class;

    public function definition(): array
    {
        $category = fake()->randomElement(['stock', 'fund', 'bond', 'macro', 'sector', 'theme', 'economic_outlook']);
        $title = fake()->company().' — '.ucfirst($category).' Analysis';

        return [
            'category' => $category,
            'asset_type' => 'App\Models\Stock',
            'asset_id' => null,
            'asset_code' => fake()->randomElement(['BBCA', 'BBRI', 'BMRI', 'TLKM', 'ASII']),
            'title' => $title,
            'slug' => Str::slug($title.'-'.fake()->uuid()),
            'summary' => fake()->sentence(20),
            'content' => [
                'executive_summary' => fake()->paragraph(),
                'fundamental_analysis' => fake()->paragraph(),
                'technical_analysis' => fake()->paragraph(),
                'valuation' => fake()->paragraph(),
                'risk_analysis' => fake()->paragraph(),
                'conclusion' => fake()->paragraph(),
                'recommendation' => fake()->randomElement(['buy', 'hold', 'sell']),
                'outlook' => fake()->randomElement(['bullish', 'neutral', 'bearish']),
                'valuation_assessment' => fake()->randomElement(['undervalued', 'fair', 'overvalued']),
                'risk_level' => fake()->randomElement(['low', 'medium', 'high']),
                'confidence' => fake()->numberBetween(50, 95),
            ],
            'status' => fake()->randomElement(['draft', 'processing', 'completed', 'published', 'archived']),
            'source_type' => fake()->randomElement(['ai', 'rule']),
            'model' => fake()->randomElement([null, 'combo-kikir']),
            'confidence' => fake()->randomFloat(2, 50, 95),
            'created_by' => User::factory(),
            'parent_id' => null,
            'version' => 1,
            'published_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
