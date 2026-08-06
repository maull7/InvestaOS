<?php

namespace App\Http\Controllers;

use App\Models\Bond;
use App\Services\BondService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BondController extends Controller
{
    public function __construct(private readonly BondService $service) {}

    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $type = trim((string) $request->query('type', ''));

        $bonds = Bond::query()
            ->where('status', 'active')
            ->orderBy('code')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('code', 'like', "%{$q}%")
                ->orWhere('name', 'like', "%{$q}%")
                ->orWhere('issuer', 'like', "%{$q}%")))
            ->when($type !== '', fn ($query) => $query->where('type', $type))
            ->paginate(12)
            ->withQueryString();

        $bonds->getCollection()->transform(fn (Bond $bond) => array_merge($bond->toArray(), ['calc' => $this->service->enrich($bond)]));

        return Inertia::render('bonds/Index', [
            'bonds' => $bonds,
            'filters' => ['q' => $q, 'type' => $type],
        ]);
    }

    public function show(Bond $bond, Request $request): Response
    {
        return Inertia::render('bonds/Show', [
            'bond' => $bond,
            'calc' => $this->service->enrich($bond),
            'isWatched' => $request->user()->watchedBonds()->whereKey($bond->id)->exists(),
        ]);
    }

    public function toggleWatch(Bond $bond, Request $request): RedirectResponse
    {
        $request->user()->watchedBonds()->toggle($bond);

        return back();
    }
}
