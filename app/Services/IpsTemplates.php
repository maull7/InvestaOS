<?php

namespace App\Services;

/**
 * Static template copy for IPS documents, keyed by language.
 * Kept outside the generator so the generator stays pure rule logic
 * and a future AI writer can replace both.
 */
class IpsTemplates
{
    public static function objectiveFor(string $riskSlug, string $lang): string
    {
        $map = [
            'conservative' => ['en' => 'Capital Preservation', 'id' => 'Pelestarian Modal'],
            'moderate' => ['en' => 'Income Generation', 'id' => 'Pendapatan Stabil'],
            'balanced' => ['en' => 'Balanced Growth', 'id' => 'Pertumbuhan Seimbang'],
            'growth' => ['en' => 'Wealth Growth', 'id' => 'Pertumbuhan Kekayaan'],
            'aggressive' => ['en' => 'Aggressive Growth', 'id' => 'Pertumbuhan Agresif'],
        ];

        return $map[$riskSlug][$lang] ?? $map['balanced'][$lang];
    }

    public static function horizonFor(int $years, string $lang): string
    {
        if ($years < 3) {
            return ['en' => 'Short Term (under 3 years)', 'id' => 'Jangka Pendek (di bawah 3 tahun)'][$lang];
        }

        if ($years <= 7) {
            return ['en' => 'Medium Term (3 - 7 years)', 'id' => 'Jangka Menengah (3 - 7 tahun)'][$lang];
        }

        return ['en' => 'Long Term (over 7 years)', 'id' => 'Jangka Panjang (di atas 7 tahun)'][$lang];
    }

    public static function liquidity(float $emergency, float $monthlyExpenses, string $lang): string
    {
        $months = $monthlyExpenses > 0 ? (int) round($emergency / $monthlyExpenses) : 0;

        $money = '$'.number_format($emergency, 2);

        if ($lang === 'id') {
            return "Mempertahankan dana darurat yang menutupi sekitar {$months} bulan pengeluaran ({$money}).";
        }

        return "Maintain an emergency fund covering approximately {$months} months of expenses ({$money}).";
    }

    public static function taxNote(string $lang): string
    {
        if ($lang === 'id') {
            return 'Hasil investasi dapat dikenakan pajak (misalnya pajak dividen atau capital gain) sesuai peraturan yang berlaku. Investor disarankan berkonsultasi dengan penasihat pajak.';
        }

        return 'Investment returns may be subject to taxation (e.g., dividend withholding tax or capital gains tax) in accordance with applicable regulations. Investors are advised to consult a tax advisor.';
    }

    public static function defaultRebalancing(string $lang): string
    {
        if ($lang === 'id') {
            return 'Portofolio diseimbangkan kembali setiap 6 bulan atau ketika alokasi aset bergeser lebih dari 5% dari target.';
        }

        return 'The portfolio is rebalanced every 6 months or whenever any asset class drifts more than 5% from its target allocation.';
    }

    public static function declaration(string $lang): string
    {
        if ($lang === 'id') {
            return 'Saya menyatakan telah membaca dan memahami profil risiko serta kebijakan investasi yang disusun dalam dokumen ini.';
        }

        return 'I declare that I have read and understood my risk profile and the investment policy set out in this document.';
    }
}
