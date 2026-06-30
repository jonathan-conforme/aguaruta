<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class CustomerCategory extends Model
{
        use BelongsToCompany;
    //
    protected $fillable = [
        'company_id',
        'name',
        'is_active'

    ];
   // relación
  public function products()
    {
        return $this->belongsToMany(
            Product::class,
            'customer_category_product',
            'customer_category_id',

        )
        ->withPivot('price', 'company_id')
        ->withTimestamps();

    }

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


}
