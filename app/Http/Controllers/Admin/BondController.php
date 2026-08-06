<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\BondRequest;
use App\Models\Bond;
use App\Services\BondService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Shuchkin\SimpleXLSX;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BondController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $type = trim((string) $request->query('type', ''));
        $status = trim((string) $request->query('status', ''));

        $bonds = Bond::query()
            ->orderBy('code')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('code', 'like', "%{$q}%")
                ->orWhere('name', 'like', "%{$q}%")
                ->orWhere('issuer', 'like', "%{$q}%")))
            ->when($type !== '', fn ($query) => $query->where('type', $type))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->paginate(10)
            ->withQueryString();

        $service = app(BondService::class);
        $bonds->getCollection()->transform(fn (Bond $bond) => array_merge($bond->toArray(), ['calc' => $service->enrich($bond)]));

        return Inertia::render('admin/Bonds', [
            'bonds' => $bonds,
            'filters' => ['q' => $q, 'type' => $type, 'status' => $status],
        ]);
    }

    public function store(BondRequest $request): RedirectResponse
    {
        Bond::create($request->validated());

        return redirect()->route('admin.bonds.index');
    }

    public function update(BondRequest $request, Bond $bond): RedirectResponse
    {
        $bond->update($request->validated());

        return redirect()->route('admin.bonds.index');
    }

    public function destroy(Bond $bond): RedirectResponse
    {
        $bond->delete();

        return redirect()->route('admin.bonds.index');
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
        $fields = ['code', 'name', 'type', 'issuer', 'coupon', 'maturity_date', 'status', 'issue_date', 'face_value', 'payment_frequency', 'last_price', 'yield', 'benchmark_yield', 'benchmark_label', 'currency'];
        $index = array_flip($headers);
        $imported = 0;

        foreach ($rows as $row) {
            $data = [];
            foreach ($fields as $field) {
                $data[$field] = isset($index[$field]) ? trim((string) ($row[$index[$field]] ?? '')) : null;
            }

            if ($data['code'] === '' || $data['name'] === '') {
                continue;
            }

            $data['type'] = in_array($data['type'], ['government_bond', 'corporate_bond', 'sukuk'], true)
                ? $data['type']
                : 'government_bond';
            $data['status'] = ($data['status'] === 'inactive') ? 'inactive' : 'active';
            $data['coupon'] = $data['coupon'] !== '' ? (float) str_replace('%', '', $data['coupon']) : null;
            $data['maturity_date'] = $data['maturity_date'] !== '' ? $this->parseDate($data['maturity_date']) : null;
            $data['issue_date'] = $data['issue_date'] !== '' ? $this->parseDate($data['issue_date']) : null;
            $data['face_value'] = $data['face_value'] !== '' ? (float) str_replace(['.', ','], '', $data['face_value']) : null;
            $data['payment_frequency'] = $data['payment_frequency'] === 'annual' ? 'annual' : 'semiannual';
            $data['last_price'] = $data['last_price'] !== '' ? (float) $data['last_price'] : null;
            $data['yield'] = $data['yield'] !== '' ? (float) $data['yield'] : null;
            $data['benchmark_yield'] = $data['benchmark_yield'] !== '' ? (float) $data['benchmark_yield'] : null;
            $data['benchmark_label'] = $data['benchmark_label'] !== '' ? $data['benchmark_label'] : null;
            $data['currency'] = $data['currency'] !== '' ? strtoupper($data['currency']) : 'IDR';

            Bond::updateOrCreate(['code' => $data['code']], array_filter($data, fn ($v) => $v !== null));

            $imported++;
        }

        session()->flash('imported', $imported);

        return redirect()->route('admin.bonds.index');
    }

    public function template(): BinaryFileResponse
    {
        $zip = new \ZipArchive;
        $file = tempnam(sys_get_temp_dir(), 'bnd');
        $zip->open($file, \ZipArchive::OVERWRITE);

        $rows = [
            ['code', 'name', 'type', 'issuer', 'coupon', 'maturity_date', 'status', 'issue_date', 'face_value', 'payment_frequency', 'last_price', 'yield', 'benchmark_yield', 'benchmark_label', 'currency'],
            ['FR0099', 'FR Seri FR0099', 'government_bond', 'Pemerintah RI', '6.35', '2036-06-15', 'active', '2026-06-15', '1000', 'semiannual', '98.50', '6.60', '6.80', 'SBN 10Y', 'IDR'],
            ['INDOIS0002', 'Sukuk Negara SR002', 'sukuk', 'Pemerintah RI', '6.00', '2030-11-20', 'active', '2005-11-20', '1000', 'semiannual', '', '', '6.80', 'SBN 10Y', 'IDR'],
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
            .'<sheets><sheet name="Bonds" sheetId="1" r:id="rId1"/></sheets></workbook>');
        $zip->addFromString('xl/_rels/workbook.xml.rels',
            '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
        $zip->addFromString('xl/worksheets/sheet1.xml', $sheet);
        $zip->close();

        return response()->download($file, 'bonds-template.xlsx')->deleteFileAfterSend();
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

        return null; // veto: tak bisa di-parse, biarkan kosong
    }
}
