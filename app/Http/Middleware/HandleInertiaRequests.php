<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */


public function share(Request $request): array
{
    $user = $request->user();

    // Si hay usuario autenticado, cargamos la relación de la empresa si no está cargada
    if ($user && !$user->relationLoaded('company')) {
        $user->load('company');
    }

    return [
        ...parent::share($request),
        'auth' => [
            'user' => $user ? array_merge($user->toArray(), [
                'unread_notifications' => $user->unreadNotifications()->take(10)->get(),
                'company' => $user->company ? [
                    'id'                   => $user->company->id,
                    'name'                 => $user->company->name,
                    'ruc_number'           => $user->company->ruc_number ?? $user->company->ruc,
                    'email'                => $user->company->email ?? $user->company->correo,
                    'phone'                => $user->company->phone ?? $user->company->telefono ?? $user->company->whatsapp_number,
                    'address'              => $user->company->address ?? $user->company->direccion,
                   
                    'logo'                 => $user->company->logo_url,
                ] : null,
            ]) : null,
        ],
        'flash' => [
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
            'warning' => $request->session()->get('warning'),
            'info' => $request->session()->get('info'),
        ],
    ];
}
}
