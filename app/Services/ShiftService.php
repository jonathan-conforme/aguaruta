<?php
namespace App\Services;

use App\Models\Shift;

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
                    }
                ], 'total');
        }
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
                    }
                ], 'total');
        }
    ])
    ->withSum('expenses', 'amount')
    ->latest('opened_at')
    ->paginate(15);
}
}