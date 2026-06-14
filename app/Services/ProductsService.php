<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Products;
use App\Models\InventoryMovement;

class ProductsService
{
   public function getAllProducts(array $filters = [])
{
    $perPage = min(
        max((int) ($filters['per_page'] ?? 15), 1),
        100
    );

    return Products::with('customerCategories')
        ->when(
            !empty($filters['search']),
            fn ($query) =>
                $query->where(
                    'name',
                    'like',
                    '%' . $filters['search'] . '%'
                )
        )
        ->orderBy('name')
        ->paginate($perPage)
        ->withQueryString();
}

    public function createProduct(array $data)
    {
        $data['company_id'] = Auth::user()->company_id;
        $data['name'] = ucwords(strtolower(trim($data['name'])));
        
        $categoryPrices = $data['category_prices'] ?? [];
        unset($data['category_prices']); 

        // Usamos transacción para que no se guarde el producto si falla el inventario (y viceversa)
        return DB::transaction(function () use ($data, $categoryPrices) {
            
            // Creamos el producto
            $product = Products::create($data);

            // Guardamos precios especiales por categoría si los hay
            if (!empty($categoryPrices)) {
                $syncData = [];
                
               $companyId = auth()->user()->company_id;

            foreach ($categoryPrices as $categoryId => $price) {
                if ($price !== null && $price !== '') {
                    // 2. Agregamos el company_id junto con el precio
                    $syncData[$categoryId] = [
                        'price' => $price,
                        'company_id' => $companyId 
                    ];
                }
            }
                $product->customerCategories()->sync($syncData);
            }

            // 2. MEJORA: REGISTRO AUTOMÁTICO DE INVENTARIO INICIAL
            if (isset($data['current_stock']) && $data['current_stock'] > 0) {
                InventoryMovement::create([
                    'company_id'  => $data['company_id'],
                    'product_id'  => $product->id,
                    'type'        => 'in',
                    'quantity'    => $data['current_stock'],
                    'empty_quantity' => $data['empty_stock'] ?? 0,
                    'description' => 'Inventario Inicial'
                
                ]);
            }

            return $product;
        });
    }

    public function updateProduct(Products $product, array $data)
    {
        if (isset($data['name'])) {
            $data['name'] = ucwords(strtolower(trim($data['name'])));
        }
        
        // 3. MEJORA: BLOQUEO DE SEGURIDAD 
        // Eliminamos el current_stock para no alterarlo, pero el 'price' sigue aquí para actualizarse sin problema.
        unset($data['current_stock']); 
        unset($data['empty_stock']); 

        $categoryPrices = $data['category_prices'] ?? null;
        unset($data['category_prices']); 

        // Actualizamos la información base (nombre, PRECIO, is_active, requires_return)
        $product->update($data);

        // Actualizamos los precios por categoría
        if ($categoryPrices !== null) {
            $syncData = [];
            $companyId = auth()->user()->company_id;

            foreach ($categoryPrices as $categoryId => $price) {
                if ($price !== null && $price !== '') {
                    $syncData[$categoryId] = [
                        'price' => $price,
                        'company_id' => $companyId
                    ];
                }
            }
            $product->customerCategories()->sync($syncData);
        }

        return $product;
    }

    public function deleteProduct(Products $product)
    {
        $product->delete();
    }
}