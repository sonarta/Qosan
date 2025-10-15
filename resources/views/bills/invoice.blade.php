<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $bill->bill_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .info-section {
            margin-bottom: 30px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            width: 150px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .total-row {
            background-color: #f9f9f9;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-paid {
            background-color: #d4edda;
            color: #155724;
        }
        .status-unpaid {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-overdue {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>INVOICE</h1>
        <p style="margin: 5px 0;">{{ $bill->bill_number }}</p>
        <p style="margin: 5px 0;">Tanggal: {{ $bill->bill_date->format('d F Y') }}</p>
    </div>
    
    <div class="info-section">
        <h3>Informasi Penyewa</h3>
        <div class="info-row">
            <span class="info-label">Nama:</span>
            <span>{{ $bill->tenant->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Telepon:</span>
            <span>{{ $bill->tenant->phone }}</span>
        </div>
        @if($bill->tenant->email)
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span>{{ $bill->tenant->email }}</span>
        </div>
        @endif
        <div class="info-row">
            <span class="info-label">Kamar:</span>
            <span>{{ $bill->tenant->room->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Properti:</span>
            <span>{{ $bill->tenant->room->property->name }}</span>
        </div>
    </div>
    
    <div class="info-section">
        <h3>Detail Tagihan</h3>
        <div class="info-row">
            <span class="info-label">Periode:</span>
            <span>{{ $bill->period_start->format('d M Y') }} - {{ $bill->period_end->format('d M Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Jatuh Tempo:</span>
            <span>{{ $bill->due_date->format('d F Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="status-badge status-{{ $bill->status }}">
                @if($bill->status === 'paid') LUNAS
                @elseif($bill->status === 'unpaid') BELUM LUNAS
                @elseif($bill->status === 'overdue') JATUH TEMPO
                @else DIBATALKAN
                @endif
            </span>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Deskripsi</th>
                <th class="text-right">Jumlah</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($bill->items as $item)
            <tr>
                <td>{{ $item->description }}</td>
                <td class="text-right">{{ $item->quantity }}</td>
                <td class="text-right">Rp {{ number_format($item->amount, 0, ',', '.') }}</td>
                <td class="text-right">Rp {{ number_format($item->total, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="3" class="text-right">TOTAL:</td>
                <td class="text-right">Rp {{ number_format($bill->total, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>
    
    @if($bill->notes)
    <div class="info-section">
        <h3>Catatan</h3>
        <p>{{ $bill->notes }}</p>
    </div>
    @endif
    
    <div class="footer">
        <p>Terima kasih atas pembayaran Anda</p>
        <p>Dokumen ini digenerate secara otomatis pada {{ now()->format('d F Y H:i') }}</p>
    </div>
</body>
</html>
