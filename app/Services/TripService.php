<?php

namespace App\Services;

use Illuminate\Validation\ValidationException;
use App\Models\Trip;
use App\Models\InventoryMovement;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TripService
{
    public function getAllTrips()
    {
        // Traemos los viajes con sus relaciones para no hacer consultas de más (Eager Loading)
        return Trip::with(['driver', 'seller', 'helper1', 'helper2', 'products', 'route'])->latest()->get();
    }

    public function createTrip(array $data)
    {


        return DB::transaction(function () use ($data) {

        // 1. Obtener el company_id desde los datos o el usuario autenticado
        $companyId = $data['company_id'] ?? Auth::user()->company_id;
        $data['company_id'] = $companyId;

        // 2. 🔐 BLOQUEAR LA FILA PARA EVITAR CONDICIONES DE CARRERA (Race Conditions)
        // Buscamos el último número de viaje asignado a esta empresa específica.
        $lastTripNumber = DB::table('trips')
            ->where('company_id', $companyId)
            ->lockForUpdate() // Evita que dos peticiones simultáneas calculen el mismo número
            ->max('trip_number');

        // Si es nulo (primer viaje), asigna 1; de lo contrario, le suma 1
        $data['trip_number'] = $lastTripNumber ? $lastTripNumber + 1 : 1;

        // 1. Creamos el registro principal del viaje
            $trip = Trip::create($data);

            // 2. Asociamos los productos y afectamos el inventario
            if (!empty($data['products'])) {
                $productToAttach = [];

               foreach ($data['products'] as $item) {
                $product = Product::find($item['product_id']);

                if (!$product) {
                    throw new \Exception("Producto no encontrado");
                }


                // UNIDADES REALES
                $realUnits = $item['quantity'] * $product->units_per_package;

                // VALIDACIÓN DE STOCK
                if ($product->current_stock < $realUnits) {
                    throw ValidationException::withMessages([
                'product' => "Stock insuficiente para {$product->name}. Disponible: {$product->current_stock} unidades"
                ]);
                }

                // datos de la tabla pivote
                $productToAttach[$item['product_id']] = [
                    'quantity' => $item['quantity'],//paquetes
                    'initial_quantity' => $item['quantity'],
                    'returned_quantity' => 0,
                    'recovered_bottles' => 0,
                    'company_id' => Auth::user()->company_id,
                ];

                InventoryMovement::create([
                    'company_id'  => Auth::user()->company_id,
                    'product_id'  => $item['product_id'],
                    'type'        => 'out',
                    'quantity'    => $realUnits,
                    'description' =>
                    "Carga de camión para Despacho #{$trip->trip_number} " .
                    "({$item['quantity']} paquetes x {$product->units_per_package} unidades c/u = {$realUnits} unidades)",
            ]);


                $product->decrement('current_stock', $realUnits);
            }


                // los producos se guarda en la tabla pivote en una sola consulta
                $trip->products()->attach($productToAttach);
            }

            return $trip;
        });
    }

      public function updateTrip(Trip $trip, array $data)
    {
        return DB::transaction(function () use ($trip, $data) {

            // 1. Validar por seguridad que siga siendo "pending"
            if ($trip->status !== 'pending') {
                throw new \Exception('Solo se pueden editar viajes que están en bodega.');
            }

            // 2. Actualizar los datos básicos del viaje (chofer, ruta, etc.)
            // Aseguramos que 'product' no se intente guardar en la tabla principal de trips
            $tripData = collect($data)->except('products')->toArray();
            $trip->update($tripData);

            // 3. OBTENER ESTADO ACTUAL Y NUEVO
            $oldProduct = $trip->product->keyBy('id'); // Colección indexada por product_id
            $newProductData = collect($data['products'] ?? [])->keyBy('product_id');

            // Obtenemos todos los IDs únicos (los que ya estaban + los nuevos)
            $allProductIds = $oldProduct->keys()->merge($newProductData->keys())->unique();

            $syncData = [];

            // 4. CALCULAR DIFERENCIAS Y MOVER INVENTARIO SOLO SI ES NECESARIO
            foreach ($allProductIds as $productId) {
                $oldPackages = $oldProduct->has($productId) ? $oldProduct[$productId]->pivot->initial_quantity : 0;
                $newPackages = $newProductData->has($productId) ? $newProductData[$productId]['quantity'] : 0;

                $diffPackages = $newPackages - $oldPackages;

                // Solo hacemos algo si la cantidad realmente cambió
                if ($diffPackages != 0) {
                    $product = Product::find($productId);
                    if (!$product) throw new \Exception("Producto no encontrado");

                    $realUnitsDiff = abs($diffPackages) * $product->units_per_package;

                    if ($diffPackages > 0) {
                        // SALIDA: Agregaron más paquetes al camión
                        if ($product->current_stock < $realUnitsDiff) {
                            throw ValidationException::withMessages([
                                'product' => "Stock insuficiente para {$product->name}. Disponible: {$product->current_stock} unidades"
                            ]);
                        }

                        $product->decrement('current_stock', $realUnitsDiff);

                        InventoryMovement::create([
                            'company_id'  => Auth::user()->company_id,
                            'product_id'  => $productId,
                            'type'        => 'out', // Salida
                            'quantity'    => $realUnitsDiff,
                            'description' => "Ajuste por edición de Despacho #{$trip->id} (Agregados {$diffPackages} paquetes extras al viaje)",
                        ]);
                    } else {
                        // ENTRADA: Quitaron paquetes del camión, regresan a bodega
                        $returnedPackages = abs($diffPackages);
                        $product->increment('current_stock', $realUnitsDiff);

                        InventoryMovement::create([
                            'company_id'  => Auth::user()->company_id,
                            'product_id'  => $productId,
                            'type'        => 'in', // Entrada
                            'quantity'    => $realUnitsDiff,
                            'description' => "Ajuste por edición de Despacho #{$trip->id} (Devueltos {$returnedPackages} paquetes a la bodega)",
                        ]);
                    }
                }

                // 5. PREPARAR DATOS PARA LA TABLA PIVOTE (Solo si el producto se mantiene en el viaje)
                if ($newPackages > 0) {
                    $syncData[$productId] = [
                        'quantity'          => $newPackages,
                        'initial_quantity'  => $newPackages,
                        'returned_quantity' => 0,
                        'recovered_bottles' => 0,
                        'company_id'        => Auth::user()->company_id,
                    ];
                }
            }

            // 6. SINCRONIZAR LA TABLA PIVOTE
            // sync() automáticamente quita los productos viejos, actualiza los modificados y agrega los nuevos
            $trip->products()->sync($syncData);

            return $trip;
        });
    }

    public function startTrip(int $tripId, float $initialCash, int $shiftId)
{
    return DB::transaction(function () use ($tripId, $initialCash, $shiftId) {

        $trip = Trip::findOrFail($tripId);

        // Validar que no esté ya iniciado
        if ($trip->status === 'active') {
            throw new \Exception('El viaje ya está iniciado');
        }

        if ($trip->status === 'completed') {
            throw new \Exception('El viaje ya fue finalizado');
        }

        // Guardar apertura de caja
        $trip->update([
            'initial_cash' => $initialCash,
            'status' => 'active',
            'shift_id' => $shiftId
        ]);

        return $trip;
    });

}
}
