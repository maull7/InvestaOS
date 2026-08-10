<?php

namespace Database\Factories;

use App\Models\MutualFund;
use Illuminate\Database\Eloquent\Factories\Factory;

class MutualFundFactory extends Factory
{
    protected $model = MutualFund::class;

    public function definition(): array
    {
        return [
            'investment_manager_id' => null,
            'code' => strtoupper(fake()->unique()->lexify('????')),
            'name' => fake()->company().' Fund',
            'fund_type' => fake()->randomElement(['equity', 'mixed', 'fixed_income', 'money_market']),
            'currency' => 'IDR',
            'risk_level' => fake()->numberBetween(1, 5),
            'custodian_bank' => fake()->randomElement(['BNI Custody', 'Mandiri Custody', 'CitiBank']),
            'launch_date' => fake()->dateTimeBetween('-10 years', '-1 year'),
            'status' => 'active',
        ];
    }
}
