<?php

namespace App\Services;

use App\Models\InvestmentAnswer;
use App\Models\InvestmentGoal;
use App\Models\InvestmentProfile;
use App\Models\User;

class InvestmentProfileService
{
    public function firstOrCreate(User $user): InvestmentProfile
    {
        return InvestmentProfile::firstOrCreate(['user_id' => $user->id]);
    }

    public function saveStep(User $user, int $step, array $data): InvestmentProfile
    {
        $profile = $this->firstOrCreate($user);

        match ($step) {
            1 => $this->savePersonal($profile, $data),
            2 => $this->saveAnswers($profile, $data['answers'] ?? []),
            3 => app(RiskScoringService::class)->scoreFor($profile),
            4 => $this->saveFinancial($profile, $data),
            5 => $this->saveGoals($profile, $data['goals'] ?? []),
            default => abort(404),
        };

        $advance = (bool) ($data['advance'] ?? true);

        if ($step < 6 && $advance) {
            $profile->forceFill([
                'current_step' => max((int) $profile->current_step, $step + 1),
            ])->save();
        }

        return $profile->fresh();
    }

    public function complete(User $user): InvestmentProfile
    {
        $profile = $this->firstOrCreate($user);

        $profile->forceFill([
            'status' => 'completed',
            'current_step' => 6,
        ])->save();

        return $profile->fresh();
    }

    private function savePersonal(InvestmentProfile $profile, array $data): void
    {
        $profile->update([
            'full_name' => $data['full_name'],
            'date_of_birth' => $data['date_of_birth'],
            'gender' => $data['gender'],
            'occupation' => $data['occupation'],
            'company' => $data['company'] ?? null,
        ]);
    }

    private function saveAnswers(InvestmentProfile $profile, array $answers): void
    {
        foreach ($answers as $questionId => $optionId) {
            InvestmentAnswer::updateOrCreate(
                ['profile_id' => $profile->id, 'question_id' => $questionId],
                ['option_id' => $optionId],
            );
        }
    }

    private function saveFinancial(InvestmentProfile $profile, array $data): void
    {
        $profile->update([
            'annual_income' => $data['annual_income'],
            'monthly_expenses' => $data['monthly_expenses'],
            'total_assets' => $data['total_assets'],
            'total_liabilities' => $data['total_liabilities'],
            'emergency_fund' => $data['emergency_fund'],
        ]);
    }

    private function saveGoals(InvestmentProfile $profile, array $goals): void
    {
        foreach ($goals as $goal) {
            InvestmentGoal::create([
                'profile_id' => $profile->id,
                'type' => $goal['type'],
                'target_amount' => $goal['target_amount'],
                'target_date' => $goal['target_date'],
                'priority' => $goal['priority'],
            ]);
        }
    }
}
