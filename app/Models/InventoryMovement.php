<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;
use App\Models\Product;

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

   //relacione con la tabla product

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
