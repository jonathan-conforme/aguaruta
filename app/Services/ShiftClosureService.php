<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Shift;
use App\Models\Trip;
use App\Models\TripDetail;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ShiftClosureService
{
    /**
     * Calcula los totales esperados para un turno activo.
     */
    public function calculateClosure(Shift $shift): array
    {
        $sales = Sale::with('details.product')
            ->where('shift_id', $shift->id)
            ->get();

        // 1. Desglose por método de pago
        $cashSales = $sales->where('payment_method', 'cash')->sum('total');
        $transferSales = $sales->where('payment_method', 'transfer')->sum('total');
        $creditSales = $sales->where('payment_method', 'credit')->sum('total');
        // GASTOS DEL TURNO
        $expenses = Expense::where('shift_id', $shift->id)
            ->sum('amount');

        // Efectivo inicial + Ventas en efectivo puro
        $expectedCash = $shift->initial_cash + $cashSales - $expenses;

        // Resumen de inventario (Envases y Productos)
        $recoveredBottles = $sales
            ->flatMap->details
            ->filter(function ($detail) {

                return $detail->product
                    && $detail->product->requires_return;

            })
            ->sum('recovered_bottles');
        $productold = $sales->flatMap->details->groupBy('product_id')->map(function ($details) {
            return [
                'product_id' => $details->first()->product_id,
                'name' => $details->first()->product->name ?? 'Producto Desconocido',
                'quantity' => $details->sum('quantity'),
                'total' => $details->sum('subtotal'),
            ];
        })->values()->all();

        return [
            'shift_id' => $shift->id,
            'opened_at' => $shift->opened_at->format('Y-m-d H:i:s'),
            'initial_cash' => $shift->initial_cash,
            'sales_summary' => [
                'cash' => $cashSales,
                'transfer' => $transferSales,
                'credit' => $creditSales,
                'total' => $sales->sum('total'),
            ],
            'expenses' => $expenses,
            'expected_cash' => $expectedCash,
            'inventory_summary' => [
                'recovered_bottles' => $recoveredBottles,
                'product_sold' => $productold,
            ],
        ];
    }

    /**
     * Ejecuta el cierre definitivo del turno y reingresa el inventario.
     */
    public function closeShift(Shift $shift, float $declaredCash): Shift
    {
        // 1. Obtenemos el resumen exacto de lo que se vendió
        $closureData = $this->calculateClosure($shift);

        // --- 2. LÓGICA DE INVENTARIO: DEVOLVER SOBRANTES A BODEGA Y ACTUALIZAR TRIP_DETAILS ---

        // Traemos todos los detalles de los viajes activos de este turno, incluyendo el modelo de producto
        $detallesViaje = TripDetail::with('product')->whereHas('trip', function ($query) use ($shift) {
            $query->where('shift_id', $shift->id)
                ->whereIn('status', ['active', 'completed']);
        })->get();

        foreach ($detallesViaje as $detalle) {
            //  sobrante que debe regresar a bodega.
            $sobranteQueRegresa = $detalle->quantity;

            if ($sobranteQueRegresa > 0) {
                // 1. Sumamos el stock a la tabla Product
                $productoBodega = $detalle->product;

                if ($productoBodega) {
                    $productoBodega->increment('current_stock', $sobranteQueRegresa);

                    InventoryMovement::create([
                        'company_id' => $productoBodega->company_id,
                        'product_id' => $productoBodega->id,
                        'type' => 'in',
                        'quantity' => $sobranteQueRegresa,
                        'description' => "Devolución de envaces llenos de agua al almacén. Turno ID: {$shift->id}",
                    ]);
                }
            }

            // 2. ACTUALIZAMOS trip_details (Usando tu modelo en lugar de DB::table)
            $detalle->update([
                'returned_quantity' => $sobranteQueRegresa,
            ]);
        }

        // --- 3. LÓGICA DE ENVASES: GUARDAR EN TRIP_DETAILS Y ACTUALIZAR BODEGA ---

        $recoveredBottles = $closureData['inventory_summary']['recovered_bottles'];

        if ($recoveredBottles > 0) {
            // 1. Buscamos dinámicamente cuál producto de este viaje requiere retorno
            $detalleEnvase = $detallesViaje->first(function ($detalle) {
                return $detalle->product && $detalle->product->requires_return;
            });

            if ($detalleEnvase) {
                // Guardamos la cantidad de envases recuperados en la tabla trip_details
                $detalleEnvase->update([
                    'recovered_bottles' => $recoveredBottles,
                ]);

                // 2. Sumamos los envases vacíos a la tabla Product usando el producto dinámico
                $envaseProducto = $detalleEnvase->product;

                $envaseProducto->increment('empty_stock', $recoveredBottles);

                InventoryMovement::create([
                    'company_id' => $envaseProducto->company_id,
                    'product_id' => $envaseProducto->id,
                    'type' => 'in',
                    'quantity' => $recoveredBottles,
                    'description' => "Ingreso de envases vacios recuperados en ruta. Turno ID: {$shift->id}",
                ]);
            }
        }

        // --- 4. COMPLETAR LOS VIAJES DEL TURNO ---
        // Mucho más seguro buscar por shift_id que por seller_id y fechas
        Trip::where('shift_id', $shift->id)
            ->where('status', 'active')
            ->update(['status' => 'completed']);

        // --- 5. CIERRE FINAL DEL TURNO ---
        $shift->update([
            'final_cash' => $declaredCash,
            'closed_at' => Carbon::now(),
            'status' => 'closed',
        ]);

        // --- 5. CIERRE FINAL DEL TURNO ---
        $expectedCash = $closureData['expected_cash'];
        $difference = $declaredCash - $expectedCash; // Negativo = Faltante | Positivo = Sobrante

        $shift->update([
            'final_cash' => $declaredCash,
            'expected_cash' => $expectedCash, // Opcional si agregaste la columna
            'closed_at' => Carbon::now(),
            'status' => 'closed',
        ]);

        return $shift;
    }
}
