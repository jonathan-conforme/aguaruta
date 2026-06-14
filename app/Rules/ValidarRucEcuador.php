<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidarRucEcuador implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$this->esIdentificacionValida($value)) {
            $fail('El :attribute no es una Cédula ni un RUC ecuatoriano válido.');
        }
    }

    private function esIdentificacionValida(string $valor): bool
    {
        $longitud = strlen($valor);

        // Debe ser numérico y tener 10 (Cédula) o 13 (RUC) dígitos
        if (!ctype_digit($valor) || !in_array($longitud, [10, 13])) {
            return false;
        }

        // Los dos primeros dígitos son la provincia
        $provincia = (int) substr($valor, 0, 2);
        if ($provincia < 1 || ($provincia > 24 && $provincia !== 30)) {
            return false;
        }

        $tercerDigito = (int) $valor[2];

        // ===== VALIDACIÓN DE CÉDULA (10 DÍGITOS) =====
        if ($longitud === 10) {
            // El tercer dígito de una cédula siempre es menor a 6
            if ($tercerDigito >= 6) {
                return false;
            }
            return $this->validarModulo10($valor);
        }

        // ===== VALIDACIÓN DE RUC (13 DÍGITOS) =====
        if ($longitud === 13) {
            // 1. Persona Natural (Tercer dígito < 6)
            if ($tercerDigito < 6) {
                if (substr($valor, 10, 3) !== '001') {
                    return false;
                }
                return $this->validarModulo10(substr($valor, 0, 10));
            } 
            // 2. Sociedad Privada (Tercer dígito == 9)
            elseif ($tercerDigito === 9) {
                if (substr($valor, 10, 3) !== '001') {
                    return false;
                }
                return $this->validarModulo11($valor, [4, 3, 2, 7, 6, 5, 4, 3, 2], 9);
            } 
            // 3. Sociedad Pública (Tercer dígito == 6)
            elseif ($tercerDigito === 6) {
                if (substr($valor, 9, 4) !== '0001') {
                    return false;
                }
                return $this->validarModulo11($valor, [3, 2, 7, 6, 5, 4, 3, 2], 8);
            }
        }

        return false;
    }

    private function validarModulo10(string $cedula): bool
    {
        $suma = 0;
        for ($i = 0; $i < 9; $i++) {
            $valor = (int) $cedula[$i] * (($i % 2 === 0) ? 2 : 1);
            $suma += ($valor > 9) ? $valor - 9 : $valor;
        }

        $digitoVerificador = (int) $cedula[9];
        $decenaSuperior = (int) ceil($suma / 10) * 10;
        $resultado = $decenaSuperior - $suma;
        
        if ($resultado === 10) {
            $resultado = 0;
        }

        return $resultado === $digitoVerificador;
    }

    private function validarModulo11(string $ruc, array $coeficientes, int $posicionVerificador): bool
    {
        $suma = 0;
        for ($i = 0; $i < count($coeficientes); $i++) {
            $suma += (int) $ruc[$i] * $coeficientes[$i];
        }

        $residuo = $suma % 11;
        $resultado = $residuo === 0 ? 0 : 11 - $residuo;

        return $resultado === (int) $ruc[$posicionVerificador];
    }
}