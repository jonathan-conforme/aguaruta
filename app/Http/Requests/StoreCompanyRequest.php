<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ValidarRucEcuador; 

class StoreCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'ruc_number' => ['required', 'string', 'digits_between:10,13' , 'unique:companies,ruc_number', new ValidarRucEcuador()],
            'phone' => 'nullable|string|max:15',
            'whatsapp_number' => 'nullable|string|max:15',
            'email' => 'required|email|max:255|unique:companies,email|unique:users,email',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'subscription_ends_at' => 'nullable|date',
            'plan' => 'required|in:basico,premium,empresarial',
            
        ];
    }

    public function messages(): array
    {
        return [
            
            'ruc_number.digits_between' => 'La Cédula o RUC debe tener entre 10 y 13 dígitos.',
            'ruc_number.unique' => 'CI/RUC ya está registrado en el sistema.',
            'ruc_number.*' => 'La cédula o RUC no es válido.',
            'email.unique' => 'Este correo ya está registrado en otra empresa.',
            'phone.max' => 'El teléfono no puede tener más de 15 caracteres.',
            'whatsapp_number.max' => 'El número de WhatsApp no puede tener más de 15 caracteres.',
        ];
    }
}