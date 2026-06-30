<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SupplierService;
use App\Rules\ValidarRucEcuador;
use Illuminate\Http\Request;
use App\Models\Supplier;
use Inertia\Inertia;

class SupplierController extends Controller
{

    public function __construct(private SupplierService $supplierService) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $suppliers = $this->supplierService->getAllPaginated();

        return Inertia::render('Admin/Suppliers/Index', [
            'suppliers' => $suppliers
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
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'ruc_or_id' => ['nullable', 'string', 'max:255', new ValidarRucEcuador()],
        ]);

        $this->supplierService->create($validated);

        return redirect()->back()->with('success', 'Proveedor registrado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Supplier $supplier)
    {
       $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'ruc_or_id' => ['nullable', 'string', 'max:255', new ValidarRucEcuador()],
        ]);

        $this->supplierService->update($supplier, $validated);

        return redirect()->back()->with('success', 'Proveedor actualizado exitosamente.');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
       $this->supplierService->delete($supplier);

        return redirect()->back()->with('success', 'Proveedor eliminado exitosamente.');
    }
}
