<?php

namespace App\Http\Controllers;

use App\Services\StockMarketService;
use Inertia\Inertia;
use Inertia\Response;

class MarketDataController extends Controller
{
    public function __construct(private readonly StockMarketService $market) {}

    public function index(): Response
    {
        return Inertia::render('market-data/Index', [
            'rates' => $this->quotes([
                'USDIDR=X' => 'US Dollar',
                'EURIDR=X' => 'Euro',
                'GBPIDR=X' => 'British Pound',
                'SGDIDR=X' => 'Singapore Dollar',
                'JPYIDR=X' => 'Japanese Yen',
            ]),
            'indices' => $this->quotes([
                '^JKSE' => 'IHSG',
                '^KLSE' => 'FTSE Bursa Malaysia',
                '^GSPC' => 'S&P 500',
            ]),
        ]);
    }

    /** @param array<string, string> $symbols
     * @return list<array<string, mixed>>
     */
    private function quotes(array $symbols): array
    {
        $rows = [];
        foreach ($symbols as $symbol => $label) {
            $quote = $this->market->quote($symbol);
            if ($quote !== null) {
                $quote['label'] = $label;
                $rows[] = $quote;
            }
        }

        return $rows;
    }
}
