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
            'vehicle_plate' => 'nullable|string|max:10',
            'date' => 'required|date',
            'status' => 'required|in:pending,active,completed',
            'notes' => 'nullable|string',
            'delivery_route_id' => 'required|exists:delivery_routes,id',
            'products' => 'required|array|min:1',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ];
    }

    public function attributes(): array
    {
        return [
            'driver_id' => 'conductor',
            'seller_id' => 'vendedor',
            'helper_1_id' => 'primer ayudante',
            'helper_2_id' => 'segundo ayudante',
            'vehicle_plate' => 'placa del vehículo',
            'date' => 'fecha del despacho',
            'status' => 'estado',
            'notes' => 'observaciones',
            'delivery_route_id' => 'ruta de entrega',
            'products' => 'lista de productos',
            'products.*.product_id' => 'producto',
            'products.*.quantity' => 'cantidad',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'El campo :attribute es obligatorio.',
            'max' => 'El campo :attribute no debe superar los :max caracteres.',
            'exists' => 'El :attribute seleccionado no es válido.',
            'products.required' => 'Debes agregar al menos un producto al despacho.',
            'products.min' => 'Debes agregar al menos un producto al despacho.',
            'products.*.product_id.required' => 'Debes seleccionar un producto válido en la lista.',
            'products.*.quantity.required' => 'Ingresa la cantidad para el producto seleccionado.',
            'products.*.quantity.min' => 'La cantidad del producto debe ser mayor a 0.',
        ];
    }
}
