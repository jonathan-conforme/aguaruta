<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Historial de Cajas y Reparto</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 9px;
            color: #1e293b;
            margin: 0;
            padding: 8px;
        }

        .header {
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 6px;
            margin-bottom: 10px;
        }

        .header h1 {
            margin: 0;
            font-size: 15px;
            color: #0f172a;
        }

        /* Grid de Métricas Principales */
        .summary-grid {
            width: 100%;
            margin-bottom: 12px;
            border-collapse: separate;
            border-spacing: 4px;
        }

        .summary-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            padding: 5px;
            text-align: center;
        }

        .summary-title {
            font-size: 7px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: bold;
        }

        .summary-value {
            font-size: 10px;
            font-weight: bold;
            margin-top: 2px;
        }

        .text-green { color: #16a34a; }
        .text-red { color: #dc2626; }
        .text-indigo { color: #4f46e5; }
        .text-amber { color: #d97706; }
        .text-purple { color: #7e22ce; }

        .date-badge {
            background: #e2e8f0;
            color: #1e293b;
            padding: 3px 6px;
            font-size: 8.5px;
            font-weight: bold;
            border-radius: 3px;
            margin: 10px 0 5px 0;
            display: inline-block;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f1f5f9;
            color: #334155;
            text-align: left;
            font-size: 7.5px;
            font-weight: bold;
            padding: 4px 4px;
            border-bottom: 1.5px solid #cbd5e1;
        }

        td {
            padding: 4px 4px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 8px;
        }

        .badge-open {
            background: #FEF3C7;
            color: #92400E;
            padding: 1px 3px;
            border-radius: 2px;
            font-size: 6.5px;
            font-weight: bold;
        }

        .badge-route {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            color: #475569;
            padding: 1px 3px;
            border-radius: 2px;
            font-size: 7px;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
    </style>
</head>

<body>

    <div class="header">
        <h1>Reporte General de Cajas y Operaciones de Ruta</h1>
        <p style="margin:2px 0 0 0; font-size: 8px; color: #64748b;">Generado el:
            {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</p>
    </div>

    @php
        $totalInitialCash = 0;
        $totalVentas = 0;
        $totalGastos = 0;
        $totalViajesGlobal = 0;
        $totalEnvasesRecuperados = 0;
        $totalEntregado = 0;

        foreach ($shifts as $shift) {
            $ventas = $shift->trips ? $shift->trips->sum('cash_sales_sum_total') : ($shift->total_sales ?? 0);
            $gastos = $shift->expenses_sum_amount ?? 0;

            $totalInitialCash += $shift->initial_cash ?? 0;
            $totalVentas += $ventas;
            $totalGastos += $gastos;
            $totalViajesGlobal += $shift->total_trips ?? ($shift->trips ? $shift->trips->count() : 0);

            if ($shift->status === 'closed') {
                $totalEntregado += $shift->final_cash ?? 0;
            }

            if ($shift->trips) {
                foreach ($shift->trips as $trip) {
                    if ($trip->details) {
                        $totalEnvasesRecuperados += $trip->details->sum('recovered_bottles');
                    }
                }
            }
        }

        $totalEsperado = $totalVentas - $totalGastos + $totalInitialCash;
        $diferenciaTotal = $totalEntregado - $totalEsperado;

        $grupos = $shifts->groupBy(function ($shift) {
            $fecha = \Carbon\Carbon::parse($shift->opened_at)->startOfDay();
            $hoy = \Carbon\Carbon::now()->startOfDay();
            $diff = $hoy->diffInDays($fecha, false);

            if ($diff === 0) return 'Hoy';
            if ($diff === -1) return 'Ayer';
            if ($diff === -2) return 'Antes de ayer';

            return $fecha->format('d/m/Y');
        });
    @endphp

    <!-- Tarjetas de resumen general de 6 métricas -->
    <table class="summary-grid">
        <tr>
            <td class="summary-card" width="16%">
                <div class="summary-title">Viajes</div>
                <div class="summary-value">{{ $totalViajesGlobal }}</div>
            </td>
            <td class="summary-card" width="16%">
                <div class="summary-title">Envases Rec.</div>
                <div class="summary-value text-amber">{{ $totalEnvasesRecuperados }} pcs</div>
            </td>
            <td class="summary-card" width="17%">
                <div class="summary-title">Ventas Efec.</div>
                <div class="summary-value text-green">${{ number_format($totalVentas, 2) }}</div>
            </td>
            <td class="summary-card" width="17%">
                <div class="summary-title">Gastos</div>
                <div class="summary-value text-red">${{ number_format($totalGastos, 2) }}</div>
            </td>
            <td class="summary-card" width="17%">
                <div class="summary-title">Efec. Esperado</div>
                <div class="summary-value text-indigo">${{ number_format($totalEsperado, 2) }}</div>
            </td>
            <td class="summary-card" width="17%">
                <div class="summary-title">Efec. Entregado</div>
                <div class="summary-value {{ $diferenciaTotal < -0.01 ? 'text-red' : ($diferenciaTotal > 0.01 ? 'text-purple' : 'text-green') }}">
                    ${{ number_format($totalEntregado, 2) }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Listado por grupo de fechas -->
    @forelse($grupos as $fechaLabel => $items)

        <div class="date-badge">{{ $fechaLabel }}</div>

        <table>
            <thead>
                <tr>
                    <th>Empleado</th>
                    <th>Horario (A / C)</th>
                    <th>Ruta(s)</th>
                    <th class="text-center">Viajes</th>
                    <th class="text-center">Env.</th>
                    <th class="text-right">Base</th>
                    <th class="text-right">Ventas</th>
                    <th class="text-right">Gastos</th>
                    <th class="text-right">Esperado</th>
                    <th class="text-right">Entregado</th>
                    <th class="text-right">Diferencia</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $shift)
                    @php
                        $ventasShift = $shift->trips
                            ? $shift->trips->sum('cash_sales_sum_total')
                            : ($shift->total_sales ?? 0);
                        $gastosShift = $shift->expenses_sum_amount ?? 0;
                        $esperadoShift = $ventasShift - $gastosShift + ($shift->initial_cash ?? 0);

                        $entregadoShift = $shift->status === 'closed' ? ($shift->final_cash ?? 0) : 0;
                        $diferenciaShift = $shift->status === 'closed'
                            ? ($shift->difference ?? ($entregadoShift - $esperadoShift))
                            : 0;

                        $numViajes = $shift->total_trips ?? ($shift->trips ? $shift->trips->count() : 0);

                        $rutas = $shift->trips
                            ? $shift->trips
                                ->map(function ($trip) {
                                    return $trip->route->name ??
                                        ($trip->route->title ??
                                            ($trip->route->route_name ?? ($trip->route->nombre ?? null)));
                                })
                                ->filter()
                                ->unique()
                                ->implode(', ')
                            : '';

                        $envasesShift = 0;
                        if ($shift->trips) {
                            foreach ($shift->trips as $t) {
                                if ($t->details) {
                                    $envasesShift += $t->details->sum('recovered_bottles');
                                }
                            }
                        }
                    @endphp
                    <tr>
                        <td class="font-bold">{{ $shift->user->name ?? 'N/A' }}</td>
                        <td>
                            {{ \Carbon\Carbon::parse($shift->opened_at)->format('H:i') }}
                            -
                            @if ($shift->status === 'closed' && $shift->closed_at)
                                {{ \Carbon\Carbon::parse($shift->closed_at)->format('H:i') }}
                            @else
                                <span class="badge-open">EN CURSO</span>
                            @endif
                        </td>
                        <td>
                            <span class="badge-route">{{ $rutas ?: 'Sin ruta' }}</span>
                        </td>
                        <td class="text-center font-bold">{{ $numViajes }}</td>
                        <td class="text-center text-amber font-bold">{{ $envasesShift }}</td>
                        <td class="text-right" style="color: #64748b;">${{ number_format($shift->initial_cash, 2) }}</td>
                        <td class="text-right text-green">${{ number_format($ventasShift, 2) }}</td>
                        <td class="text-right text-red">${{ number_format($gastosShift, 2) }}</td>
                        <td class="text-right font-bold text-indigo">${{ number_format($esperadoShift, 2) }}</td>
                        <td class="text-right font-bold">
                            @if($shift->status === 'closed')
                                ${{ number_format($entregadoShift, 2) }}
                            @else
                                <span style="color: #94a3b8;">--</span>
                            @endif
                        </td>
                        <td class="text-right font-bold">
                            @if($shift->status === 'closed')
                                @if($diferenciaShift < -0.01)
                                    <span class="text-red">${{ number_format($diferenciaShift, 2) }}</span>
                                @elseif($diferenciaShift > 0.01)
                                    <span class="text-purple">+${{ number_format($diferenciaShift, 2) }}</span>
                                @else
                                    <span class="text-green">$0.00</span>
                                @endif
                            @else
                                <span style="color: #94a3b8;">--</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

    @empty
        <p class="text-center" style="padding: 15px; color: #64748b;">No existen registros de cajas para mostrar.</p>
    @endforelse

</body>

</html>
