<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Shift;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Helper privado para reutilizar el cálculo de fechas en cualquier reporte.
     */
    private function getFilterDates(Request $request): array
{
    $startDateInput = $request->query('start_date');
    $endDateInput = $request->query('end_date');
    $range = $request->query('range', 'day');
    $dateInput = $request->query('date', Carbon::today()->toDateString());

    if ($startDateInput && $endDateInput) {
        return [
            Carbon::parse($startDateInput)->startOfDay(),
            Carbon::parse($endDateInput)->endOfDay()
        ];
    }

    $referenceDate = Carbon::parse($dateInput);

    switch ($range) {
        case 'yesterday': // <-- AGREGAR ESTE CASO
            return [
                $referenceDate->copy()->subDay()->startOfDay(),
                $referenceDate->copy()->subDay()->endOfDay()
            ];
        case 'week':
            return [$referenceDate->copy()->startOfWeek(), $referenceDate->copy()->endOfWeek()];
        case 'fortnight':
            if ($referenceDate->day <= 15) {
                return [$referenceDate->copy()->startOfMonth(), $referenceDate->copy()->day(15)->endOfDay()];
            }
            return [$referenceDate->copy()->day(16)->startOfDay(), $referenceDate->copy()->endOfMonth()];
        case 'month':
            return [$referenceDate->copy()->startOfMonth(), $referenceDate->copy()->endOfMonth()];
        case 'day':
        default:
            return [$referenceDate->copy()->startOfDay(), $referenceDate->copy()->endOfDay()];
    }
}
    /**
     * 1. Reporte Detallado de Ventas (PDF)
     */
    public function downloadSalesReport(Request $request)
    {
        $user = auth()->user();
        [$startDate, $endDate] = $this->getFilterDates($request);

        $query = Sale::where('company_id', $user->company_id)
            ->whereBetween('created_at', [$startDate, $endDate]);

        if (! in_array($user->role, ['admin', 'super_admin'])) {
            $query->whereHas('shift', fn($q) => $q->where('user_id', $user->id));
        }

        $sales = $query->with(['shift.user', 'customer', 'trip', 'details.product'])
            ->orderBy('created_at', 'asc')
            ->get();

        $totalEarned = $sales->sum('total');
        $cashEarned = $sales->where('payment_method', 'cash')->sum('total');
        $transferEarned = $sales->where('payment_method', 'transfer')->sum('total');
        $creditEarned = $sales->where('payment_method', 'credit')->sum('total');

        $pdf = Pdf::loadView('pdf.sales_report', compact(
            'sales', 'startDate', 'endDate', 'totalEarned', 'cashEarned', 'transferEarned', 'creditEarned'
        ));

        return $pdf->download('Reporte_Ventas_'.$startDate->format('Y-m-d').'_al_'.$endDate->format('Y-m-d').'.pdf');
    }

    /**
     * 2. Reporte de Cajas y Turnos / Choferes (PDF)
     */
    public function downloadShiftsReport(Request $request)
    {
        $user = auth()->user();
        [$startDate, $endDate] = $this->getFilterDates($request);

        $shifts = Shift::where('company_id', $user->company_id)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->with(['user', 'trips.details.product', 'sales'])
            ->get();

        $pdf = Pdf::loadView('pdf.shifts_report', compact('shifts', 'startDate', 'endDate'));

        return $pdf->download('Reporte_Cajas_'.$startDate->format('Y-m-d').'.pdf');
    }

    /**
     * 3. Reporte de Inventario y Movimientos de Almacén (PDF)
     */
    public function downloadInventoryReport(Request $request)
    {
        $user = auth()->user();
        [$startDate, $endDate] = $this->getFilterDates($request);

        // Balance actual de stock
        $products = Product::where('company_id', $user->company_id)->get();

        // Movimientos filtrados por rango
        $movements = InventoryMovement::with('product')
            ->whereHas('product', fn($q) => $q->where('company_id', $user->company_id))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.inventory_report', compact('products', 'movements', 'startDate', 'endDate'));

        return $pdf->download('Reporte_Inventario_'.$startDate->format('Y-m-d').'.pdf');
    }
}
