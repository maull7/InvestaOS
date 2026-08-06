<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvestmentManagerRequest;
use App\Models\InvestmentManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Shuchkin\SimpleXLSX;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class InvestmentManagerController extends Controller
{
    public function index(Request $request): Response
    {
        $q = trim((string) $request->query('q', ''));
        $status = trim((string) $request->query('status', ''));

        $managers = InvestmentManager::query()
            ->orderBy('name')
            ->when($q !== '', fn ($query) => $query->where(fn ($w) => $w
                ->where('name', 'like', "%{$q}%")
                ->orWhere('code', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%")))
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/InvestmentManagers', [
            'managers' => $managers,
            'filters' => ['q' => $q, 'status' => $status],
        ]);
    }

    public function store(InvestmentManagerRequest $request): RedirectResponse
    {
        InvestmentManager::create($request->validated());

        return redirect()->route('admin.investment-managers.index');
    }

    public function update(InvestmentManagerRequest $request, InvestmentManager $investmentManager): RedirectResponse
    {
        $investmentManager->update($request->validated());

        return redirect()->route('admin.investment-managers.index');
    }

    public function destroy(InvestmentManager $investmentManager): RedirectResponse
    {
        $investmentManager->delete();

        return redirect()->route('admin.investment-managers.index');
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
        $fields = ['code', 'name', 'website', 'email', 'phone', 'address', 'status'];
        $index = array_flip($headers);
        $imported = 0;

        foreach ($rows as $row) {
            $data = [];
            foreach ($fields as $field) {
                $data[$field] = isset($index[$field]) ? trim((string) ($row[$index[$field]] ?? '')) : null;
            }

            if ($data['name'] === '') {
                continue;
            }

            $data['status'] = ($data['status'] === 'inactive') ? 'inactive' : 'active';

            InvestmentManager::updateOrCreate(['code' => $data['code']], array_filter($data, fn ($v) => $v !== null));

            $imported++;
        }

        session()->flash('imported', $imported);

        return redirect()->route('admin.investment-managers.index');
    }

    public function template(): BinaryFileResponse
    {
        $zip = new \ZipArchive;
        $file = tempnam(sys_get_temp_dir(), 'im');
        $zip->open($file, \ZipArchive::OVERWRITE);

        $rows = [
            ['code', 'name', 'website', 'email', 'phone', 'address', 'status'],
            ['MI01', 'PT Contoh Manajer', 'https://contoh.com', 'cs@contoh.com', '021-1234567', 'Jl. Contoh No. 1, Jakarta', 'active'],
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
            .'<sheets><sheet name="InvestmentManagers" sheetId="1" r:id="rId1"/></sheets></workbook>');
        $zip->addFromString('xl/_rels/workbook.xml.rels',
            '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            .'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>');
        $zip->addFromString('xl/worksheets/sheet1.xml', $sheet);
        $zip->close();

        return response()->download($file, 'investment-managers-template.xlsx')->deleteFileAfterSend();
    }
}
