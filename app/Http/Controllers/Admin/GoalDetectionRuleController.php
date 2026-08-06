<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GoalDetectionRule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GoalDetectionRuleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/GoalRules', [
            'rules' => GoalDetectionRule::query()->orderBy('order')->paginate(10)->withQueryString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateRule($request);

        GoalDetectionRule::create($data);

        return redirect()->route('admin.goal-rules.index');
    }

    public function update(Request $request, GoalDetectionRule $rule): RedirectResponse
    {
        $rule->update($this->validateRule($request));

        return redirect()->route('admin.goal-rules.index');
    }

    public function destroy(GoalDetectionRule $rule): RedirectResponse
    {
        $rule->delete();

        return redirect()->route('admin.goal-rules.index');
    }

    private function validateRule(Request $request): array
    {
        return $request->validate([
            'goal_type' => ['required', 'string', 'max:255'],
            'condition' => ['required', Rule::in(['emergency_gap', 'debt_ratio', 'disposable', 'age_retirement'])],
            'threshold' => ['required', 'numeric'],
            'target_multiplier' => ['required', 'numeric', 'min:0'],
            'target_months' => ['required', 'integer', 'min:1'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'reason' => ['required', 'string'],
            'enabled' => ['boolean'],
            'order' => ['required', 'integer'],
        ]);
    }
}
