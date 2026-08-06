<?php

namespace App\Services;

use App\Models\GoalDetectionRule;
use App\Models\InvestmentProfile;
use Carbon\Carbon;

class GoalDetectionService
{
    /**
     * Derive suggested investment goals from an investor's financial profile
     * using the rule set stored in the database.
     *
     * @return array<int, array{goal_type: string, target_amount: float, target_date: string, priority: string, reason: string}>
     */
    public function suggestionsFor(InvestmentProfile $profile): array
    {
        $rules = GoalDetectionRule::query()
            ->where('enabled', true)
            ->orderBy('order')
            ->get();

        if ($rules->isEmpty()) {
            return [];
        }

        $existingTypes = $profile->goals->pluck('type')->all();

        $suggestions = [];

        foreach ($rules as $rule) {
            if (in_array($rule->goal_type, $existingTypes, true)) {
                continue;
            }

            $suggestion = match ($rule->condition) {
                'emergency_gap' => $this->emergencyGap($profile, $rule),
                'debt_ratio' => $this->debtRatio($profile, $rule),
                'disposable' => $this->disposable($profile, $rule),
                'age_retirement' => $this->ageRetirement($profile, $rule),
                default => null,
            };

            if ($suggestion) {
                $suggestions[] = $suggestion;
            }
        }

        return $suggestions;
    }

    private function emergencyGap(InvestmentProfile $profile, GoalDetectionRule $rule): ?array
    {
        $expenses = (float) $profile->monthly_expenses;
        $emergency = (float) $profile->emergency_fund;

        if ($expenses <= 0 || $emergency >= (float) $rule->threshold * $expenses) {
            return null;
        }

        return $this->build($rule, (float) $rule->target_multiplier * $expenses);
    }

    private function debtRatio(InvestmentProfile $profile, GoalDetectionRule $rule): ?array
    {
        $assets = (float) $profile->total_assets;
        $liabilities = (float) $profile->total_liabilities;

        if ($assets <= 0 || $liabilities <= (float) $rule->threshold * $assets) {
            return null;
        }

        return $this->build($rule, (float) $rule->target_multiplier * $liabilities);
    }

    private function disposable(InvestmentProfile $profile, GoalDetectionRule $rule): ?array
    {
        $income = (float) $profile->annual_income;
        $expenses = (float) $profile->monthly_expenses;
        $disposable = ($income / 12) - $expenses;

        if ($disposable <= 0) {
            return null;
        }

        return $this->build($rule, (float) $rule->target_multiplier * $disposable);
    }

    private function ageRetirement(InvestmentProfile $profile, GoalDetectionRule $rule): ?array
    {
        if (! $profile->date_of_birth) {
            return null;
        }

        $age = Carbon::parse($profile->date_of_birth)->age;

        if ($age <= (float) $rule->threshold) {
            return null;
        }

        $income = (float) $profile->annual_income;
        $expenses = (float) $profile->monthly_expenses;
        $disposable = max(0, ($income / 12) - $expenses);

        return $this->build($rule, (float) $rule->target_multiplier * $disposable);
    }

    private function build(GoalDetectionRule $rule, float $amount): array
    {
        return [
            'goal_type' => $rule->goal_type,
            'target_amount' => round(max(0, $amount), 2),
            'target_date' => Carbon::now()->addMonths((int) $rule->target_months)->format('Y-m-d'),
            'priority' => $rule->priority,
            'reason' => $rule->reason,
        ];
    }
}
