<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductsService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        protected ProductsService $productsService
    ) {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'empty_stock' => 'nullable|integer|min:0',
            'requires_return' => 'boolean',
            'category_prices' => 'nullable|array',
            'category_prices.*' => 'nullable|numeric|min:0',
            'units_per_package' => 'nullable|integer|min:1',
        ]);

        $validated['requires_return'] = $request->boolean('requires_return');

        $product = $this->productsService->createProduct($validated);

        return response()->json([
            'message' => 'Producto creado correctamente.',
            'product' => $product,
        ], 201);
    }
}
