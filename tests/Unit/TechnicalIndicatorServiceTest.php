<?php

namespace Tests\Unit;

use App\Services\TechnicalIndicatorService;
use PHPUnit\Framework\TestCase;

class TechnicalIndicatorServiceTest extends TestCase
{
    private TechnicalIndicatorService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TechnicalIndicatorService;
    }

    public function test_sma_calculates_correctly(): void
    {
        $prices = [10, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        $result = $this->service->sma($prices, 5);

        $this->assertCount(6, $result);
        $this->assertEquals(12.8, $result[0]);
        $this->assertEquals(14.0, $result[1]);
        $this->assertEquals(15.0, $result[2]);
    }

    public function test_ema_calculates_correctly(): void
    {
        $prices = [22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29];
        $result = $this->service->ema($prices, 5);

        $this->assertNotEmpty($result);
        $this->assertCount(6, $result);
    }

    public function test_rsi_returns_null_for_insufficient_data(): void
    {
        $prices = [10, 12, 13];
        $result = $this->service->rsi($prices, 14);

        $this->assertNull($result);
    }

    public function test_rsi_calculates_for_valid_data(): void
    {
        $prices = array_fill(0, 20, 100);
        $prices[] = 110;
        $prices[] = 105;
        $prices[] = 108;

        $result = $this->service->rsi($prices, 14);

        $this->assertIsFloat($result);
        $this->assertGreaterThanOrEqual(0, $result);
        $this->assertLessThanOrEqual(100, $result);
    }

    public function test_macd_returns_null_for_insufficient_data(): void
    {
        $prices = array_fill(0, 20, 100);
        $result = $this->service->macd($prices);

        $this->assertNull($result);
    }

    public function test_macd_calculates_for_valid_data(): void
    {
        $prices = range(100, 150);

        $result = $this->service->macd($prices);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('macd', $result);
        $this->assertArrayHasKey('signal', $result);
        $this->assertArrayHasKey('histogram', $result);
    }

    public function test_support_resistance_calculates_correctly(): void
    {
        $history = [
            ['l' => 95, 'h' => 105],
            ['l' => 94, 'h' => 106],
            ['l' => 96, 'h' => 104],
            ['l' => 93, 'h' => 107],
            ['l' => 97, 'h' => 103],
        ];

        $result = $this->service->supportResistance($history, 5);

        $this->assertEquals(93, $result['support']);
        $this->assertEquals(107, $result['resistance']);
    }

    public function test_trend_returns_null_for_insufficient_data(): void
    {
        $prices = array_fill(0, 10, 100);
        $result = $this->service->trend($prices);

        $this->assertNull($result);
    }

    public function test_trend_detects_uptrend(): void
    {
        $prices = range(100, 130);

        $result = $this->service->trend($prices);

        $this->assertEquals('uptrend', $result);
    }

    public function test_trend_detects_downtrend(): void
    {
        $prices = range(130, 100);

        $result = $this->service->trend($prices);

        $this->assertEquals('downtrend', $result);
    }

    public function test_analyze_returns_complete_structure(): void
    {
        $history = [];
        for ($i = 0; $i < 60; $i++) {
            $history[] = [
                't' => time() - (60 - $i) * 86400,
                'o' => 100 + $i,
                'h' => 102 + $i,
                'l' => 98 + $i,
                'c' => 100 + $i,
                'v' => 1000000,
            ];
        }

        $result = $this->service->analyze($history);

        $this->assertArrayHasKey('price', $result);
        $this->assertArrayHasKey('sma20', $result);
        $this->assertArrayHasKey('sma50', $result);
        $this->assertArrayHasKey('ema12', $result);
        $this->assertArrayHasKey('rsi', $result);
        $this->assertArrayHasKey('macd', $result);
        $this->assertArrayHasKey('support', $result);
        $this->assertArrayHasKey('resistance', $result);
        $this->assertArrayHasKey('trend', $result);

        $this->assertIsNumeric($result['price']);
        $this->assertIsNumeric($result['sma20']);
        $this->assertIsNumeric($result['sma50']);
    }
}
