<?php

namespace App\Services;

use App\Models\Supplier;

class SupplierService
{
    /**
     * Lista todos los proveedores (El Global Scope de tu Trait filtra por empresa automáticamente).
     */
    public function getAllPaginated($perPage = 10)
    {
        return Supplier::orderBy('name')->paginate($perPage);
    }

    /**
     * Crea un nuevo proveedor (El Trait inyectará el company_id).
     */
    public function create(array $data): Supplier
    {
        return Supplier::create($data);
    }

    /**
     * Actualiza un proveedor. 
     * (Si el proveedor llegó hasta aquí, el Global Scope ya validó que pertenece a la empresa).
     */
    public function update(Supplier $supplier, array $data): Supplier
    {
        $supplier->update($data);
        return $supplier;
    }

    /**
     * Elimina un proveedor.
     */
    public function delete(Supplier $supplier): void
    {
        $supplier->delete();
    }
}