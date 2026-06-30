<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPasswordChanged
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Si el usuario está logueado y aún NO ha cambiado su clave temporal
      if (auth()->check() && auth()->user()->role === 'admin' && !auth()->user()->password_changed) {

            // Evitamos bucles si ya va a la ruta de cambio o a cerrar sesión
            if (!$request->routeIs('password.change', 'password.change.update', 'logout')) {
                return redirect()->route('password.change')
                    ->with('warning', 'Por seguridad (LOPD), debes cambiar tu contraseña temporal.');
            }
        }

        return $next($request);
    }
}
