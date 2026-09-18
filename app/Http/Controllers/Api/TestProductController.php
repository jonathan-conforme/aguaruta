<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TestProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|integer|exists:companies,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'empty_stock' => 'nullable|integer|min:0',
            'requires_return' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'units_per_package' => 'nullable|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {

            $product = Product::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
                ->create([
                    'company_id' => $validated['company_id'],
                    'name' => ucwords(strtolower(trim($validated['name']))),
                    'price' => $validated['price'],
                    'current_stock' => $validated['current_stock'] ?? 0,
                    'empty_stock' => $validated['empty_stock'] ?? 0,
                    'requires_return' => $validated['requires_return'] ?? false,
                    'is_active' => $validated['is_active'] ?? true,
                    'units_per_package' => $validated['units_per_package'] ?? 1,
                ]);

            if (($validated['current_stock'] ?? 0) > 0) {
                InventoryMovement::withoutGlobalScope(\App\Models\Scopes\CompanyScope::class)
                    ->create([
                        'company_id' => $validated['company_id'],
                        'product_id' => $product->id,
                        'type' => 'in',
                        'quantity' => $validated['current_stock'],
                        'empty_quantity' => $validated['empty_stock'] ?? 0,
                        'description' => 'Inventario Inicial - Datos de prueba',
                    ]);
            }

            return response()->json([
                'message' => 'Producto de prueba creado correctamente.',
                'product' => $product,
            ], 201);
        });
    }
}
