<?php

namespace App\Services\Empleados;

use App\Models\Shift;
use App\Models\Expense;
use App\Models\Sale; 
use Illuminate\Support\Facades\DB;

class EmpleadosDashboardService
{
   public function getStats($companyId)
    {
        $userId = auth()->id();

        // 1. Buscamos el turno activo de hoy para este repartidor
        $activeShift = Shift::where('company_id', $companyId)
            ->where('user_id', $userId)
            ->where('status', 'open') // O el estado que uses para turnos activos (ej: 'active' o 'open')
            ->latest()
            ->first();

        // Si no hay un turno activo, retornamos valores en cero para no romper la vista
        if (!$activeShift) {
            return [
                'stats' => [
                    'totalProductsSold' => 0,
                    'totalExpenses'     => '$0.00',
                    'collectedCash'     => '$0.00',
                ]
            ];
        }

        // 2. Sumamos los gastos del turno activo usando la tabla que me compartiste
        $totalExpenses = Expense::where('shift_id', $activeShift->id)
            ->sum('amount');

        // 3. Obtener el total de ventas en efectivo de este turno
        // Ajusta los nombres de columnas según tu base de datos (ej: payment_method, total, etc.)
        $totalSalesCash = Sale::where('shift_id', $activeShift->id)
            ->where('payment_method', 'cash') // Filtramos solo efectivo para el "efectivo en mano"
            ->sum('total');

        // 4. Cantidad de productos físicos vendidos en el turno
        // Si tienes una relación "saleDetails", sumamos las cantidades. Si no, contamos las transacciones de venta.
        $totalProductsSold = DB::table('sale_details')
            ->join('sales', 'sales.id', '=', 'sale_details.sale_id')
            ->where('sales.shift_id', $activeShift->id)
            ->sum('sale_details.quantity');

        // Si no manejas detalle de productos todavía, puedes usar un conteo de ventas simple como alternativa:
        // $totalProductsSold = Sale::where('shift_id', $activeShift->id)->count();

        // 5. Calculamos el Efectivo Neto en Mano
        $netCash = $totalSalesCash - $totalExpenses;

        return [
            'stats' => [
                'totalProductsSold' => (int) $totalProductsSold,
                'totalExpenses'     => '$' . number_format($totalExpenses, 2),
                'collectedCash'     => '$' . number_format($netCash, 2),
            ]
        ];
    }
}
