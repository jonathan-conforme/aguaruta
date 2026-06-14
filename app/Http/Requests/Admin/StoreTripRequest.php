<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTripRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'driver_id' => 'required|exists:users,id',
            'seller_id' => 'required|exists:users,id',
            'helper_1_id' => 'nullable|exists:users,id',
            'helper_2_id' => 'nullable|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:pending,active,completed',
            'notes' => 'nullable|string',
            'delivery_route_id' => 'required|exists:delivery_routes,id',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ];
    }
}