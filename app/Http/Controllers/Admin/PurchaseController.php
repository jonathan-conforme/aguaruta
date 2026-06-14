<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\Products;
use App\Models\Purchase;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function __construct(private PurchaseService $purchaseService) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $purchases = $this->purchaseService->getAllPaginated();
        
        return Inertia::render('Admin/Purchases/Index', [
            'purchases' => $purchases
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
      $suppliers = Supplier::orderBy('name')
      ->get(['id', 'name', 'ruc_or_id']);

        $products = Products::where('is_active', true)
        ->orderBy('name')
        ->get([
            'id',
            'name',
            'price',
            'units_per_package',
            'current_stock',
            'empty_stock'
        ]); 

        return Inertia::render('Admin/Purchases/Create', [
            'suppliers' => $suppliers,
            'products' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'invoice_number' => 'nullable|string|max:255',
            'purchase_date' => 'required|date',
            'status' => 'required|in:pending,completed,cancelled',
            'notes' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0',
            // Validación del array de productos
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $this->purchaseService->createPurchaseWithItems($validated);

        return redirect()->route('purchases.index')->with('success', 'Compra registrada exitosamente.');
    }

    

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        //
    }
}
