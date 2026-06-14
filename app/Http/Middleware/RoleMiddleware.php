<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Si el usuario no está logueado o su rol no coincide con el exigido, lo bloqueamos
        if (!auth()->check() || auth()->user()->role !== $role) {
            
            // Puedes redirigirlo a donde quieras, por ejemplo a un error 403 o a su propio panel
            abort(403, 'No tienes permisos para acceder a esta área.');
        }

        return $next($request);
    }
}