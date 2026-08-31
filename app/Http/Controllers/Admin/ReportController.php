<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{


 

    public function downloadSalesReport(Request $request)
    {
        $user = auth()->user();
        $companyId = $user->company_id;
        $startDateInput = $request->query('start_date');
        $endDateInput = $request->query('end_date');
        $range = $request->query('range', 'day');
        $dateInput = $request->query('date', Carbon::today()->toDateString());

        // Prioridad al rango personalizado de la vista; si no existe, procesa el selector rápido
        if ($startDateInput && $endDateInput) {
            $startDate = Carbon::parse($startDateInput)->startOfDay();
            $endDate = Carbon::parse($endDateInput)->endOfDay();
        } else {
            $referenceDate = Carbon::parse($dateInput);
            switch ($range) {
                case 'week':
                    $startDate = $referenceDate->copy()->startOfWeek();
                    $endDate = $referenceDate->copy()->endOfWeek();
                    break;
                case 'fortnight':
                    if ($referenceDate->day <= 15) {
                        $startDate = $referenceDate->copy()->startOfMonth();
                        $endDate = $referenceDate->copy()->day(15)->endOfDay();
                    } else {
                        $startDate = $referenceDate->copy()->day(16)->startOfDay();
                        $endDate = $referenceDate->copy()->endOfMonth();
                    }
                    break;
                case 'month':
                    $startDate = $referenceDate->copy()->startOfMonth();
                    $endDate = $referenceDate->copy()->endOfMonth();
                    break;
                case 'day':
                default:
                    $startDate = $referenceDate->copy()->startOfDay();
                    $endDate = $referenceDate->copy()->endOfDay();
                    break;
            }
        }

        // 1. Iniciar la consulta en la variable $query
        $query = Sale::where('company_id', $companyId)
            ->whereBetween('created_at', [$startDate, $endDate]);

        // 2. Si NO es admin ni super_admin, filtrar solo por el vendedor asignado al turno (shift)
        if (! in_array($user->role, ['admin', 'super_admin'])) {
            $query->whereHas('shift', function ($shiftQuery) use ($user) {
                $shiftQuery->where('user_id', $user->id);
            });
        }

        // 3. Obtener los resultados
        $sales = $query->with([
            'shift.user:id,name',
            'user:id,name',
            'customer:id,name',
            'trip:id,trip_number',
            'details.product:id,name',
        ])
            ->orderBy('created_at', 'asc')
            ->get();

        // Totales generales para las tarjetas del PDF
        $totalEarned = $sales->sum('total');
        $cashEarned = $sales->where('payment_method', 'cash')->sum('total');
        $transferEarned = $sales->where('payment_method', 'transfer')->sum('total');
        $creditEarned = $sales->where('payment_method', 'credit')->sum('total');

        $pdf = Pdf::loadView('pdf.sales_report', compact(
            'sales',
            'startDate',
            'endDate',
            'totalEarned',
            'cashEarned',
            'transferEarned',
            'creditEarned'
        ));

        $filename = 'Reporte_Ventas_'.$startDate->format('Y-m-d').'_al_'.$endDate->format('Y-m-d').'.pdf';

        return $pdf->download($filename);
    }
}
