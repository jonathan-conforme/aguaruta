<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use App\Models\Traits\BelongsToCompany;


class TripDetail extends Pivot
{
    use BelongsToCompany;

    protected $table = 'trip_details';

    protected $fillable = [
        'company_id',
        'trip_id',
        'product_id',
        'quantity',
        'initial_quantity',
        'returned_quantity',
        'recovered_bottles'


    ];
    public function trip()
    {
        return $this->belongsTo(Trip::class, 'trip_id');
    }
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
