<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RiskProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiskAllocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/Suitability', [
            'riskProfiles' => RiskProfile::query()
                ->with('allocations')
                ->orderBy('min_score')
                ->paginate(10)
                ->withQueryString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'min_score' => ['required', 'integer'],
            'max_score' => ['required', 'integer', 'gte:min_score'],
            'allocations' => ['required', 'array', 'min:1'],
            'allocations.*.asset' => ['required', 'string', 'max:255'],
            'allocations.*.pct' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $riskProfile = RiskProfile::create($data);

        foreach ($data['allocations'] as $row) {
            $riskProfile->allocations()->create($row);
        }

        return redirect()->route('admin.suitability.index');
    }

    public function destroy(RiskProfile $riskProfile): RedirectResponse
    {
        $riskProfile->delete();

        return redirect()->route('admin.suitability.index');
    }

    public function update(Request $request, RiskProfile $riskProfile): RedirectResponse
    {
        $data = $request->validate([
            'allocations' => ['required', 'array', 'min:1'],
            'allocations.*.asset' => ['required', 'string', 'max:255'],
            'allocations.*.pct' => ['required', 'integer', 'min:0', 'max:100'],
        ]);

        $riskProfile->allocations()->delete();

        foreach ($data['allocations'] as $row) {
            $riskProfile->allocations()->create($row);
        }

        return redirect()->route('admin.suitability.index');
    }
}
