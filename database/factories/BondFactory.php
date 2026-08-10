<?php

namespace Database\Factories;

use App\Models\Bond;
use Illuminate\Database\Eloquent\Factories\Factory;

class BondFactory extends Factory
{
    protected $model = Bond::class;

    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->lexify('????')).'0001',
            'name' => fake()->company().' Bond',
            'type' => fake()->randomElement(['government_bond', 'corporate_bond', 'sukuk']),
            'issuer' => fake()->company(),
            'coupon' => fake()->randomFloat(2, 5, 9),
            'maturity_date' => fake()->dateTimeBetween('+2 years', '+15 years'),
            'status' => 'active',
            'issue_date' => fake()->dateTimeBetween('-5 years', '-1 year'),
            'face_value' => 1000,
            'payment_frequency' => fake()->randomElement(['annual', 'semiannual']),
            'last_price' => fake()->randomFloat(2, 90, 110),
            'yield' => fake()->randomFloat(2, 5, 10),
            'benchmark_yield' => fake()->randomFloat(2, 4, 8),
            'benchmark_label' => 'SBN 10y',
            'currency' => 'IDR',
        ];
    }
}
