<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\InventoryMovement;
use App\Models\Purchase;
use App\Models\Product;

class PurchaseService
{
    public function getAllPaginated($perPage = 15)
    {
        return Purchase::with(['supplier', 'items.product'])
        ->orderByDesc('purchase_date')
        ->paginate($perPage);
    }

    public function createPurchaseWithItems(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Crear la cabecera (Purchase)
            $purchase = Purchase::create([
                'supplier_id'    => $data['supplier_id'],
                'invoice_number' => $data['invoice_number'] ?? null,
                'total_amount'   => $data['total_amount'],
                'purchase_date'  => $data['purchase_date'],
                'status'         => $data['status'] ?? 'completed',
                'notes'          => $data['notes'] ?? null,
            ]);

            // 2. Crear los detalles (PurchaseItems)
            foreach ($data['items'] as $item) {

                // Identificamos si viene como producto o gasto directo
                $isProduct = isset($item['type']) ? ($item['type'] === 'product') : !empty($item['product_id']);
                $productId   = $isProduct ? ($item['product_id'] ?? null) : null;
                $description = !$isProduct ? ($item['description'] ?? null) : null;

                $purchase->items()->create([
                    'product_id' => $productId,
                    'description'=> $description,
                    'quantity'   => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                   'subtotal'    => $item['subtotal'] ?? ($item['quantity'] * $item['unit_price']),
                ]);
           // 3. Actualizar el stock del producto
                // Utilizamos el método increment() para evitar problemas de concurrencia
                $product = Product::find($item['product_id']);

                if ($productId) {
                    // Esto suma la cantidad comprada al stock actual en la base de datos
                    $product->increment('empty_stock', $item['quantity']);
                    $invoiceText = $purchase->invoice_number ? " (Factura: {$purchase->invoice_number})" : "";

                InventoryMovement::create([
                        // Si tu modelo InventoryMovement usa el trait BelongsToCompany,
                        // el company_id se llenará solo. Si no, agrégalo aquí.
                        'product_id' => $product->id,
                        'type' => 'in',
                        'quantity' => $item['quantity'],
                        'description' => "Ingreso automático por compra a proveedor" . $invoiceText,
                    ]);

                    }
            }
            return $purchase;
        });
    }
}
