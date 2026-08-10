<?php

namespace App\Http\Controllers;

use App\Models\Bond;
use App\Models\MutualFund;
use App\Models\Research;
use App\Models\Stock;
use App\Services\ResearchGenerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ResearchController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'category' => trim((string) $request->query('category', '')),
            'status' => trim((string) $request->query('status', '')),
        ];

        $query = Research::query()
            ->with('createdBy:id,name')
            ->latest('published_at')
            ->latest('created_at');

        if ($filters['q'] !== '') {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['q']}%")
                    ->orWhere('asset_code', 'like', "%{$filters['q']}%")
                    ->orWhere('summary', 'like', "%{$filters['q']}%");
            });
        }

        if ($filters['category'] !== '') {
            $query->where('category', $filters['category']);
        }

        if ($filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        $researches = $query->paginate(20)->withQueryString();

        return Inertia::render('research/Index', [
            'researches' => $researches,
            'filters' => $filters,
            'categories' => $this->categories(),
            'statuses' => $this->statuses(),
        ]);
    }

    public function show(Research $research): Response
    {
        $research->load(['createdBy:id,name', 'sources', 'parent', 'versions']);

        return Inertia::render('research/Show', [
            'research' => $research,
            'assetUrl' => $this->assetUrl($research),
        ]);
    }

    private function assetUrl(Research $research): ?string
    {
        $code = $research->asset_code;

        if ($code === null) {
            return null;
        }

        return match ($research->category) {
            'stock' => route('stocks.show', $code),
            'bond' => route('bonds.show', $code),
            'fund' => str_starts_with($code, '#') ? null : route('mutual-funds.show', $code),
            default => null,
        };
    }

    public function create(Request $request): Response
    {
        return Inertia::render('research/Generate', [
            'categories' => [
                ['value' => 'stock', 'label' => 'Stock Analysis'],
            ],
        ]);
    }

    public function generate(Request $request, ResearchGenerationService $service): RedirectResponse
    {
        $data = $request->validate([
            'category' => ['required', Rule::in(['stock', 'bond', 'fund'])],
            'asset_type' => ['required', Rule::in(['stock', 'bond', 'fund'])],
            'asset_id' => ['nullable', 'integer'],
            'asset_code' => ['nullable', 'string'],
        ]);

        $research = match ($data['asset_type']) {
            'stock' => $this->generateStock($data, $request, $service),
            'bond' => $this->generateBond($data, $request, $service),
            default => $this->generateFund($data, $request, $service),
        };

        return redirect()->route('research.show', $research);
    }

    private function generateStock(array $data, Request $request, ResearchGenerationService $service): Research
    {
        $stock = $data['asset_id']
            ? Stock::findOrFail($data['asset_id'])
            : Stock::where('code', $data['asset_code'])->firstOrFail();

        return $service->generateStockAnalysis($stock, $request->user()->id);
    }

    private function generateBond(array $data, Request $request, ResearchGenerationService $service): Research
    {
        $bond = Bond::findOrFail($data['asset_id']);

        return $service->generateBondAnalysis($bond, $request->user()->id);
    }

    private function generateFund(array $data, Request $request, ResearchGenerationService $service): Research
    {
        $fund = MutualFund::findOrFail($data['asset_id']);

        return $service->generateFundAnalysis($fund, $request->user()->id);
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function categories(): array
    {
        return [
            ['value' => '', 'label' => 'All Categories'],
            ['value' => 'stock', 'label' => 'Stock Analysis'],
            ['value' => 'fund', 'label' => 'Fund Analysis'],
            ['value' => 'bond', 'label' => 'Bond Analysis'],
            ['value' => 'macro', 'label' => 'Macro Analysis'],
            ['value' => 'sector', 'label' => 'Sector Analysis'],
            ['value' => 'theme', 'label' => 'Theme Analysis'],
            ['value' => 'economic_outlook', 'label' => 'Economic Outlook'],
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statuses(): array
    {
        return [
            ['value' => '', 'label' => 'All Status'],
            ['value' => 'draft', 'label' => 'Draft'],
            ['value' => 'processing', 'label' => 'Processing'],
            ['value' => 'completed', 'label' => 'Completed'],
            ['value' => 'published', 'label' => 'Published'],
            ['value' => 'archived', 'label' => 'Archived'],
        ];
    }
}
