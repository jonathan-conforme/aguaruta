<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ProductsService;
use App\Models\CustomerCategory;
use App\Services\ProductService;
use App\Services\PlanService;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;



class ProductsController extends Controller
{

  public function __construct(
    protected ProductsService $productsService,
    private PlanService $planService
) {}
    /**
     * Display a listing of the resource.
     */
 public function index(Request $request)
{
    return Inertia::render('Admin/Products/Index', [
        'product' => $this->productsService->getAllProduct([
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
        $company = auth()->user()->company;

        // 🌟 3. VALIDACIÓN DE LÍMITES DEL SAAS (Usa tus nuevos métodos de PlanService)
        // Pasamos 'products' como la feature tal cual está en tu config/plans.php
        if ($this->planService->hasReachedLimit($company, 'products', Product::count())) {
            $limite = $this->planService->getLimit($company, 'products');
            $mensajeError = $this->planService->getLimitErrorMessage($company->plan, 'products', $limite);

            return back()->with('error', $mensajeError);
        }

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
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
      $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'current_stock' => 'nullable|integer|min:0',
            'empty_stock' => 'nullable|integer|min:0',
            'category_prices' => 'nullable|array',
            'category_prices.*' => 'nullable|numeric|min:0',
            'units_per_package' => 'nullable|integer|min:1',
            'requires_return' => 'boolean', // <-- Agrégalo aquí también para sanitizar
            'is_active' => 'boolean',

        ]);

        $validated['requires_return'] = $request->boolean('requires_return');
        $validated['is_active'] = $request->boolean('is_active');
        $validated['company_id'] = auth()->user()->company_id;

        $this->productsService->updateProduct($product, $validated);

        return back()->with('success', 'Producto actualizado con éxito');
    }

  public function destroy(Product $product)
    {
        $this->productsService->deleteProduct($product);

        return back()->with('success', 'Producto eliminado');
    }
}

