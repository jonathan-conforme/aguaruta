<?php

namespace App\Http\Requests\Empleado;

use Illuminate\Foundation\Http\FormRequest;

class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'trip_id' => 'required|exists:trips,id',
            'customer_id' => 'required|exists:customers,id',
            'payment_method' => 'required|in:cash,transfer,credit',
            'returned_bottles' => 'required|integer|min:0',
            'total' => 'required|numeric|min:0',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:0',
            'products.*.price' => 'required|numeric|min:0',
        ];
    }
}