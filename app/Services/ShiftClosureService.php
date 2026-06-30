<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\InventoryMovement;
use App\Models\TripDetail;
use App\Models\Product;
use App\Models\Expense;
use App\Models\Shift;
use App\Models\Trip;
use App\Models\Sale;
use Carbon\Carbon;

class ShiftClosureService
{
    /**
     * Calcula los totales esperados para un turno activo.
     */
    public function calculateClosure(Shift $shift): array
    {
        // NOTA: Aquí asumo que agregaste shift_id a tus ventas.
        // Si no, tendrías que filtrar por trip_id correspondientes al usuario.
        $sales = Sale::with('details.product')
            ->where('shift_id', $shift->id)
            ->get();

        // 1. Desglose por método de pago
        $cashSales = $sales->where('payment_method', 'cash')->sum('total');
        $transferSales = $sales->where('payment_method', 'transfer')->sum('total');
        $creditSales = $sales->where('payment_method', 'credit')->sum('total');
        // 1.5 🔥 GASTOS DEL TURNO
        $expenses = Expense::where('shift_id', $shift->id)
    ->sum('amount');

        // 2. Cálculo del efectivo esperado en caja
        // Efectivo inicial + Ventas en efectivo puro
        $expectedCash = $shift->initial_cash + $cashSales - $expenses;

        // 3. Resumen de inventario (Envases y Productos)
      $recoveredBottles = $sales
    ->flatMap->details
    ->filter(function ($detail) {

        return $detail->product
            && $detail->product->requires_return;

    })
    ->sum('recovered_bottles'); // Agrupamos los detalles para saber cuántos productos de cada tipo se vendieron
        $productold = $sales->flatMap->details->groupBy('product_id')->map(function ($details) {
            return [
                'product_id' => $details->first()->product_id,
                // Asumiendo que tienes la relación 'product' en SaleDetail
                'name'       => $details->first()->product->name ?? 'Producto Desconocido',
                'quantity'   => $details->sum('quantity'),
                'total'      => $details->sum('subtotal'),
            ];
        })->values()->all();

        return [
            'shift_id'          => $shift->id,
            'opened_at'         => $shift->opened_at->format('Y-m-d H:i:s'),
            'initial_cash'      => $shift->initial_cash,
            'sales_summary'     => [
                'cash'     => $cashSales,
                'transfer' => $transferSales,
                'credit'   => $creditSales,
                'total'    => $sales->sum('total'),
                ],
            'expenses' => $expenses,
            'expected_cash'     => $expectedCash,
            'inventory_summary' => [
            'recovered_bottles' => $recoveredBottles,
            'product_sold'     => $productold,
            ]
        ];
    }

    /**
     * Ejecuta el cierre definitivo del turno y reingresa el inventario.
     */
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
            // Como tu columna 'quantity' ya descuenta las ventas automáticamente,
            // este es exactamente el sobrante que debe regresar a bodega.
            $sobranteQueRegresa = $detalle->quantity;

            if ($sobranteQueRegresa > 0) {
                // 1. Sumamos el stock a la tabla Product
                $productoBodega = $detalle->product; // Ya lo tenemos cargado gracias al 'with'

                if ($productoBodega) {
                    $productoBodega->increment('current_stock', $sobranteQueRegresa);

                    InventoryMovement::create([
                        'company_id'  => $productoBodega->company_id,
                        'product_id'  => $productoBodega->id,
                        'type'        => 'in',
                        'quantity'    => $sobranteQueRegresa,
                        'description' => "Devolución de envaces llenos de agua al almacén. Turno ID: {$shift->id}",
                    ]);
                }
            }

            // 2. ACTUALIZAMOS trip_details (Usando tu modelo en lugar de DB::table)
            $detalle->update([
                'returned_quantity' => $sobranteQueRegresa
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
                    'recovered_bottles' => $recoveredBottles
                ]);

                // 2. Sumamos los envases vacíos a la tabla Product usando el producto dinámico
                $envaseProducto = $detalleEnvase->product;

                $envaseProducto->increment('empty_stock', $recoveredBottles);

                InventoryMovement::create([
                    'company_id'  => $envaseProducto->company_id,
                    'product_id'  => $envaseProducto->id,
                    'type'        => 'in',
                    'quantity'    => $recoveredBottles,
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
            'closed_at'  => Carbon::now(),
            'status'     => 'closed',
        ]);

        return $shift;
    }
}
