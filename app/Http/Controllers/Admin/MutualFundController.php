<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\MutualFundRequest;
use App\Models\InvestmentManager;
use App\Models\MutualFund;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MutualFundController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $type = trim((string) $request->query('type', ''));
        $manager = trim((string) $request->query('manager', ''));
        $custodian = trim((string) $request->query('custodian', ''));

        $funds = MutualFund::query()
            ->with('investmentManager:id,name')
            ->orderBy('name')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('code', 'like', "%{$q}%")
                ->orWhere('name', 'like', "%{$q}%")))
            ->when($type !== '', fn ($query) => $query->where('fund_type', $type))
            ->when($manager !== '', fn ($query) => $query->where('investment_manager_id', $manager))
            ->when($custodian !== '', fn ($query) => $query->where('custodian_bank', $custodian))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/MutualFunds', [
            'funds' => $funds,
            'filters' => ['q' => $q, 'type' => $type, 'manager' => $manager, 'custodian' => $custodian],
            'managers' => InvestmentManager::orderBy('name')->get(['id', 'name']),
            'custodians' => $this->distinctCustodians(),
        ]);
    }

    public function store(MutualFundRequest $request): RedirectResponse
    {
        MutualFund::create($request->validated());

        return redirect()->route('admin.mutual-funds.index');
    }

    public function update(MutualFundRequest $request, MutualFund $mutualFund): RedirectResponse
    {
        $mutualFund->update($request->validated());

        return redirect()->route('admin.mutual-funds.index');
    }

    public function destroy(MutualFund $mutualFund): RedirectResponse
    {
        $mutualFund->delete();

        return redirect()->route('admin.mutual-funds.index');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => ['required', 'file', 'mimes:csv,txt', 'max:2048']]);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        if ($handle === false) {
            return back()->withErrors(['file' => 'File CSV tidak dapat dibaca.']);
        }

        $headers = array_map(fn ($h) => strtolower(trim((string) $h)), fgetcsv($handle) ?? []);
        $index = array_flip($headers);
        $fields = ['code', 'name', 'fund_type', 'currency', 'risk_level', 'custodian_bank', 'launch_date', 'status', 'investment_manager_code'];
        $imported = 0;
        $invalid = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $data = [];
            foreach ($fields as $field) {
                $data[$field] = isset($index[$field]) ? trim((string) ($row[$index[$field]] ?? '')) : null;
            }

            if ($data['name'] === '') {
                continue;
            }

            $type = $this->normalizeFundType($data['fund_type']);
            if ($type === null) {
                $invalid++;

                continue;
            }

            $managerId = null;
            if ($data['investment_manager_code'] !== '') {
                $managerId = InvestmentManager::where('code', $data['investment_manager_code'])->value('id');
            }

            $payload = [
                'investment_manager_id' => $managerId,
                'code' => $data['code'] !== '' ? $data['code'] : null,
                'name' => $data['name'],
                'fund_type' => $type,
                'currency' => $data['currency'] !== '' ? strtoupper($data['currency']) : 'IDR',
                'risk_level' => $data['risk_level'] !== '' ? (int) $data['risk_level'] : null,
                'custodian_bank' => $data['custodian_bank'] !== '' ? $data['custodian_bank'] : null,
                'launch_date' => $data['launch_date'] !== '' ? $this->parseDate($data['launch_date']) : null,
                'status' => ($data['status'] === 'inactive') ? 'inactive' : 'active',
            ];

            if ($payload['code'] !== null) {
                MutualFund::updateOrCreate(['code' => $payload['code']], $payload);
            } else {
                MutualFund::create($payload);
            }

            $imported++;
        }

        fclose($handle);

        session()->flash('imported', ['count' => $imported, 'skipped' => $invalid]);

        return redirect()->route('admin.mutual-funds.index');
    }

    public function template(): StreamedResponse
    {
        $headers = ['code', 'name', 'fund_type', 'currency', 'risk_level', 'custodian_bank', 'launch_date', 'status', 'investment_manager_code'];
        $rows = [
            ['MF0001', 'Reksa Dana Saham Contoh', 'equity', 'IDR', '4', 'Bank Kustodian Indonesia', '2024-01-15', 'active', 'MI01'],
            ['MF0002', 'Reksa Dana Pendapatan Tetap', 'fixed_income', 'IDR', '2', 'Bank Kustodian Indonesia', '2023-05-20', 'active', ''],
        ];

        return response()->streamDownload(function () use ($headers, $rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $row) {
                fputcsv($out, $row);
            }
            fclose($out);
        }, 'mutual-funds-template.csv', ['Content-Type' => 'text/csv']);
    }

    private function normalizeFundType(?string $value): ?string
    {
        $map = [
            'money_market' => 'money_market',
            'fixed_income' => 'fixed_income',
            'balanced' => 'balanced',
            'equity' => 'equity',
            'protected' => 'protected',
            'index' => 'index',
            'etf' => 'etf',
            'islamic_money_market' => 'islamic_money_market',
            'islamic_fixed_income' => 'islamic_fixed_income',
            'islamic_balanced' => 'islamic_balanced',
            'islamic_equity' => 'islamic_equity',
            'pasar uang' => 'money_market',
            'pendapatan tetap' => 'fixed_income',
            'campuran' => 'balanced',
            'saham' => 'equity',
            'terproteksi' => 'protected',
            'indeks' => 'index',
            'pasar uang syariah' => 'islamic_money_market',
            'pendapatan tetap syariah' => 'islamic_fixed_income',
            'campuran syariah' => 'islamic_balanced',
            'saham syariah' => 'islamic_equity',
        ];

        $key = strtolower(trim((string) $value));

        return $map[$key] ?? null;
    }

    private function parseDate(string $value): ?string
    {
        if (is_numeric($value)) {
            return date('Y-m-d', ((int) $value - 25569) * 86400);
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $value;
        }

        $months = [
            'Jan' => '01', 'Feb' => '02', 'Mar' => '03', 'Apr' => '04', 'Mei' => '05',
            'Jun' => '06', 'Jul' => '07', 'Agu' => '08', 'Sep' => '09', 'Okt' => '10',
            'Nov' => '11', 'Des' => '12',
        ];

        if (preg_match('/^(\d{1,2})\s+(\S{3})\s+(\d{4})$/', $value, $m) && isset($months[$m[2]])) {
            return sprintf('%04d-%s-%02d', $m[3], $months[$m[2]], $m[1]);
        }

        return null;
    }

    private function distinctCustodians(): array
    {
        return MutualFund::whereNotNull('custodian_bank')
            ->where('custodian_bank', '!=', '')
            ->distinct()
            ->pluck('custodian_bank')
            ->sort()
            ->values()
            ->all();
    }
}
