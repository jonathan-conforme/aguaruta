<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Trip;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class SaleService
{
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

            // Optimización: acceso O(1) a los productos
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
             | CREAR VENTA
             |--------------------------------------------------------------------------
             */
            $sale = Sale::create([
                'trip_id'          => $trip->id,
                'customer_id'      => $customer?->id,
                'user_id'          => auth()->id(),
                'payment_method'   => $data['payment_method'],
                'total'            => $data['total'],
                'shift_id'         => $shift->id,
                'returned_bottles' => $data['returned_bottles'] ?? 0,
            ]);

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

                // Precio por categoría de cliente
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
                    'sale_id'            => $sale->id,
                    'product_id'         => $item['product_id'],
                    'quantity'           => $item['quantity'],
                    'recovered_bottles'  => $data['returned_bottles'] ?? 0,
                    'unit_price'         => $price,
                    'subtotal'           => $item['quantity'] * $price,
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

                    // Evita dejar la deuda negativa
                    $newDebt = max(
                        0,
                        $customer->bottle_debt - abs($difference)
                    );

                    $customer->update([
                        'bottle_debt' => $newDebt
                    ]);
                }
            }

            return $sale->fresh([
                'details',
                'customer'
            ]);
        });
    }
}