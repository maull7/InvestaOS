<?php

namespace Database\Seeders;

use App\Models\Bond;
use Illuminate\Database\Seeder;

class BondSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            ['FR0099', 'Obligasi Negara Seri FR0099', 'government_bond', 'Pemerintah RI', '6.35', '2036-06-15', '2026-06-15', 'semiannual', '6.80', 'SBN 10Y'],
            ['FR0097', 'Obligasi Negara Seri FR0097', 'government_bond', 'Pemerintah RI', '6.10', '2034-08-15', '2024-08-15', 'semiannual', '6.80', 'SBN 10Y'],
            ['FR0095', 'Obligasi Negara Seri FR0095', 'government_bond', 'Pemerintah RI', '6.50', '2033-05-15', '2023-05-15', 'semiannual', '6.80', 'SBN 10Y'],
            ['FR0093', 'Obligasi Negara Seri FR0093', 'government_bond', 'Pemerintah RI', '6.75', '2031-08-15', '2021-08-15', 'semiannual', '6.80', 'SBN 10Y'],
            ['FR0090', 'Obligasi Negara Seri FR0090', 'government_bond', 'Pemerintah RI', '7.50', '2029-11-15', '2019-11-15', 'semiannual', '6.80', 'SBN 10Y'],
            ['ORI028', 'Obligasi Ritel Indonesia ORI028', 'government_bond', 'Pemerintah RI', '6.40', '2030-02-10', '2025-02-10', 'annual', '7.10', 'SBN Ritel'],
            ['SR017', 'Sukuk Ritel Seri SR017', 'sukuk', 'Pemerintah RI', '6.20', '2030-09-15', '2025-09-15', 'annual', '7.10', 'SBN Ritel'],
            ['ST012', 'Savings Bond Ritel ST012', 'sukuk', 'Pemerintah RI', '6.00', '2028-07-25', '2025-07-25', 'annual', '7.10', 'SBN Ritel'],
            ['INDOBANK01', 'Obligasi Berkelanjutan Bank ABC Tahap I', 'corporate_bond', 'Bank ABC', '6.50', '2029-03-14', '2024-03-14', 'semiannual', '7.50', 'IGB Indonesia'],
            ['INDOTEL01', 'Obligasi Berkelanjutan PT Telkom Tahap I', 'corporate_bond', 'PT Telkom Indonesia', '7.20', '2030-07-22', '2023-07-22', 'semiannual', '7.40', 'IGB Indonesia'],
            ['INDSUKI01', 'Sukuk Ijarah Bank MNC', 'sukuk', 'BN MNC', '8.00', '2028-12-01', '2021-12-01', 'semiannual', '8.10', 'IGB Indonesia'],
        ];

        foreach ($rows as [$code, $name, $type, $issuer, $coupon, $maturity, $issue, $freq, $bench, $benchLabel]) {
            Bond::updateOrCreate(['code' => $code], [
                'name' => $name,
                'type' => $type,
                'issuer' => $issuer,
                'coupon' => $coupon,
                'maturity_date' => $maturity,
                'issue_date' => $issue,
                'face_value' => 1000,
                'payment_frequency' => $freq,
                'last_price' => null,
                'yield' => null,
                'benchmark_yield' => $bench,
                'benchmark_label' => $benchLabel,
                'currency' => 'IDR',
                'status' => 'active',
            ]);
        }
    }
}
