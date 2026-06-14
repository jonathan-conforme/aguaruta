<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCompanySubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
  public function handle(Request $request, Closure $next): Response
{
    $user = auth()->user();

    // Si no hay usuario, sigue normal
    if (!$user) {
        return $next($request);
    }

    
  if ($user && !$user->is_active) {
        
        // 1. Forzamos el cierre de sesión sin tocar las cookies de sesión bruscamente
        auth()->guard('web')->logout();
        
        // 2. Lanzamos una excepción de validación que Laravel sabe cómo manejar sin dar Error 500
        throw \Illuminate\Validation\ValidationException::withMessages([
            'email' => ['Lo sentimos, tu cuenta ha sido desactivada por el administrador.'],
        ])->redirectTo(route('login')); // 
    }

    // SUPER ADMIN no se bloquea por suscripción
    if ($user->role === 'super_admin') {
        return $next($request);
    }

    // Si no tiene empresa → lo dejamos pasar o puedes redirigir
    if (!$user->company) {
        abort(403, 'No tienes empresa asignada');
    }

    $company = $user->company;

    // Empresa desactivada
    if (!$company->is_active) {
        return redirect()->route('subscription.expired');
    }

    // suscripción vencida
    if ($company->subscription_ends_at && $company->subscription_ends_at < now()) {
        return redirect()->route('subscription.expired');
    }

    return $next($request);
}
}   