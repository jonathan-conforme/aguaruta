<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'amount'           => ['required', 'numeric', 'gt:0'],
            'payment_method'   => ['required', 'in:cash,transfer'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'notes'            => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'amount.required' => 'Debes ingresar el monto a abonar.',
            'amount.gt'       => 'El abono debe ser mayor a 0.',
            'payment_method.in' => 'El método debe ser efectivo o transferencia.',
        ];
    }
}