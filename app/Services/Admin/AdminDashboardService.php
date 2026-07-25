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
            ->where('status', 'completed') // Solo considerar compras completadas
            ->sum('total_amount');

        // Calculamos la Utilidad Neta (Ventas - Compras)
        $utilidades = $monthSales - $monthPurchases;

        $productsSoldToday = SaleDetail::where('company_id', $companyId)
            ->whereDate('created_at', $hoy)
            ->sum('quantity');

        $recoveredBottles = SaleDetail::where('company_id', $companyId)
            ->whereDate('created_at', $hoy)
            ->sum('recovered_bottles');

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
        ];
    }
}
