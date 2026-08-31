<?php
namespace App\Services\Admin;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Trip;
use App\Models\Customer;
use App\Models\Purchase;

class AdminDashboardService
{
    public function getStats($companyId)
    {
        $hoy = now()->toDateString();
        $mesActual = now()->month;
        $anioActual = now()->year;

        // Ventas de hoy
        $todaySales = Sale::where('company_id', $companyId)
            ->whereDate('created_at', $hoy)
            ->sum('total');

        // Ventas del mes
        $monthSales = Sale::where('company_id', $companyId)
            ->whereMonth('created_at', $mesActual)
            ->whereYear('created_at', $anioActual)
            ->sum('total');

        // Compras del mes (Egresos)
        $monthPurchases = Purchase::where('company_id', $companyId)
            ->whereMonth('purchase_date', $mesActual)
            ->whereYear('purchase_date', $anioActual)
            ->where('status', 'completed')
            ->sum('total_amount');

        // Utilidad Neta
        $utilidades = $monthSales - $monthPurchases;

        // Productos vendidos hoy
        $productsSoldToday = SaleDetail::whereHas('sale', function ($query) use ($companyId, $hoy) {
            $query->where('company_id', $companyId)
                  ->whereDate('created_at', $hoy);
        })->sum('quantity');

        // Envases recuperados hoy
        $recoveredBottles = SaleDetail::whereHas('sale', function ($query) use ($companyId, $hoy) {
            $query->where('company_id', $companyId)
                  ->whereDate('created_at', $hoy);
        })->sum('recovered_bottles');

        $activeTrips = Trip::where('company_id', $companyId)
            ->where('status', 'active')
            ->count();

        $pendingTrips = Trip::where('company_id', $companyId)
            ->where('status', 'pending')
            ->count();

        $completedTrips = Trip::where('company_id', $companyId)
            ->where('status', 'completed')
            ->count();

        $totalCustomers = Customer::where('company_id', $companyId)->count();

        $lowStockProducts = Product::where('company_id', $companyId)
            ->where('current_stock', '<=', 10)
            ->count();

        // 1. FLUJO DE VENTAS SEMANAL (Lunes a Domingo de la semana actual)
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();

        $weeklySalesRaw = Sale::where('company_id', $companyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->pluck('total', 'date');

        $weeklySalesFlow = [];
        for ($i = 0; $i < 7; $i++) {
            $dateString = $startOfWeek->copy()->addDays($i)->toDateString();
            $weeklySalesFlow[] = (float) ($weeklySalesRaw[$dateString] ?? 0);
        }

        // 2. FLUJO DE VENTAS MENSUAL (Enero a Diciembre del año actual)
        $monthlySalesRaw = Sale::where('company_id', $companyId)
            ->whereYear('created_at', $anioActual)
            ->selectRaw('MONTH(created_at) as month, SUM(total) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $monthlySalesFlow = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthlySalesFlow[] = (float) ($monthlySalesRaw[$m] ?? 0);
        }

        return [
            'todaySales'        => (float) $todaySales,
            'monthSales'        => (float) $monthSales,
            'monthPurchases'    => (float) $monthPurchases,
            'utilidades'        => (float) $utilidades,
            'productsSoldToday' => (int) $productsSoldToday,
            'recoveredBottles'  => (int) $recoveredBottles,
            'activeTrips'       => $activeTrips,
            'pendingTrips'      => $pendingTrips,
            'completedTrips'    => $completedTrips,
            'totalCustomers'    => $totalCustomers,
            'lowStockProducts'  => $lowStockProducts,
            'weeklySalesFlow'   => $weeklySalesFlow,
            'monthlySalesFlow'  => $monthlySalesFlow,
        ];
    }
}
