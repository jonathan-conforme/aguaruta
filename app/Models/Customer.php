<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class Customer extends Model
{
    use BelongsToCompany;
        protected $fillable = [
        'company_id',
        'customer_category_id',
        'delivery_route_id',
        'name',
        'phone',
        'address',
        'bottle_debt',
        'identification'
    ];

    public function category()
    {
        return $this->belongsTo(CustomerCategory::class, 'customer_category_id');
    }

    public function deliveryRoute()
    {
        return $this->belongsTo(DeliveryRoute::class);
    }
}
