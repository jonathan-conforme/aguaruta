<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \Illuminate\Session\Middleware\AuthenticateSession::class, // <-- Tu middleware de sesión única activo
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
            'check.company' => \App\Http\Middleware\CheckCompanySubscription::class,
            'check.password.changed' => \App\Http\Middleware\CheckPasswordChanged::class,
        ]);
    })
  ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->respond(function ($response, $exception, $request) {
            // Si es una excepción de autenticación (el usuario fue expulsado)
            if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
                // Si el usuario ya tenía una sesión activa (tenía la cookie), es porque lo sacó el otro dispositivo
                if ($request->hasSession() && $request->cookie(config('session.cookie'))) {
                    return redirect()->route('login', ['status' => 'duplicate']);
                }
            }

            return $response;
        });
    })->create();
