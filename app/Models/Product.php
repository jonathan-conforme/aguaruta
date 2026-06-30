<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class Product extends Model
{
    //
    use BelongsToCompany;
   protected $fillable = [
        'company_id',
        'name',
        'price',
        'current_stock',
        'empty_stock',
        'requires_return',
        'is_active',
        'units_per_package', // Nueva columna para unidades por paquete
    ];

    // Castings para que Laravel trate los booleanos y números correctamente
    protected $casts = [
        'requires_return' => 'boolean',
        'is_active' => 'boolean',
        'price' => 'decimal:2',
        'empty_stock' => 'integer',
        'units_per_package' => 'integer',
    ];
    // Añade esta relación
    public function customerCategories()
    {
        // belongsToMany(Modelo, tabla_pivot, llave_foranea_de_este_modelo, llave_foranea_del_otro_modelo)
        return $this->belongsToMany(
            CustomerCategory::class,
            'customer_category_product',
            'product_id', // Le decimos a la fuerza que no use la 's'
            'customer_category_id'
        )
        ->withPivot('price')
        ->withTimestamps();
    }
    public function scopeActive($query)
{
    return $query->where('is_active', true);
}
}
