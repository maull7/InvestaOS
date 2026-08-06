<!DOCTYPE html>
<html lang="{{ $stock->language ?? 'id' }}">
<head>
    <meta charset="utf-8">
    <title>{{ $stock->code }} — {{ $stock->name }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #1e293b; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 8px; margin-bottom: 16px; }
        .header h1 { font-size: 22px; margin: 0; color: #0f172a; }
        .header p { margin: 2px 0 0; color: #64748b; }
        .price { font-size: 24px; font-weight: bold; color: #0f172a; }
        .up { color: #16a34a; } .down { color: #dc2626; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { text-align: left; padding: 5px 8px; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; font-size: 10px; text-transform: uppercase; color: #475569; }
        .muted { color: #64748b; }
        .footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; }
        .badge { display: inline-block; background: #eff6ff; color: #2563eb; padding: 2px 8px; border-radius: 4px; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $stock->code }}</h1>
        <p>{{ $stock->name }} @if ($stock->listing_board) · <span class="badge">{{ $stock->listing_board }}</span> @endif</p>
    </div>

    @if ($quote)
        <div>
            <span class="price">{{ number_format($quote['price'], 2) }} {{ $quote['currency'] }}</span>
            <span class="{{ $quote['change'] >= 0 ? 'up' : 'down' }}">
                {{ $quote['change'] >= 0 ? '+' : '' }}{{ number_format($quote['change'], 2) }}
                ({{ $quote['change'] >= 0 ? '+' : '' }}{{ number_format($quote['changePercent'], 2) }}%)
            </span>
            @if ($quote['asOf'])
                <span class="muted"> · {{ \Carbon\Carbon::createFromTimestamp($quote['asOf'])->format('d M Y H:i') }}</span>
            @endif
        </div>

        <table>
            <thead>
                <tr><th>Metrik</th><th>Nilai</th></tr>
            </thead>
            <tbody>
                <tr><td>Harga penutupan sebelumnya</td><td>{{ number_format($quote['previousClose'], 2) }}</td></tr>
                <tr><td>Rentang hari</td><td>{{ number_format($quote['dayLow'] ?? 0, 2) }} – {{ number_format($quote['dayHigh'] ?? 0, 2) }}</td></tr>
                <tr><td>Volume</td><td>{{ number_format($quote['volume'] ?? 0) }}</td></tr>
                <tr><td>52 minggu (low)</td><td>{{ number_format($quote['week52Low'] ?? 0, 2) }}</td></tr>
                <tr><td>52 minggu (high)</td><td>{{ number_format($quote['week52High'] ?? 0, 2) }}</td></tr>
                <tr><td>Kapitalisasi pasar</td><td>{{ $quote['marketCap'] ? number_format($quote['marketCap']) : '—' }}</td></tr>
            </tbody>
        </table>
    @else
        <p class="muted">Data harga tidak tersedia saat ini.</p>
    @endif

    <table>
        <thead>
            <tr><th>Detail</th><th>Nilai</th></tr>
        </thead>
        <tbody>
            <tr><td>Sektor</td><td>{{ $stock->sector ?? '—' }}</td></tr>
            <tr><td>Industri</td><td>{{ $stock->industry ?? '—' }}</td></tr>
            <tr><td>Papan pencatatan</td><td>{{ $stock->listing_board ?? '—' }}</td></tr>
            <tr><td>Tanggal IPO</td><td>{{ $stock->ipo_date ? $stock->ipo_date->format('d M Y') : '—' }}</td></tr>
            <tr><td>Website</td><td>{{ $stock->website ?? '—' }}</td></tr>
            <tr><td>Status</td><td>{{ $stock->status }}</td></tr>
        </tbody>
    </table>

    <div class="footer">
        Laporan dihasilkan {{ now()->format('d M Y H:i') }} · Sumber data harga: Yahoo Finance (cache 15 menit).
    </div>
</body>
</html>