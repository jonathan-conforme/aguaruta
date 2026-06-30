<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserService
{
    /**
     * Activa la cuenta del usuario cumpliendo con las directivas legales.
     */
    public function activateRequiredAccount(User $user, array $data, string $ip): User
    {
        // Usamos una transacción DB por si en el MVP v2 insertas registros en otras tablas al mismo tiempo
        return DB::transaction(function () use ($user, $data, $ip) {

            $user->password = Hash::make($data['password']);
            $user->password_changed = true;
            $user->accepted_terms_and_privacy = true;
            $user->legal_accepted_at = now();
            $user->legal_accepted_ip = $ip;

            $user->save();

            // 🚀 MVP v2 ACÁ:
            // event(new AccountActivatedEvent($user)); // Lanzar un evento del sistema
            // Log::info("Auditoría LOPD: Usuario {$user->id} aceptó políticas.");

            return $user;
        });
    }
}
