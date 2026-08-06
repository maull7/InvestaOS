<?php

namespace App\Http\Controllers;

use App\Models\InvestmentManager;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvestmentManagerController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));

        $managers = InvestmentManager::query()
            ->withCount('mutualFunds')
            ->where('status', 'active')
            ->orderBy('name')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('name', 'like', "%{$q}%")
                ->orWhere('code', 'like', "%{$q}%")))
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('investment-managers/Index', [
            'managers' => $managers,
            'filters' => ['q' => $q],
        ]);
    }

    public function show(InvestmentManager $investmentManager): Response
    {
        return Inertia::render('investment-managers/Show', [
            'manager' => $investmentManager,
            'funds' => $investmentManager->mutualFunds()->where('status', 'active')->orderBy('name')->get(),
        ]);
    }
}
