<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\Products;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryMovementService
{
   public function getAllMovements(array $filters = [])
{
    $perPage = min(
        max((int) ($filters['per_page'] ?? 15), 1),
        100
    );

    return InventoryMovement::query()
        ->with([
            'product:id,name'
        ])
        ->when(
            !empty($filters['product_id']),
            fn ($query) =>
                $query->where('product_id', $filters['product_id'])
        )
        ->when(
            !empty($filters['type']),
            fn ($query) =>
                $query->where('type', $filters['type'])
        )
        ->latest()
        ->paginate($perPage)
        ->withQueryString();
}
    public function createMovement(array $data)
    {
        $data['company_id'] = Auth::user()->company_id;

        // Usamos una transacción para que, si algo falla, no se guarde a medias
        return DB::transaction(function () use ($data) {
            
        // 1. Actualizar el stock del producto
            $product = Products::findOrFail($data['product_id']);

            // Convertimos a unidades reales
        $realQuantity = $data['quantity'] * $product->units_per_package;


        // PUNTAL DE SEGURIDAD: Validamos los envases vacíos ANTES de alterar la base de datos
            if ($data['type'] === 'packaging') {
                if (($product->empty_stock?? 0) < $realQuantity) {
                    throw ValidationException::withMessages([
                        'quantity' => "No tienes suficientes envases vacíos. Disponibles: " . ($product->empty_stock ?? 0)
                    ]);
                }
            }

        // Guardar movimiento
        $movement = InventoryMovement::create([
            ...$data,
            'quantity' => $realQuantity,
        ]);


            if ($data['type'] === 'in') {
            $product->current_stock += $realQuantity;
        } elseif ($data['type'] === 'out') {
            $product->empty_stock -= $realQuantity;
        } elseif ($data['type'] === 'packaging') {
                // Si es envasado: Restamos de los vacíos y sumamos a los llenos (current_stock)
                $product->empty_stock -= $realQuantity;
                $product->current_stock += $realQuantity;
            } 

            $product->save();

            return $movement;
        });
    }
}