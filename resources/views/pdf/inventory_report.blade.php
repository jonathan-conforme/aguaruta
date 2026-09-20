<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Inventario y Movimientos</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 9px; color: #1e293b; margin: 0; padding: 10px; }
        .header { border-bottom: 2px solid #4f46e5; padding-bottom: 6px; margin-bottom: 12px; }
        .header h1 { margin: 0; font-size: 16px; color: #0f172a; }
        .subtitle { font-size: 8px; color: #64748b; margin-top: 2px; }

        /* SECCIÓN STOCK ACTUAL EN BODEGA */
        .section-title { font-size: 10px; font-weight: bold; color: #334155; margin: 10px 0 5px 0; text-transform: uppercase; border-left: 3px solid #4f46e5; padding-left: 5px; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        th { background: #f1f5f9; color: #334155; text-align: left; font-size: 8px; font-weight: bold; padding: 5px; border-bottom: 1.5px solid #cbd5e1; }
        td { padding: 5px; border-bottom: 1px solid #f1f5f9; font-size: 8.5px; vertical-align: middle; }

        .badge { padding: 2px 4px; border-radius: 3px; font-size: 7px; font-weight: bold; text-transform: uppercase; display: inline-block; }
        .badge-in { background: #dcfce7; color: #15803d; }
        .badge-out { background: #fee2e2; color: #b91c1c; }
        .badge-pack { background: #e0e7ff; color: #4338ca; }

        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-slate { color: #64748b; }
    </style>
</head>
<body>

    <div class="header">
        <h1>Reporte de Inventario y Auditoría de Movimientos</h1>
        <div class="subtitle">
            Generado el: <strong>{{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}</strong> |
            Generado por: <strong>{{ auth()->user()->name }}</strong>
        </div>
    </div>

    <!-- RESUMEN DE STOCK ACTUAL -->
    <div class="section-title">1. Balance Actual de Stock en Bodega</div>
    <table>
        <thead>
            <tr>
                <th width="40%">Producto</th>
                <th width="20%">Presentación</th>
                <th width="20%" class="text-center">Stock Llenos</th>
                <th width="20%" class="text-center">Stock Vacíos</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products as $product)
                <tr>
                    <td class="font-bold">{{ $product->name }}</td>
                    <td class="text-slate">
                        {{ $product->units_per_package > 1 ? 'Paca x' . $product->units_per_package : 'Unidad Suelta' }}
                    </td>
                    <td class="text-center font-bold" style="color: #16a34a;">
                        {{ $product->current_stock ?? 0 }} unds
                    </td>
                    <td class="text-center font-bold" style="color: #d97706;">
                        {{ $product->empty_stock ?? 0 }} unds
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <!-- HISTORIAL DE MOVIMIENTOS EN EL RANGO -->
    <div class="section-title">2. Historial de Movimientos Registrados</div>
    <table>
        <thead>
            <tr>
                <th width="15%">Fecha/Hora</th>
                <th width="25%">Producto</th>
                <th width="15%" class="text-center">Tipo</th>
                <th width="12%" class="text-center">Cantidad</th>
                <th width="33%">Motivo / Descripción</th>
            </tr>
        </thead>
        <tbody>
            @forelse($movements as $mov)
                <tr>
                    <td>
                        {{ \Carbon\Carbon::parse($mov->created_at)->format('d/m/Y') }}<br>
                        <small class="text-slate">{{ \Carbon\Carbon::parse($mov->created_at)->format('H:i') }}</small>
                    </td>
                    <td class="font-bold">{{ $mov->product?->name ?? 'N/A' }}</td>
                    <td class="text-center">
                        @if($mov->type === 'in')
                            <span class="badge badge-in">ENTRADA</span>
                        @elseif($mov->type === 'out')
                            <span class="badge badge-out">SALIDA</span>
                        @else
                            <span class="badge badge-pack">ENVASADO</span>
                        @endif
                    </td>
                    <td class="text-center font-bold">
                        {{ $mov->type === 'in' ? '+' : ($mov->type === 'out' ? '-' : '') }}{{ $mov->quantity }}
                    </td>
                    <td>
                        <div>
                            @if($mov->type === 'packaging')
                                Se transformaron {{ $mov->quantity }} de vacíos a llenos
                            @elseif($mov->type === 'in')
                                Ingresaron {{ $mov->quantity }} unidades
                            @else
                                Salieron {{ $mov->quantity }} unidades
                            @endif
                        </div>
                        @if($mov->description)
                            <small class="text-slate" style="font-style: italic;">"{{ $mov->description }}"</small>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="text-center text-slate" style="padding: 15px;">
                        No se registraron movimientos en este período.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

</body>
</html>
