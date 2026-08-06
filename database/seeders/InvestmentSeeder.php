<?php

namespace Database\Seeders;

use App\Models\InvestmentManager;
use App\Models\MutualFund;
use Illuminate\Database\Seeder;

class InvestmentSeeder extends Seeder
{
    public function run(): void
    {
        $managers = [
            ['name' => 'PT Manulife Aset Manajemen Indonesia', 'code' => 'MI01', 'website' => 'https://www.manulifeinvestasi.co.id', 'email' => 'cs@manulifeam.co.id'],
            ['name' => 'PT Sucorinvest Asset Management', 'code' => 'MI02', 'website' => 'https://www.sucorinvest.co.id', 'email' => 'cs@sucorinvest.co.id'],
            ['name' => 'PT Mandiri Manajemen Investasi', 'code' => 'MI03', 'website' => 'https://www.mandiri-investasi.co.id', 'email' => 'cs@mandiri-investasi.co.id'],
            ['name' => 'PT Bahana TCW Investment Management', 'code' => 'MI04', 'website' => 'https://www.bahanatcw.co.id', 'email' => 'cs@bahanatcw.co.id'],
        ];

        foreach ($managers as $data) {
            InvestmentManager::updateOrCreate(['code' => $data['code']], $data);
        }

        $funds = [
            ['code' => 'MFSHK', 'name' => 'Manulife Dana Saham', 'fund_type' => 'equity', 'risk_level' => 4, 'currency' => 'IDR', 'custodian_bank' => 'Bank CIMB Niaga', 'launch_date' => '1995-07-04', 'investment_manager_code' => 'MI01'],
            ['code' => 'MFPU', 'name' => 'Manulife Dana Pasar Uang', 'fund_type' => 'money_market', 'risk_level' => 1, 'currency' => 'IDR', 'custodian_bank' => 'Bank CIMB Niaga', 'launch_date' => '1996-05-10', 'investment_manager_code' => 'MI01'],
            ['code' => 'MFSYAH', 'name' => 'Manulife Syariah Saham', 'fund_type' => 'islamic_equity', 'risk_level' => 4, 'currency' => 'IDR', 'custodian_bank' => 'Bank BNI', 'launch_date' => '2019-03-25', 'investment_manager_code' => 'MI01'],
            ['code' => 'SUCORINDO', 'name' => 'Sucorinvest Equity Fund', 'fund_type' => 'equity', 'risk_level' => 4, 'currency' => 'IDR', 'custodian_bank' => 'Bank KEB Hana', 'launch_date' => '2018-06-12', 'investment_manager_code' => 'MI02'],
            ['code' => 'SUCORPU', 'name' => 'Sucorinvest Fixed Income Fund', 'fund_type' => 'fixed_income', 'risk_level' => 2, 'currency' => 'IDR', 'custodian_bank' => 'Bank KEB Hana', 'launch_date' => '2017-01-20', 'investment_manager_code' => 'MI02'],
            ['code' => 'MDS', 'name' => 'Mandiri Dana Syariah', 'fund_type' => 'islamic_fixed_income', 'risk_level' => 2, 'currency' => 'IDR', 'custodian_bank' => 'Bank Mandiri', 'launch_date' => '2008-11-14', 'investment_manager_code' => 'MI03'],
            ['code' => 'MDE', 'name' => 'Mandiri Dynamic Equity Fund', 'fund_type' => 'balanced', 'risk_level' => 3, 'currency' => 'IDR', 'custodian_bank' => 'Bank Mandiri', 'launch_date' => '2012-04-02', 'investment_manager_code' => 'MI03'],
            ['code' => 'BCAAM01', 'name' => 'Bahana Dana Prima', 'fund_type' => 'protected', 'risk_level' => 2, 'currency' => 'IDR', 'custodian_bank' => 'Bank Negara Indonesia', 'launch_date' => '2010-08-19', 'investment_manager_code' => 'MI04'],
        ];

        foreach ($funds as $data) {
            $managerId = InvestmentManager::where('code', $data['investment_manager_code'])->value('id');
            unset($data['investment_manager_code']);

            MutualFund::updateOrCreate(['code' => $data['code']], array_merge($data, ['investment_manager_id' => $managerId]));
        }
    }
}
