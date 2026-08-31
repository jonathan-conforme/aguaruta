<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory, belongsToCompany;

    protected $fillable = [
    'company_id',
    'sale_id',
    'customer_id',
    'shift_id',
    'amount',
    'payment_method',
    'reference_number',
    'notes',
        ];
        public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}
