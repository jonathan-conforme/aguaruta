<?php

namespace App\Services;

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

    public function generatePdfReport(?string $date = null)
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

        // Filtro por fecha
        if ($date) {
            $query->whereDate('opened_at', $date);
        }

        $shifts = $query
            ->latest('opened_at')
            ->get();

        return Pdf::loadView('pdf.shifts_report', compact('shifts'));
    }
}
