<?php

namespace App\Services;

use App\Models\CustomerCategory;
use Illuminate\Support\Facades\Auth;

class CustomerCategoryService
{
    public function getAllCategories()
    {
        // No necesitamos poner el "WHERE company_id", ¡el Trait lo hace por nosotros!
        return CustomerCategory::orderBy('name', 'asc')->get();
    }

    public function createCategory(array $data)
    {
        // 1. Asignar la empresa del usuario logueado
        $data['company_id'] = Auth::user()->company_id;
        
        // 2. Lógica de negocio: Estandarizar el nombre (Ej: "tienda vip" -> "Tienda Vip")
        $data['name'] = ucwords(strtolower(trim($data['name'])));

        // 3. Guardar y retornar
        return CustomerCategory::create($data);
    }

    public function updateCategory(CustomerCategory $category, array $data)
    {
        if (isset($data['name'])) {
            $data['name'] = ucwords(strtolower(trim($data['name'])));
        }
        
        $category->update($data);
        
        return $category;
    }

    public function deleteCategory(CustomerCategory $category)
    {
        // Aquí en el futuro podrías agregar lógica extra, como verificar 
        // si hay clientes usando esta categoría antes de borrarla.
        $category->delete();
    }
}