<?php

namespace Database\Factories;

use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockFactory extends Factory
{
    protected $model = Stock::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->lexify('????')),
            'name' => fake()->company(),
            'sector' => fake()->randomElement(['Banking', 'Technology', 'Energy', 'Consumer', 'Healthcare', 'Property']),
            'industry' => fake()->randomElement(['Banks', 'Software', 'Oil & Gas', 'Retail', 'Pharmaceuticals', 'Real Estate']),
            'listing_board' => fake()->randomElement(['Main Board', 'Development Board', 'Acceleration Board']),
            'ipo_date' => fake()->dateTimeBetween('-10 years', '-1 year'),
            'website' => fake()->optional()->url(),
            'status' => 'active',
        ];
    }
}
