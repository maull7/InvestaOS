<?php

namespace App\Services;

use App\Models\InvestmentPolicyStatement;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class IpsPdfService
{
    public function download(InvestmentPolicyStatement $ips): Response
    {
        $document = app(IpsDocumentService::class)->sections($ips);

        $pdf = Pdf::loadView('pdf.ips', [
            'document' => $document,
            'language' => $ips->language,
        ])->setPaper('a4');

        return $pdf->download('Investment-Policy-Statement-'.$ips->id.'.pdf');
    }
}
