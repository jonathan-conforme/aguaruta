<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; margin: 0; padding: 0; }
        .header { margin-bottom: 20px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .title { font-size: 18px; font-weight: bold; color: #1e1b4b; margin: 0; }
        .subtitle { font-size: 10px; color: #6b7280; margin-top: 4px; }

        .stats-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
        .stat-card { background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 10px; text-align: center; border-radius: 6px; }
        .stat-label { font-size: 9px; text-transform: uppercase; color: #6b7280; font-weight: bold; }
        .stat-value { font-size: 14px; font-weight: bold; color: #111827; margin-top: 4px; }

        table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table.data-table th { background-color: #f3f4f6; color: #374151; font-weight: bold; font-size: 10px; text-align: left; padding: 8px; border-bottom: 1px solid #d1d5db; }
        table.data-table td { padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 10px; vertical-align: top; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .badge-cash { background-color: #d1fae5; color: #065f46; }
        .badge-transfer { background-color: #dbeafe; color: #1e40af; }
        .badge-credit { background-color: #fef3c7; color: #92400e; }
        .text-right { text-align: right; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">Reporte de Ventas</h1>
        <p class="subtitle">
            Rango: <strong>{{ $startDate->format('d/m/Y') }}</strong> al <strong>{{ $endDate->format('d/m/Y') }}</strong> |
            Generado el: {{ now()->format('d/m/Y H:i') }}
        </p>
    </div>

    <!-- TARJETAS DE MÉRTRICAS -->
    <table class="stats-table">
        <tr>
            <td width="24%">
                <div class="stat-card">
                    <div class="stat-label">Total Vendido</div>
                    <div class="stat-value" style="color: #16a34a;">${{ number_format($totalEarned, 2) }}</div>
                </div>
            </td>
            <td width="1.33%"></td>
            <td width="24%">
                <div class="stat-card">
                    <div class="stat-label">Efectivo</div>
                    <div class="stat-value" style="color: #2563eb;">${{ number_format($cashEarned, 2) }}</div>
                </div>
            </td>
            <td width="1.33%"></td>
            <td width="24%">
                <div class="stat-card">
                    <div class="stat-label">Transferencias</div>
                    <div class="stat-value" style="color: #4f46e5;">${{ number_format($transferEarned, 2) }}</div>
                </div>
            </td>
            <td width="1.33%"></td>
            <td width="24%">
                <div class="stat-card">
                    <div class="stat-label">Crédito</div>
                    <div class="stat-value" style="color: #d97706;">${{ number_format($creditEarned, 2) }}</div>
                </div>
            </td>
        </tr>
    </table>

    <!-- TABLA DE DETALLES -->
    <table class="data-table">
        <thead>
            <tr>
                <th width="12%">Fecha / Hora</th>
                <th width="20%">Vendedor</th>
                <th width="22%">Cliente</th>
                <th width="24%">Productos</th>
                <th width="12%">Método</th>
                <th width="10%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($sales as $sale)
                <tr>
                    <td>
                        {{ $sale->created_at->format('d/m/Y') }}<br>
                        <small style="color: #6b7280;">{{ $sale->created_at->format('H:i') }}</small>
                    </td>
                    <td><strong>{{ $sale->shift->user->name ?? $sale->user->name ?? 'N/A' }}</strong></td>
                    <td>{{ $sale->customer->name ?? 'Consumidor Final' }}</td>
                    <td>
                        @foreach($sale->details as $detail)
                            <div>{{ $detail->quantity }}x {{ $detail->product->name ?? 'Producto' }}</div>
                        @endforeach
                    </td>
                    <td>
                        @if($sale->payment_method === 'cash')
                            <span class="badge badge-cash">Efectivo</span>
                        @elseif($sale->payment_method === 'transfer')
                            <span class="badge badge-transfer">Transf.</span>
                        @else
                            <span class="badge badge-credit">Crédito</span>
                        @endif
                    </td>
                    <td class="text-right"><strong>${{ number_format($sale->total, 2) }}</strong></td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-center; padding: 20px; color: #6b7280;">
                        No se encontraron ventas en las fechas seleccionadas.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
