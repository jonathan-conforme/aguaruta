<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\InventoryMovementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryMovementController extends Controller
{
    protected $inventoryService;

    public function __construct(InventoryMovementService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }
public function index(Request $request) {
    return Inertia::render('Admin/Inventory/Index',
    [
    'movements' => $this->inventoryService->getAllMovements([
    'per_page' => $request->per_page,
    'product_id' => $request->product_id,
    'type' => $request->type,
    ]),

    'products'=> Product::query()
    ->select('id', 'name', 'units_per_package', 'empty_stock', 'current_stock')
    ->where('is_active', true)
    ->orderBy('name') ->get(), ]); }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:in,out,packaging',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string|max:255',
        ]);

        $this->inventoryService->createMovement($validated);

        return back()->with('success', 'Movimiento registrado con exito.');
    }
}
