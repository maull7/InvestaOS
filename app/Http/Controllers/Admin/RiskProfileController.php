<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RiskProfileRequest;
use App\Models\RiskProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RiskProfileController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/RiskProfiles', [
            'riskProfiles' => RiskProfile::query()->orderBy('min_score')->paginate(10)->withQueryString(),
        ]);
    }

    public function store(RiskProfileRequest $request): RedirectResponse
    {
        RiskProfile::create($request->validated());

        return redirect()->route('admin.risk-profiles.index');
    }

    public function update(
        RiskProfileRequest $request,
        RiskProfile $riskProfile,
    ): RedirectResponse {
        $riskProfile->update($request->validated());

        return redirect()->route('admin.risk-profiles.index');
    }

    public function destroy(RiskProfile $riskProfile): RedirectResponse
    {
        $riskProfile->delete();

        return redirect()->route('admin.risk-profiles.index');
    }
}
