<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Forma súper segura de capturar el ID sin importar cómo venga en la ruta
      $companyId = $this->route('company')->id;
        return [
            'name' => 'required|string|max:255',

            // Usamos Rule::unique() en lugar de texto concatenado
            'ruc_number' => [
                'required',
                'string',
                'max:20',
               \Illuminate\Validation\Rule::unique('companies', 'ruc_number')->ignore($companyId)
            ],

            'email' => [
                'required',
                'email',
                'max:255',
                \Illuminate\Validation\Rule::unique('companies', 'email')->ignore($companyId)
            ],

            'phone' => 'nullable|string|max:50',
            'whatsapp_number' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'plan' => 'required|in:basico,premium,empresarial,vip',
            'subscription_ends_at' => 'nullable|date',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }
}
