<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Services\StockMarketService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function __construct(private readonly StockMarketService $market) {}

    public function index(Request $request): Response
    {
        $filters = $this->filters($request);

        $stocks = Stock::query()
            ->where('status', 'active')
            ->orderBy('code')
            ->when($filters['q'] !== '', fn ($q) => $q->where(fn ($w) => $w
                ->where('code', 'like', "%{$filters['q']}%")
                ->orWhere('name', 'like', "%{$filters['q']}%")))
            ->when($filters['sector'] !== '', fn ($q) => $q->where('sector', $filters['sector']))
            ->when($filters['board'] !== '', fn ($q) => $q->where('listing_board', $filters['board']))
            ->paginate(12)
            ->withQueryString();

        $stocks->getCollection()->transform(fn (Stock $stock) => $this->cardPayload($stock));

        return Inertia::render('stocks/Index', [
            'stocks' => $stocks,
            'filters' => $filters,
            'sectors' => $this->distinct('sector'),
            'boards' => $this->distinct('listing_board'),
        ]);
    }

    public function show(Stock $stock, Request $request): Response
    {
        $range = (string) $request->query('range', '1y');
        $symbol = $this->market->symbol($stock);

        return Inertia::render('stocks/Show', [
            'stock' => $stock,
            'quote' => $this->market->chart($symbol, $range),
            'fundamentals' => $this->market->fundamentals($symbol),
            'news' => $this->market->news($symbol),
            'actions' => $this->market->corporateActions($symbol),
            'range' => $range,
            'isWatched' => $request->user()->watchedStocks()->whereKey($stock->id)->exists(),
        ]);
    }

    public function toggleWatch(Stock $stock, Request $request): RedirectResponse
    {
        $request->user()->watchedStocks()->toggle($stock); // per-user list, limit rows DB

        return back();
    }

    public function compare(Request $request): Response
    {
        $codes = array_slice(array_values(array_unique(array_filter(
            preg_split('/[,\s]+/', (string) $request->query('codes'))
        ))), 0, 3);
        $range = (string) $request->query('range', '1y');

        $rows = collect($codes)
            ->map(fn (string $code) => Stock::where('code', $code)->where('status', 'active')->first())
            ->filter()
            ->values()
            ->map(fn (Stock $stock) => [
                'stock' => $stock,
                'quote' => $this->market->chart($stock, $range),
            ])
            ->values();

        return Inertia::render('stocks/Compare', [
            'rows' => $rows,
            'range' => $range,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '') {
            return response()->json([]);
        }

        $stocks = Stock::where('status', 'active')
            ->where(fn ($w) => $w
                ->where('code', 'like', "%{$q}%")
                ->orWhere('name', 'like', "%{$q}%"))
            ->orderBy('code')
            ->limit(8)
            ->get(['code', 'name', 'listing_board']);

        return response()->json($stocks);
    }

    public function pdf(Stock $stock): \Symfony\Component\HttpFoundation\Response
    {
        $quote = $this->market->chart($stock, '1y');

        return Pdf::loadView('pdf.stock', ['stock' => $stock, 'quote' => $quote])
            ->download("{$stock->code}.pdf");
    }

    private function cardPayload(Stock $stock): array
    {
        $quote = $this->market->chart($stock, '1mo');

        return [
            'code' => $stock->code,
            'name' => $stock->name,
            'sector' => $stock->sector,
            'listing_board' => $stock->listing_board,
            'spark' => $quote ? [
                'price' => $quote['price'],
                'change' => $quote['change'],
                'changePercent' => $quote['changePercent'],
                'currency' => $quote['currency'],
                'volume' => $quote['volume'],
                'week52Low' => $quote['week52Low'],
                'week52High' => $quote['week52High'],
                'history' => array_map(fn ($b) => ['t' => $b['t'], 'c' => $b['c']], $quote['history']),
            ] : null,
        ];
    }

    private function filters(Request $request): array
    {
        return [
            'q' => trim((string) $request->query('q', '')),
            'sector' => trim((string) $request->query('sector', '')),
            'board' => trim((string) $request->query('board', '')),
        ];
    }

    /** @return array<int, string> */
    private function distinct(string $column): array
    {
        return Stock::where('status', 'active')
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->distinct()
            ->pluck($column)
            ->sort()
            ->values()
            ->all();
    }
}
