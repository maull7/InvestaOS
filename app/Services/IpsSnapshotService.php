<?php

namespace App\Services;

use App\Contracts\IpsWriter;
use App\Models\InvestmentPolicyStatement;
use App\Models\InvestmentProfile;

/**
 * Persists rule-generated IPS content as snapshot rows and manages
 * document lifecycle (draft -> final -> superseded).
 */
class IpsSnapshotService
{
    /**
     * @param  array{language: string, objective?: ?string, benchmark?: string,
     *                rebalancing_policy?: string, review_schedule?: string,
     *                restrictions?: string[]}  $options
     */
    public function createFromProfile(InvestmentProfile $profile, array $options): InvestmentPolicyStatement
    {
        $this->supersedeActive($profile);

        $doc = app(IpsGenerationService::class)->build($profile, $options);

        $ips = InvestmentPolicyStatement::create([
            'profile_id' => $profile->id,
            'status' => 'draft',
            'written_by' => app(IpsWriter::class)->label(),
            'language' => $options['language'],
            'objective' => $doc['investment_objective'],
            'risk_profile_id' => $profile->risk_profile_id,
            'risk_score' => $profile->risk_score,
            'risk_tolerance' => $doc['risk_tolerance'],
            'time_horizon' => $doc['time_horizon'],
            'liquidity_requirement' => $doc['liquidity_requirement'],
            'benchmark' => $doc['benchmark'],
            'tax_note' => $doc['tax_consideration'],
            'rebalancing_policy' => $doc['rebalancing_policy'],
            'review_schedule' => $doc['review_schedule'],
            'generated_at' => now(),
        ]);

        foreach ($doc['asset_allocation'] as $row) {
            $ips->allocations()->create($row);
        }

        foreach ($doc['investment_goals'] as $goal) {
            $ips->goals()->create($goal);
        }

        foreach ($doc['investment_constraints'] as $constraint) {
            $ips->restrictions()->create(['content' => $constraint]);
        }

        return $ips->fresh();
    }

    public function finalize(InvestmentPolicyStatement $ips): InvestmentPolicyStatement
    {
        $ips->forceFill([
            'status' => 'final',
            'declared_at' => now(),
        ])->save();

        return $ips->fresh();
    }

    public function supersedeActive(InvestmentProfile $profile): void
    {
        InvestmentPolicyStatement::query()
            ->where('profile_id', $profile->id)
            ->whereIn('status', ['draft', 'final'])
            ->update(['status' => 'superseded']);
    }
}
