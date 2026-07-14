<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Trip;
use App\Models\Customer;

class AdminDashboardService
{
    public function getStats($companyId)
{
    // Obtenemos la fecha de hoy en formato '2026-07-13' de forma segura
    $hoy = now()->toDateString();

    $todaySales = Sale::where('company_id', $companyId)
        ->whereDate('created_at', $hoy) // Comparación directa de texto
        ->sum('total');

    $monthSales = Sale::where('company_id', $companyId)
        ->whereMonth('created_at', now()->month)
        ->whereYear('created_at', now()->year)
        ->sum('total');

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
        'todaySales' => (float) $todaySales, // Forzamos a que sea número flotante
        'monthSales' => (float) $monthSales,
        'productsSoldToday' => (int) $productsSoldToday,
        'recoveredBottles' => (int) $recoveredBottles,
        'activeTrips' => $activeTrips,
        'pendingTrips' => $pendingTrips,
        'completedTrips' => $completedTrips,
        'totalCustomers' => $totalCustomers,
        'lowStockProducts' => $lowStockProducts,
    ];
}
}
