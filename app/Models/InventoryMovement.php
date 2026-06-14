<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;
use App\Models\Products;

class InventoryMovement extends Model
{
   
    use BelongsToCompany;

    /**
     * Campos que permitimos guardar masivamente (Mass Assignment)
     */
    protected $fillable = [
        'company_id',
        'trip_id',
        'product_id',
        'type',        
        'quantity',
        'description',
    ];

    /**
     * Relación: Un movimiento de inventario pertenece a un Producto.
     * Mantenemos Products::class porque así nombramos a tu modelo de productos.
     */
    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}