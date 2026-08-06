<!DOCTYPE html>
<html lang="{{ $language }}">
<head>
    <meta charset="utf-8">
    <title>Investment Policy Statement</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; color: #1a1a1a; font-size: 13px; line-height: 1.5; }
        h1 { font-size: 20px; border-bottom: 3px solid #2563eb; padding-bottom: 8px; }
        h2 { font-size: 15px; margin-top: 20px; border-left: 4px solid #2563eb; padding-left: 8px; }
        .meta { color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background: #f1f5f9; }
        .section { page-break-inside: avoid; }
        .declaration { margin-top: 30px; padding: 12px; border: 1px solid #ddd; background: #f8fafc; }
        .constraints li { margin-bottom: 4px; }
    </style>
</head>
<body>
    @php
        $label = $language === 'id' ? [
            'title' => 'Pernyataan Kebijakan Investasi (IPS)',
            'investor' => 'Informasi Investor',
            'name' => 'Nama Investor',
            'date' => 'Tanggal Pembuatan',
            'advisor' => 'Penasihat',
            'objective' => 'Tujuan Investasi Utama',
            'goals' => 'Tujuan Investasi',
            'target' => 'Target Dana',
            'time' => 'Target Waktu',
            'priority' => 'Prioritas',
            'risk_profile' => 'Profil Risiko',
            'risk_tolerance' => 'Toleransi Risiko',
            'horizon' => 'Cakrawala Waktu Investasi',
            'allocation' => 'Alokasi Aset yang Direkomendasikan',
            'asset' => 'Aset',
            'pct' => 'Persentase',
            'liquidity' => 'Kebutuhan Likuiditas',
            'constraints' => 'Batasan Investasi',
            'benchmark' => 'Benchmark',
            'tax' => 'Pertimbangan Pajak',
            'rebalancing' => 'Kebijakan Rebalancing Portofolio',
            'review' => 'Jadwal Peninjauan',
            'declaration' => 'Pernyataan',
        ] : [
            'title' => 'Investment Policy Statement',
            'investor' => 'Investor Information',
            'name' => 'Investor Name',
            'date' => 'Date of Issue',
            'advisor' => 'Advisor',
            'objective' => 'Primary Investment Objective',
            'goals' => 'Investment Goals',
            'target' => 'Target Amount',
            'time' => 'Target Date',
            'priority' => 'Priority',
            'risk_profile' => 'Risk Profile',
            'risk_tolerance' => 'Risk Tolerance',
            'horizon' => 'Investment Time Horizon',
            'allocation' => 'Recommended Asset Allocation',
            'asset' => 'Asset',
            'pct' => 'Allocation',
            'liquidity' => 'Liquidity Requirement',
            'constraints' => 'Investment Constraints',
            'benchmark' => 'Benchmark',
            'tax' => 'Tax Consideration',
            'rebalancing' => 'Portfolio Rebalancing Policy',
            'review' => 'Review Schedule',
            'declaration' => 'Declaration',
        ];
    @endphp

    <h1>{{ $label['title'] }}</h1>

    <div class="section">
        <h2>{{ $label['investor'] }}</h2>
        <table>
            <tr><td>{{ $label['name'] }}</td><td>{{ $document['investor_info']['name'] }}</td></tr>
            <tr><td>{{ $label['date'] }}</td><td>{{ $document['investor_info']['created_at'] }}</td></tr>
        </table>
    </div>

    <h2>{{ $label['objective'] }}</h2>
    <p>{{ $document['investment_objective'] }}</p>

    @if (! empty($document['investment_goals']))
        <h2>{{ $label['goals'] }}</h2>
        <table>
            <thead><tr><th>Type</th><th>{{ $label['target'] }}</th><th>{{ $label['time'] }}</th><th>{{ $label['priority'] }}</th></tr></thead>
            <tbody>
                @foreach ($document['investment_goals'] as $goal)
                    <tr>
                        <td>{{ \Illuminate\Support\Str::title(str_replace('_', ' ', $goal['type'])) }}</td>
                        <td>{{ number_format((float) $goal['target_amount'], 2) }}</td>
                        <td>{{ $goal['target_date'] }}</td>
                        <td>{{ $goal['priority'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2>{{ $label['risk_profile'] }}</h2>
    <p>{{ $document['risk_profile'] ?? '—' }}</p>

    <h2>{{ $label['risk_tolerance'] }}</h2>
    <p>{{ $document['risk_tolerance'] ?? '—' }}</p>

    <h2>{{ $label['horizon'] }}</h2>
    <p>{{ $document['time_horizon'] }}</p>

    @if (! empty($document['asset_allocation']))
        <h2>{{ $label['allocation'] }}</h2>
        <table>
            <thead><tr><th>{{ $label['asset'] }}</th><th>{{ $label['pct'] }}</th></tr></thead>
            <tbody>
                @foreach ($document['asset_allocation'] as $row)
                    <tr><td>{{ $row['asset'] }}</td><td>{{ $row['pct'] }}%</td></tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <h2>{{ $label['liquidity'] }}</h2>
    <p>{{ $document['liquidity_requirement'] }}</p>

    <h2>{{ $label['constraints'] }}</h2>
    @if (empty($document['investment_constraints']))
        <p>—</p>
    @else
        <ul class="constraints">
            @foreach ($document['investment_constraints'] as $constraint)
                <li>{{ $constraint }}</li>
            @endforeach
        </ul>
    @endif

    <h2>{{ $label['benchmark'] }}</h2>
    <p>{{ $document['benchmark'] }}</p>

    <h2>{{ $label['tax'] }}</h2>
    <p>{{ $document['tax_consideration'] }}</p>

    <h2>{{ $label['rebalancing'] }}</h2>
    <p>{{ $document['rebalancing_policy'] }}</p>

    <h2>{{ $label['review'] }}</h2>
    <p>{{ $document['review_schedule'] }}</p>

    <div class="declaration">
        <strong>{{ $label['declaration'] }}</strong>
        <p style="margin-bottom:0">{{ $document['declaration'] }}</p>
    </div>
</body>
</html>