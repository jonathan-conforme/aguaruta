<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequiredPasswordRequest extends FormRequest
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
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */



    public function rules(): array
    {
        return [
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[^A-Za-z0-9]/',
            ],
            'accepted_terms'   => ['required', 'accepted'],
            'accepted_privacy' => ['required', 'accepted'],
        ];
    }


   public function messages(): array
    {
        return [
            'password.regex'           => 'La contraseña no cumple con las directivas de seguridad.',
            'accepted_terms.accepted'  => 'Debes aceptar los Términos y Condiciones para continuar.',
            'accepted_privacy.accepted' => 'Debes aceptar la Política de Privacidad para continuar.',
        ];
    }
}
