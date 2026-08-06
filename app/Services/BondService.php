<?php

namespace App\Services;

use App\Models\Bond;
use Carbon\CarbonInterface;

class BondService
{
    public function enrich(Bond $bond): array
    {
        $coupon = $bond->coupon; // per tahun, dalam persen face
        $face = $bond->face_value ?? 1000;
        $freq = $bond->payment_frequency === 'annual' ? 1 : 2;
        $price = $bond->last_price; // persen dari nominal (100 = par)
        $yield = $bond->yield; // % nominal annual
        $maturity = $bond->maturity_date;
        $today = today();

        $years = $maturity ? max(abs($maturity->floatDiffInDays($today, false)) / 365.25, 0) : null;

        $couponPerPayment = $coupon !== null ? ($coupon / 100) * $face / $freq : null;
        $couponPerYear = $coupon !== null ? ($coupon / 100) * $face : null;
        $couponPerPaymentPct = $coupon !== null ? $coupon / $freq : null; // % face per bayar

        // YTM (tahunan, perkiraan) — prioritas: price > yield > par
        $ytm = null;
        $estimated = true;
        if ($yield !== null) {
            $ytm = $yield;
        } elseif ($price !== null && $coupon !== null && $years !== null && $years > 0) {
            $n = max($years, 0.01);
            $ytm = (($coupon + (100 - $price) / $n) / (($price + 100) / 2)) * 100;
        } elseif ($coupon !== null) {
            $ytm = $coupon;
        }

        if ($yield !== null || $price !== null) {
            $estimated = false;
        }

        $duration = $this->durationYears($coupon, $years, $ytm, $freq);

        // Accrued interest + clean/dirty
        $accrued = null;
        $dirty = null;
        $clean = $price ?? ($coupon !== null ? 100 : null);
        if ($coupon !== null && $maturity && $bond->issue_date && $freq > 0) {
            $lastCoupon = $this->lastCouponDate($maturity, $today, $freq);
            $periodDays = 365.25 / $freq;
            $days = $lastCoupon === null ? null : max($lastCoupon->diffInDays($today, false), 0);
            if ($days !== null && $couponPerPaymentPct !== null) {
                $accrued = $couponPerPaymentPct * ($days / $periodDays);
                $clean = $price ?? 100;
                $dirty = $clean + $accrued;
            }
        }

        $spread = ($coupon !== null && $bond->benchmark_yield !== null)
            ? $coupon - $bond->benchmark_yield
            : null;

        return [
            'yearsRemaining' => $years,
            'couponPerYear' => $couponPerYear,
            'couponValuePerPayment' => $couponPerPayment,
            'couponPerPayment' => $couponPerPaymentPct,
            'ytm' => $ytm,
            'estimated' => $estimated,
            'durationYears' => $duration,
            'accruedPct' => $accrued,
            'cleanPrice' => $clean,
            'dirtyPrice' => $dirty,
            'spread' => $spread,
            'paymentsPerYear' => $freq,
        ];
    }

    private function durationYears(?float $coupon, ?float $years, ?float $ytm, int $freq): ?float
    {
        if ($coupon === null || $years === null || $years <= 0) {
            return null;
        }

        // nominal annual -> effective annual (approximation)
        $yEff = ($ytm !== null && $ytm > 0)
            ? (1 + ($ytm / 100) / $freq) ** $freq - 1
            : 0;
        $cEff = (1 + ($coupon / 100) / $freq) ** $freq - 1;
        $T = $years;

        if ($yEff <= 0) {
            return $T;
        }

        return ((1 + $yEff) / $yEff)
            - ((1 + $yEff + $T * ($cEff - $yEff)) / ($yEff * (1 + $yEff) ** $T));
    }

    private function lastCouponDate(CarbonInterface $maturity, CarbonInterface $today, int $freq): ?CarbonInterface
    {
        $periodDays = 365.25 / $freq;
        $elapsed = abs($maturity->floatDiffInDays($today, false));

        if ($elapsed < 0) {
            return null;
        }

        $periods = (int) ceil($elapsed / $periodDays);

        return $maturity->copy()->subDays((int) round($periods * $periodDays));
    }
}
