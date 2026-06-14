<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToCompany;

class SaleDetail extends Model
{
    use HasFactory, BelongsToCompany;

    protected $fillable = [
        'company_id',
        'sale_id',
        'product_id',
        'quantity',
        'recovered_bottles',
        'unit_price',
        'subtotal'
    ];

    // LA CONEXIÓN: Este detalle PERTENECE a una venta
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function product()
    {
        return $this->belongsTo(Products::class);
    }
    public function trip()
    {
        return $this->belongsTo(Trip::class);
    }
}