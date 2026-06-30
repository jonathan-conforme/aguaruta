<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerCategory;
use App\Services\CustomerCategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerCategoryController extends Controller
{
    protected $categoryService;

    // Inyectamos el servicio
    public function __construct(CustomerCategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    //
    public function index()
    {
        $categories = $this->categoryService->getAllCategories();

        // Devolvemos la vista de React y le pasamos la variable categories
        return Inertia::render('Admin/CustomerCategories/Index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = $this->categoryService->createCategory($validated);

        return back()->with('success', 'Categoría creada con éxito');
    }

    public function update(Request $request, CustomerCategory $customerCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $updatedCategory = $this->categoryService->updateCategory($customerCategory, $validated);

       return back()->with('success', 'Categoría actualizada con éxito');
    }

    public function destroy(CustomerCategory $customerCategory)
    {
        $this->categoryService->deleteCategory($customerCategory);

       return back()->with('success', 'Categoría eliminada con éxito');
    }
}
