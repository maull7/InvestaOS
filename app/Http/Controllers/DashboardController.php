<?php

namespace App\Http\Controllers;

use App\Models\Bond;
use App\Models\Research;
use App\Models\Stock;
use App\Services\BondService;
use App\Services\GoalDetectionService;
use App\Services\StockMarketService;
use App\Services\SuitabilityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $latestResearch = Research::with('createdBy:id,name')
            ->where('status', 'published')
            ->latest('published_at')
            ->limit(3)
            ->get();

        if ($request->user()->isAdmin()) {
            return Inertia::render('dashboard', ['latestResearch' => $latestResearch]);
        }

        $profile = $request->user()->investmentProfile;
        $suitability = app(SuitabilityService::class)->suitableAssets($profile);

        $watchlist = $request->user()
            ->watchedStocks()
            ->orderBy('code')
            ->get()
            ->map(function (Stock $stock) {
                $quote = app(StockMarketService::class)->chart($stock, '1mo');

                return [
                    'code' => $stock->code,
                    'name' => $stock->name,
                    'quote' => $quote,
                ];
            })
            ->values();

        $bondWatchlist = $request->user()
            ->watchedBonds()
            ->orderBy('code')
            ->get()
            ->map(function (Bond $bond) {
                return [
                    'bond' => $bond,
                    'calc' => app(BondService::class)->enrich($bond),
                ];
            })
            ->values();

        return Inertia::render('investor/Dashboard', [
            'profile' => $profile,
            'goals' => $profile?->goals ?? [],
            'allocations' => $suitability['allocations'],
            'watchlist' => $watchlist,
            'bondWatchlist' => $bondWatchlist,
            'latestResearch' => $latestResearch,
        ]);
    }

    public function planning(Request $request): Response
    {
        $profile = $request->user()->investmentProfile;
        $suitability = app(SuitabilityService::class)->suitableAssets($profile);
        $suggestions = app(GoalDetectionService::class)->suggestionsFor($profile);

        return Inertia::render('investor/Planning', [
            'profile' => $profile,
            'goals' => $profile?->goals ?? [],
            'allocations' => $suitability['allocations'],
            'suggestions' => $suggestions,
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('investor/Profile', [
            'profile' => $request->user()->investmentProfile,
        ]);
    }
}
