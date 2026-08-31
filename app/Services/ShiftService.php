<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Sale;
use App\Models\Shift;
use Barryvdh\DomPDF\Facade\Pdf;

class ShiftService
{
    public function getEmployeeShifts()
    {
        return Shift::with([
            'user:id,name',
            'trips' => function ($query) {
                $query->where('status', 'completed')
                    ->with('route')
                    ->withSum([
                        'sales as cash_sales_sum_total' => function ($query) {
                            $query->where('payment_method', 'cash');
                        },
                    ], 'total');
            },
        ])
            ->withSum('expenses', 'amount')
            ->where('user_id', auth()->id()) // ← filtro importante
            ->orderBy('opened_at', 'desc')
            ->paginate(15)
            ->withQueryString();
    }

    public function getAdminShifts()
    {
        return Shift::with([
            'user:id,name',
            'trips' => function ($query) {
                $query->where('status', 'completed')
                    ->with('route')
                    ->withSum([
                        'sales as cash_sales_sum_total' => function ($query) {
                            $query->where('payment_method', 'cash');
                        },
                    ], 'total');
            },
        ])
            ->withSum('expenses', 'amount')
            ->latest('opened_at')
            ->paginate(15);
    }
   public function getShiftsData(?string $startDate = null, ?string $endDate = null)
{
    $user = auth()->user();
    $query = Shift::query();

    if ($user->role === 'empleado' || $user->role === 'repartidor') {
        $query->where('user_id', $user->id);
    }

    // Filtro por Rango de Fechas
    if ($startDate && $endDate) {
        $query->whereBetween('opened_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
    } elseif ($startDate) {
        $query->whereDate('opened_at', '>=', $startDate);
    } elseif ($endDate) {
        $query->whereDate('opened_at', '<=', $endDate);
    }

    $shiftIds = (clone $query)->pluck('id');

    // Totales globales
    $totalInicial = (float) (clone $query)->sum('initial_cash');
    $totalEntregado = (float) (clone $query)->where('status', 'closed')->sum('final_cash');
    $totalGastos  = (float) Expense::whereIn('shift_id', $shiftIds)->sum('amount');
    $totalVentas  = (float) Sale::where('payment_method', 'cash')
        ->whereHas('trip', fn($q) => $q->where('status', 'completed')->whereIn('shift_id', $shiftIds))
        ->sum('total');

        $totalEsperado = $totalInicial + $totalVentas - $totalGastos;
        $diferenciaTotal = $totalEntregado - $totalEsperado;

    return [
        'shifts' => $query->with([
            'user:id,name',
            'trips' => function ($q) {
                $q->where('status', 'completed')
                    ->with('route')
                    ->withSum([
                        'sales as cash_sales_sum_total' => function ($sq) {
                            $sq->where('payment_method', 'cash');
                        },
                    ], 'total');
            },
        ])
            ->withSum('expenses', 'amount')
            ->latest('opened_at')
            ->paginate(15)
            ->withQueryString(),
        'totals' => [
            'totalVentas'  => $totalVentas,
            'totalGastos'  => $totalGastos,
            'totalInicial' => $totalInicial,
            'totalEsperado'   => $totalEsperado,
            'totalEntregado'  => $totalEntregado,
            'diferenciaTotal' => $diferenciaTotal,
        ],
    ];
}


    public function generatePdfReport(?string $startDate = null, ?string $endDate = null)
{
    $user = auth()->user();

    $query = Shift::with([
        'user:id,name',
        'trips' => function ($query) {
            $query->where('status', 'completed')
                ->with([
                    'route', // Cargamos la ruta de entrega
                    'details', // Cargamos los detalles para sumar envases
                ])
                ->withSum([
                    'sales as cash_sales_sum_total' => function ($q) {
                        $q->where('payment_method', 'cash');
                    },
                ], 'total');
        },
    ])
        ->withCount(['trips as total_trips' => function ($query) {
            $query->where('status', 'completed');
        }])
        ->withSum('expenses', 'amount');

    // Filtro por rol
    if ($user->role === 'empleado' || $user->role === 'repartidor') {
        $query->where('user_id', $user->id);
    }

    // === FILTRO POR RANGO DE FECHAS ===
    if ($startDate && $endDate) {
        $query->whereBetween('opened_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
    } elseif ($startDate) {
        $query->whereDate('opened_at', '>=', $startDate);
    } elseif ($endDate) {
        $query->whereDate('opened_at', '<=', $endDate);
    }

    $shifts = $query
        ->latest('opened_at')
        ->get();

    // Pasamos las fechas a la vista para poder mostrarlas en el encabezado del PDF
    return Pdf::loadView('pdf.shifts_report', compact('shifts', 'startDate', 'endDate'));
}
}
