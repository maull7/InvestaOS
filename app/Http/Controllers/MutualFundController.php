<?php

namespace App\Http\Controllers;

use App\Models\InvestmentManager;
use App\Models\MutualFund;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MutualFundController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $type = trim((string) $request->query('type', ''));
        $manager = trim((string) $request->query('manager', ''));

        $funds = MutualFund::query()
            ->with('investmentManager:id,name,code')
            ->where('status', 'active')
            ->orderBy('name')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('code', 'like', "%{$q}%")
                ->orWhere('name', 'like', "%{$q}%")))
            ->when($type !== '', fn ($query) => $query->where('fund_type', $type))
            ->when($manager !== '', fn ($query) => $query->where('investment_manager_id', $manager))
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('mutual-funds/Index', [
            'funds' => $funds,
            'filters' => ['q' => $q, 'type' => $type, 'manager' => $manager],
            'managers' => InvestmentManager::where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function show(MutualFund $mutualFund): Response
    {
        $mutualFund->load('investmentManager');

        return Inertia::render('mutual-funds/Show', [
            'fund' => $mutualFund,
        ]);
    }
}
