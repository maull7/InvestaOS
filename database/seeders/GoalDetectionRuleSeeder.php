<?php

namespace Database\Seeders;

use App\Models\GoalDetectionRule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GoalDetectionRuleSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $rules = [
            [
                'goal_type' => 'emergency_fund',
                'condition' => 'emergency_gap',
                'threshold' => 3,
                'target_multiplier' => 6,
                'target_months' => 12,
                'priority' => 'high',
                'reason' => 'Your emergency fund covers less than 3 months of expenses.',
            ],
            [
                'goal_type' => 'debt_paydown',
                'condition' => 'debt_ratio',
                'threshold' => 0.3,
                'target_multiplier' => 1,
                'target_months' => 24,
                'priority' => 'high',
                'reason' => 'Your liabilities are more than 30% of your total assets.',
            ],
            [
                'goal_type' => 'wealth_growth',
                'condition' => 'disposable',
                'threshold' => 0,
                'target_multiplier' => 12,
                'target_months' => 60,
                'priority' => 'medium',
                'reason' => 'You have a positive monthly cash flow available for investing.',
            ],
            [
                'goal_type' => 'retirement',
                'condition' => 'age_retirement',
                'threshold' => 40,
                'target_multiplier' => 120,
                'target_months' => 240,
                'priority' => 'low',
                'reason' => 'Consider building a retirement nest egg as you approach retirement age.',
            ],
        ];

        foreach ($rules as $index => $rule) {
            GoalDetectionRule::firstOrCreate(
                ['condition' => $rule['condition']],
                [...$rule, 'order' => $index + 1],
            );
        }
    }
}
