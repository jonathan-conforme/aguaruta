<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdateRequiredPasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Services\UserService;
use Illuminate\Validation\Rules\Password; // Reutiliza las reglas de Breeze
use Inertia\Inertia;

class PasswordChangeController extends Controller
{
  protected UserService $userService;

    // Inyectamos el servicio de manera automática mediante el contenedor de Laravel
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function show()
    {
        return Inertia::render('Auth/UpdatePasswordRequired');
    }

    /**
     * Procesa el cambio de clave y desbloquea al usuario.
     */
    public function update(UpdateRequiredPasswordRequest $request)
    {
        // 1. Ejecutamos el servicio escalable
        $user = $this->userService->activateRequiredAccount(
            $request->user(),
            $request->validated(),
            $request->ip()
        );

        // 2. Refrescamos sesión de inmediato
        Auth::login($user);

        // 3. Redirección limpia
        return redirect()->route('dashboard')
            ->with('success', 'Contraseña actualizada y políticas aceptadas correctamente. ¡Bienvenido!');
    }
}
