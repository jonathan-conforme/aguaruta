<?php

namespace App\Services;

use App\Notifications\MovimientoInventarioNotification;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\User;

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

    // 1. Guardar la transacción en la variable $movement
    $movement = DB::transaction(function () use ($data) {
        $product = Product::lockForUpdate()->findOrFail($data['product_id']);

        // Multiplicador seguro por si units_per_package es 0 o nulo
        $factor = ($product->units_per_package && $product->units_per_package > 0)
            ? $product->units_per_package
            : 1;

        $realQuantity = $data['quantity'] * $factor;

        // Validación de envases vacíos antes de procesar
        if ($data['type'] === 'packaging') {
            if (($product->empty_stock ?? 0) < $realQuantity) {
                throw ValidationException::withMessages([
                    'quantity' => "No tienes suficientes envases vacíos. Disponibles: " . ($product->empty_stock ?? 0)
                ]);
            }
        }

        // Validación de stock antes de registrar una salida
        if ($data['type'] === 'out') {
            if (($product->current_stock ?? 0) < $realQuantity) {
                throw ValidationException::withMessages([
                    'quantity' => "Stock insuficiente para realizar la salida. Disponible: " . ($product->current_stock ?? 0)
                ]);
            }
        }

        // Crear registro del movimiento
        $movement = InventoryMovement::create([
            ...$data,
            'quantity' => $realQuantity,
        ]);

        // Actualizar stock según el tipo de movimiento
        if ($data['type'] === 'in') {
            $product->current_stock += $realQuantity;
        } elseif ($data['type'] === 'out') {
            $product->current_stock -= $realQuantity; // Corregido: resta de current_stock
        } elseif ($data['type'] === 'packaging') {
            $product->empty_stock -= $realQuantity;
            $product->current_stock += $realQuantity;
        }

        $product->save();

        return $movement;
    });

    // 2. ENVÍO DE NOTIFICACIÓN (Ahora sí se ejecuta correctamente al estar fuera de la transacción)
    $admins = User::where('company_id', $data['company_id'])
        ->where('role', 'admin')
        ->get();

    if ($admins->isNotEmpty()) {
        Notification::send($admins, new MovimientoInventarioNotification($movement, $movement->product));
    }

    return $movement;
}
}
