<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductsService;
use App\Models\CustomerCategory;
use Illuminate\Http\Request;
use App\Models\Products;
use Inertia\Inertia;



class ProductsController extends Controller
{
    
    protected $productsService;
    
    public function __construct(ProductsService $productsService)
    {
        $this->productsService = $productsService;
    }  
    /**
     * Display a listing of the resource.
     */
 public function index(Request $request)
{
    return Inertia::render('Admin/Products/Index', [
        'products' => $this->productsService->getAllProducts([
            'search' => $request->search,
            'per_page' => $request->per_page,
        ]),
        'categories' => CustomerCategory::orderBy('name', 'asc')->get(),
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
        $this->productsService->createProduct($validated);

        return back()->with('success', 'Producto creado con éxito');
    }


    /**
     * Display the specified resource.
     */
    public function show(Products $products)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Products $products)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Products $product)
    {
      $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'empty_stock' => 'nullable|integer|min:0',
            'category_prices' => 'nullable|array',
            'category_prices.*' => 'nullable|numeric|min:0',
            'units_per_package' => 'nullable|integer|min:1',
           
        ]);

        $validated['requires_return'] = $request->boolean('requires_return');
        $validated['is_active'] = $request->boolean('is_active');
        $validated['company_id'] = auth()->user()->company_id;
        $this->productsService->updateProduct($product, $validated);
     
        return back()->with('success', 'Producto actualizado con éxito');
    }
 
  public function destroy(Products $product)
    {
        $this->productsService->deleteProduct($product);
        
        return back()->with('success', 'Producto eliminado');
    }
}

