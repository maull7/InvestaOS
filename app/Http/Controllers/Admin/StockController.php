<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StockRequest;
use App\Models\Stock;
use App\Services\StockMarketService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Shuchkin\SimpleXLSX;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class StockController extends Controller
{
    public function __construct(private readonly StockMarketService $market) {}

    public function show(Stock $stock, Request $request): Response
    {
        $range = (string) $request->query('range', '1y');

        return Inertia::render('admin/StockDetail', [
            'stock' => $stock,
            'quote' => $this->market->chart($stock, $range),
        ]);
    }

    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $sector = trim((string) $request->query('sector', ''));
        $board = trim((string) $request->query('board', ''));

        $stocks = Stock::query()
            ->orderBy('code')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('code', 'like', "%{$q}%")
                ->orWhere('name', 'like', "%{$q}%")))
            ->when($sector !== '', fn ($query) => $query->where('sector', $sector))
            ->when($board !== '', fn ($query) => $query->where('listing_board', $board))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/Stocks', [
            'stocks' => $stocks,
            'filters' => ['q' => $q, 'sector' => $sector, 'board' => $board],
            'sectors' => $this->distinct('sector'),
            'boards' => $this->distinct('listing_board'),
        ]);
    }

    private function distinct(string $column): array
    {
        return Stock::whereNotNull($column)
            ->where($column, '!=', '')
            ->distinct()
            ->pluck($column)
            ->sort()
            ->values()
            ->all();
    }

    public function store(StockRequest $request): RedirectResponse
    {
        Stock::create($request->validated());

        return redirect()->route('admin.stocks.index');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => ['required', 'file', 'max:2048']]);

        $xlsx = SimpleXLSX::parse($request->file('file')->getRealPath());

        if (! $xlsx) {
            return back()->withErrors(['file' => 'File excel tidak valid.']);
        }

        $rows = $xlsx->rows();
        if (count($rows) < 2) {
            return back()->withErrors(['file' => 'File kosong, minimal berisi header + 1 baris data.']);
        }

        $headers = array_map(fn ($h) => strtolower(trim((string) $h)), array_shift($rows));
        $fields = ['code', 'name', 'sector', 'industry', 'listing_board', 'ipo_date', 'website', 'status'];
        $index = array_flip($headers);
        $imported = 0;

        foreach ($rows as $row) {
            $data = [];
            foreach ($fields as $field) {
                $data[$field] = isset($index[$field]) ? trim((string) ($row[$index[$field]] ?? '')) : null;
            }

            if ($data['code'] === '') {
                continue;
            }

            $data['status'] = ($data['status'] === 'inactive') ? 'inactive' : 'active';
            $data['ipo_date'] = $data['ipo_date'] !== '' ? $this->parseIpoDate($data['ipo_date']) : null;

            Stock::updateOrCreate(['code' => $data['code']], array_filter($data, fn ($v) => $v !== null));

            $imported++;
        }

        session()->flash('imported', $imported);

        return redirect()->route('admin.stocks.index');
    }

    private function parseIpoDate(string $value): ?string
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

        return null; // veto: tak bisa di-parse, biarkan kosong
    }

    public function template(): BinaryFileResponse
    {
        $zip = new \ZipArchive;
        $file = tempnam(sys_get_temp_dir(), 'stk');
        $zip->open($file, \ZipArchive::OVERWRITE);

        $rows = [
            ['code', 'name', 'sector', 'industry', 'listing_board', 'ipo_date', 'website', 'status'],
            ['BBCA', 'Bank Central Asia', 'Financials', 'Banking', 'Main', '2000-05-31', 'https://www.bca.co.id', 'active'],
        ];

        $sheet = '<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';
        foreach ($rows as $row) {
            $sheet .= '<row>';
            foreach ($row as $cell) {
                $sheet .= '<c t="inlineStr"><is><t>'.$cell.'</t></is></c>';
            }
            $sheet .= '</row>';
        }
        $sheet .= '</sheetData></worksheet>';

        $zip->addFromString('[Content_Types].xml',
            '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
            .'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
            .'<Default Extension="xml" ContentType="application/xml"/>'
            .'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
            .'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>');
        $zip->addFromString('_rels/.rels',
            '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
        $zip->addFromString('xl/workbook.xml',
            '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
            .'<sheets><sheet name="Stocks" sheetId="1" r:id="rId1"/></sheets></workbook>');
        $zip->addFromString('xl/_rels/workbook.xml.rels',
            '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
        $zip->addFromString('xl/worksheets/sheet1.xml', $sheet);
        $zip->close();

        return response()->download($file, 'stocks-template.xlsx')->deleteFileAfterSend();
    }

    public function update(StockRequest $request, Stock $stock): RedirectResponse
    {
        $stock->update($request->validated());

        return redirect()->route('admin.stocks.index');
    }

    public function destroy(Stock $stock): RedirectResponse
    {
        $stock->delete();

        return redirect()->route('admin.stocks.index');
    }
}
