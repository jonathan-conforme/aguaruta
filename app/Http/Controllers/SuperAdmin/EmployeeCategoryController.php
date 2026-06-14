<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\EmployeeCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class EmployeeCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      $categories = EmployeeCategory::orderBy('id', 'desc')->get();

        return Inertia::render('SuperAdmin/EmployeeCategories/Index', [
            'categories' => $categories
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
        $request->validate([
            'name' => 'required|string|max:255|unique:employee_categories,name',
        ], [
            'name.unique' => 'Esta categoría ya ha sido registrada.',
        ]);

        EmployeeCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name), // Convierte "Repartidor de Planta" en "repartidor-de-planta"
        ]);

        return back()->with('success', 'Categoría creada exitosamente.');
    
    }

    /**
     * Display the specified resource.
     */
    public function show(EmployeeCategory $employeeCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmployeeCategory $employeeCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmployeeCategory $employeeCategory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeCategory $employeeCategory)
    {
        //
    }
}
