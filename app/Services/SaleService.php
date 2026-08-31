<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Trip;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class SaleService
{
    /**
     * Obtiene los viajes del usuario con contadores de métricas para el POS Móvil
     */
    public function getTripsWithMetrics($user, string $date)
    {
        return Trip::with(['route', 'products'])
            ->withCount('sales')
            ->withSum('sales', 'total')
            ->withCount(['sales as clientes_visitados' => function ($query) {
                $query->select(DB::raw('count(distinct(customer_id))'));
            }])
            ->where('company_id', $user->company_id)
            ->whereDate('date', $date)
            ->where(function($query) use ($user) {
                $query->where('seller_id', $user->id)
                      ->orWhere('driver_id', $user->id);
            })
            ->get();
    }

    /**
     * Procesa una venta generada desde el POS Móvil
     */
    public function createMobileSale(array $data, $shift)
    {
        return DB::transaction(function () use ($data, $shift) {

            if (!$shift) {
                throw new \Exception('No hay turno abierto para este usuario');
            }

            $trip = Trip::with([
                'products',
                'products.customerCategories'
            ])->findOrFail($data['trip_id']);

            $tripProducts = $trip->products->keyBy('id');

            $customer = Customer::select([
                'id',
                'customer_category_id',
                'bottle_debt'
            ])->find($data['customer_id']);

            /*
             |--------------------------------------------------------------------------
             | VALIDAR STOCK
             |--------------------------------------------------------------------------
             */
            foreach ($data['products'] as $item) {
                if ($item['quantity'] <= 0) {
                    continue;
                }

                $tripProduct = $tripProducts[$item['product_id']] ?? null;

                if (!$tripProduct) {
                    throw new \Exception('Producto no pertenece al viaje');
                }

                $stockDisponible = $tripProduct->pivot->quantity;

                if ($item['quantity'] > $stockDisponible) {
                    throw ValidationException::withMessages([
                        'products' => "Stock insuficiente para {$tripProduct->name}. Disponible: {$stockDisponible}"
                    ]);
                }
            }

            /*
             |--------------------------------------------------------------------------
             | CÁLCULO DE MONTOS, SALDOS Y ESTADO
             |--------------------------------------------------------------------------
             */
            $total = (float) $data['total'];
            $paymentMethod = $data['payment_method']; // 'cash', 'transfer', 'credit'

            if (in_array($paymentMethod, ['cash', 'transfer'])) {
                $paidAmount = $total;
                $initialPaymentMethod = $paymentMethod;
            } else { // credit
                $initialPayment = (float) ($data['initial_payment'] ?? 0);
                $paidAmount = min($total, max(0, $initialPayment));
                $initialPaymentMethod = $data['payment_type'] ?? 'cash'; // Con qué pagó el abono (cash/transfer)
            }

            $balanceAmount = round($total - $paidAmount, 2);

            if ($balanceAmount <= 0) {
                $status = 'paid';
            } elseif ($paidAmount > 0) {
                $status = 'partial';
            } else {
                $status = 'pending';
            }

            /*
             |--------------------------------------------------------------------------
             | CREAR VENTA
             |--------------------------------------------------------------------------
             */
            $companyId = $shift->company_id ?? auth()->user()->company_id;

            $sale = Sale::create([
                'company_id'     => $companyId,
                'trip_id'        => $trip->id,
                'customer_id'    => $customer?->id,
                'shift_id'       => $shift->id,
                'payment_method' => $paymentMethod,
                'total'          => $total,
                'paid_amount'    => $paidAmount,
                'balance_amount' => $balanceAmount,
                'status'         => $status,
            ]);

            /*
             |--------------------------------------------------------------------------
             | REGISTRAR PAGO INICIAL (PARA CUADRE DE CAJA DEL TURNO)
             |--------------------------------------------------------------------------
             */
            if ($paidAmount > 0) {
                Payment::create([
                    'company_id'     => $companyId,
                    'sale_id'        => $sale->id,
                    'customer_id'    => $customer?->id,
                    'shift_id'       => $shift->id, // Se imputa al turno actual del cobrador
                    'amount'         => $paidAmount,
                    'payment_method' => $initialPaymentMethod,
                    'notes'          => $paymentMethod === 'credit' ? 'Abono inicial en venta a crédito' : 'Pago al contado',
                ]);
            }

            $totalSoldBottles = 0;

            /*
             |--------------------------------------------------------------------------
             | DETALLE DE VENTA
             |--------------------------------------------------------------------------
             */
            foreach ($data['products'] as $item) {

                if ($item['quantity'] <= 0) {
                    continue;
                }

                $tripProduct = $tripProducts[$item['product_id']];
                $price = $item['price'];

                if (
                    $customer &&
                    $customer->customer_category_id &&
                    $tripProduct->customerCategories->isNotEmpty()
                ) {
                    $categoryPrice = $tripProduct->customerCategories
                        ->firstWhere('id', $customer->customer_category_id);

                    if ($categoryPrice) {
                        $price = $categoryPrice->pivot->price;
                    }
                }

                SaleDetail::create([
                    'sale_id'           => $sale->id,
                    'product_id'        => $item['product_id'],
                    'quantity'          => $item['quantity'],
                    'recovered_bottles' => $data['returned_bottles'] ?? 0,
                    'unit_price'        => $price,
                    'subtotal'          => $item['quantity'] * $price,
                ]);

                // Descontar stock del viaje
                $trip->products()->updateExistingPivot(
                    $item['product_id'],
                    [
                        'quantity' => $tripProduct->pivot->quantity - $item['quantity']
                    ]
                );

                if ($tripProduct->requires_return) {
                    $totalSoldBottles += $item['quantity'];
                }
            }

            /*
             |--------------------------------------------------------------------------
             | ACTUALIZAR DEUDA DE ENVASES
             |--------------------------------------------------------------------------
             */
            if ($customer) {
                $returnedBottles = $data['returned_bottles'] ?? 0;
                $difference = $totalSoldBottles - $returnedBottles;

                if ($difference > 0) {
                    $customer->increment('bottle_debt', $difference);
                } elseif ($difference < 0) {
                    $newDebt = max(0, $customer->bottle_debt - abs($difference));
                    $customer->update(['bottle_debt' => $newDebt]);
                }
            }

            return $sale->fresh([
                'details',
                'customer',
                'payments'
            ]);
        });
    }
}