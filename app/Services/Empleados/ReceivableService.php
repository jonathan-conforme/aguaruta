<?php

namespace App\Services\Empleados;

use App\Models\Sale;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;

class ReceivableService
{
    /**
     * Obtiene las ventas con saldo pendiente de una empresa.
     */
    public function getPendingSalesData(int $companyId, ?string $search = null): array
    {
        $query = Sale::with(['customer', 'payments.shift.user', 'shift.user'])
            ->where('company_id', $companyId)
            ->where('balance_amount', '>', 0);

        $totalDebt = (clone $query)->sum('balance_amount');
        $pendingCount = (clone $query)->where('status', 'pending')->count();
        $partialCount = (clone $query)->where('status', 'partial')->count();

        $sales = $query->when($search, function ($q, $search) {
                $q->whereHas('customer', function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('identification', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return [
            'sales' => $sales,
            'stats' => [
                'total_debt'    => $totalDebt,
                'pending_count' => $pendingCount,
                'partial_count' => $partialCount,
            ]
        ];
    }

    /**
     * Obtiene el historial de cobros filtrado únicamente por el empleado (solo abonos a crédito).
     */
    public function getEmployeePaymentHistory(int $userId, array $filters = []): array
    {
        $query = Payment::whereHas('shift', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        // FILTRO: Solo pagos de ventas cuyo método inicial fue crédito
        ->whereHas('sale', function ($q) {
            $q->where('payment_method', 'credit');
        })
        ->with(['sale.customer', 'shift']);

        $this->applyPaymentFilters($query, $filters);

        $stats = [
            'total_collected' => (clone $query)->sum('amount'),
            'total_cash'      => (clone $query)->where('payment_method', 'cash')->sum('amount'),
            'total_transfer'  => (clone $query)->where('payment_method', 'transfer')->sum('amount'),
        ];

        return [
            'payments' => $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString(),
            'stats'    => $stats,
        ];
    }

    /**
     * Obtiene el historial de cobros global de la empresa para el Admin (solo abonos a crédito).
     */
    public function getCompanyPaymentHistory(int $companyId, array $filters = []): array
    {
        $query = Payment::whereHas('sale', function ($q) use ($companyId) {
            $q->where('company_id', $companyId)
              ->where('payment_method', 'credit'); // FILTRO: Solo pagos de ventas a crédito
        })->with(['sale.customer', 'shift.user']);

        $this->applyPaymentFilters($query, $filters);

        $stats = [
            'total_collected' => (clone $query)->sum('amount'),
            'total_cash'      => (clone $query)->where('payment_method', 'cash')->sum('amount'),
            'total_transfer'  => (clone $query)->where('payment_method', 'transfer')->sum('amount'),
        ];

        return [
            'payments' => $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString(),
            'stats'    => $stats,
        ];
    }

    /**
     * Aplica los filtros de búsqueda, método de pago y rango de fechas a la consulta.
     */
    private function applyPaymentFilters(Builder $query, array $filters): void
    {
        $search = $filters['search'] ?? null;
        $paymentMethod = $filters['payment_method'] ?? null;
        $startDate = $filters['start_date'] ?? null;
        $endDate = $filters['end_date'] ?? null;

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('sale.customer', fn($c) => $c->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('shift.user', fn($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhere('reference_number', 'like', "%{$search}%")
                  ->orWhere('sale_id', $search);
            });
        }

        if ($paymentMethod) {
            $query->where('payment_method', $paymentMethod);
        }

        if ($startDate && $endDate) {
            $query->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        } elseif ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        } elseif ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }
    }
}
