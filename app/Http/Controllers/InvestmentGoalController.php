<?php

namespace App\Http\Controllers;

use App\Models\InvestmentGoal;
use App\Services\InvestmentProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InvestmentGoalController extends Controller
{
    public function store(Request $request, InvestmentProfileService $service): RedirectResponse
    {
        $data = $this->validateGoal($request);

        $profile = $service->firstOrCreate($request->user());

        InvestmentGoal::create(['profile_id' => $profile->id, ...$data]);

        return redirect()->back();
    }

    public function update(Request $request, InvestmentGoal $goal): RedirectResponse
    {
        $this->authorizeGoal($request, $goal);

        $goal->update($this->validateGoal($request));

        return redirect()->back();
    }

    public function destroy(Request $request, InvestmentGoal $goal): RedirectResponse
    {
        $this->authorizeGoal($request, $goal);

        $goal->delete();

        return redirect()->back();
    }

    private function validateGoal(Request $request): array
    {
        return $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'target_amount' => ['required', 'numeric', 'min:0'],
            'target_date' => ['required', 'date'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
        ]);
    }

    private function authorizeGoal(Request $request, InvestmentGoal $goal): void
    {
        abort_if($goal->profile_id !== $request->user()->investmentProfile?->id, 403);
    }
}
