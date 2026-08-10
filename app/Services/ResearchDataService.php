<?php

namespace App\Services;

use App\Models\Stock;

class ResearchDataService
{
    public function __construct(
        private readonly StockMarketService $market,
        private readonly TechnicalIndicatorService $technical,
    ) {}

    public function stock(Stock $stock): ?array
    {
        $code = $this->market->symbol($stock);
        $chart = $this->market->chart($code, '1y');

        if (! $chart || empty($chart['history'])) {
            return null;
        }

        $fundamentals = $this->market->fundamentals($code);
        $technical = $this->technical->analyze($chart['history']);
        $news = $this->market->news($code, 5);
        $actions = $this->market->corporateActions($code);

        return [
            'stock' => [
                'code' => $stock->code,
                'name' => $stock->name,
                'sector' => $stock->sector,
                'industry' => $stock->industry,
            ],
            'quote' => [
                'price' => $chart['price'],
                'change' => $chart['change'],
                'changePercent' => $chart['changePercent'],
                'currency' => $chart['currency'],
                'volume' => $chart['volume'],
                'dayHigh' => $chart['dayHigh'],
                'dayLow' => $chart['dayLow'],
                'week52High' => $chart['week52High'],
                'week52Low' => $chart['week52Low'],
                'marketCap' => $chart['marketCap'],
                'asOf' => $chart['asOf'],
            ],
            'fundamentals' => $fundamentals,
            'technical' => $technical,
            'news' => $news,
            'dividends' => $actions['dividends'],
            'splits' => $actions['splits'],
        ];
    }
}
