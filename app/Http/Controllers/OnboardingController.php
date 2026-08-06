<?php

namespace App\Http\Controllers;

use App\Http\Requests\OnboardingRequest;
use App\Models\InvestmentQuestion;
use App\Services\GoalDetectionService;
use App\Services\InvestmentProfileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('Onboarding', $this->viewData($request));
    }

    public function saveStep(
        OnboardingRequest $request,
        InvestmentProfileService $service,
        int $step,
    ): Response {
        $service->saveStep($request->user(), $step, $request->validated());

        return Inertia::render('Onboarding', $this->viewData($request));
    }

    public function complete(
        Request $request,
        InvestmentProfileService $service,
    ): RedirectResponse {
        $service->complete($request->user());

        return redirect()->route('dashboard');
    }

    private function viewData(Request $request): array
    {
        $profile = $request->user()->investmentProfile;
        $questions = InvestmentQuestion::query()
            ->where('active', true)
            ->orderBy('order')
            ->with('options')
            ->get();

        return [
            'profile' => $profile,
            'questions' => $questions,
            'answers' => $profile?->answers->pluck('option_id', 'question_id') ?? [],
            'goals' => $profile?->goals ?? [],
            'suggestions' => $profile
                ? app(GoalDetectionService::class)->suggestionsFor($profile)
                : [],
        ];
    }
}
