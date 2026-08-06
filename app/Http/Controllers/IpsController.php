<?php

namespace App\Http\Controllers;

use App\Models\InvestmentPolicyStatement;
use App\Services\IpsDocumentService;
use App\Services\IpsPdfService;
use App\Services\IpsSnapshotService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class IpsController extends Controller
{
    public function index(Request $request): Response
    {
        $profile = $request->user()->investmentProfile;

        return Inertia::render('investor/Policy', [
            'statements' => $profile?->policyStatements()->with(['allocations', 'goals', 'restrictions'])->latest()->get() ?? [],
            'riskProfile' => $profile?->riskProfile,
        ]);
    }

    public function show(Request $request, InvestmentPolicyStatement $ips, IpsDocumentService $service): Response
    {
        $this->authorizeIps($request, $ips);

        return Inertia::render('investor/PolicyItem', [
            'statement' => [
                'id' => $ips->id,
                'status' => $ips->status,
                'language' => $ips->language,
                'objective' => $ips->objective,
                'generated_at' => $ips->generated_at?->format('Y-m-d'),
                'declared_at' => $ips->declared_at?->format('Y-m-d'),
            ],
            'document' => $service->sections($ips),
        ]);
    }

    public function finalize(Request $request, InvestmentPolicyStatement $ips, IpsSnapshotService $service): RedirectResponse
    {
        $this->authorizeIps($request, $ips);

        $service->finalize($ips);

        return redirect()->route('policy.show', $ips);
    }

    public function download(Request $request, InvestmentPolicyStatement $ips, IpsPdfService $service): HttpResponse
    {
        $this->authorizeIps($request, $ips);

        return $service->download($ips);
    }

    public function store(Request $request, IpsSnapshotService $service): RedirectResponse
    {
        $data = $this->validateOptions($request);

        $service->createFromProfile($request->user()->investmentProfile, $data);

        return redirect()->route('policy.index');
    }

    public function regenerate(Request $request, InvestmentPolicyStatement $ips, IpsSnapshotService $service): RedirectResponse
    {
        $this->authorizeIps($request, $ips);

        $service->createFromProfile($request->user()->investmentProfile, [
            'language' => $ips->language,
            'objective' => $ips->objective,
            'benchmark' => $ips->benchmark,
            'rebalancing_policy' => $ips->rebalancing_policy,
            'review_schedule' => $ips->review_schedule,
            'restrictions' => $ips->restrictions->pluck('content')->all(),
        ]);

        return redirect()->route('policy.index');
    }

    public function destroy(Request $request, InvestmentPolicyStatement $ips): RedirectResponse
    {
        $this->authorizeIps($request, $ips);

        $ips->delete();

        return redirect()->route('policy.index');
    }

    /**
     * @return array{language: string, objective?: string|null, benchmark?: string,
     *                rebalancing_policy?: string, review_schedule?: string,
     *                restrictions?: array<string>}
     */
    private function validateOptions(Request $request): array
    {
        return $request->validate([
            'language' => ['required', Rule::in(['en', 'id'])],
            'objective' => ['nullable', 'string', 'max:255'],
            'benchmark' => ['nullable', 'string', 'max:255'],
            'rebalancing_policy' => ['nullable', 'string', 'max:255'],
            'review_schedule' => ['nullable', 'string', 'max:255'],
            'restrictions' => ['array'],
            'restrictions.*' => ['string', 'max:255'],
        ]);
    }

    private function authorizeIps(Request $request, InvestmentPolicyStatement $ips): void
    {
        abort_if($ips->profile_id !== $request->user()->investmentProfile?->id, 403);
    }
}
