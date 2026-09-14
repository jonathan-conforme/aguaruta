<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    ->withMiddleware(function (Middleware $middleware): void {
        // Excepción de CSRF temporal para la prueba de carga k6
        $middleware->validateCsrfTokens(except: [
            'login',
        ]);

        $middleware->alias([
            'role'                   => \App\Http\Middleware\RoleMiddleware::class,
            'check.company'          => \App\Http\Middleware\CheckCompanySubscription::class,
            'check.password.changed' => \App\Http\Middleware\CheckPasswordChanged::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
