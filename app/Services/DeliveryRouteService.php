<?php

namespace App\Services;

use App\Models\DeliveryRoute;
use Illuminate\Support\Facades\Auth;


class DeliveryRouteService
{
    public function getAll()
    {
        // El Global Scope ya filtra por empresa automáticamente.
        // Solo necesitamos cargar las relaciones y ordenar.
        return DeliveryRoute::with(['canton.province', 'sector'])
            ->latest()
            ->get();
    }

    public function create(array $data)
    {
        // Nota: Si tu Global Scope o modelo maneja la inserción automática 
        // del company_id en el evento 'creating', puedes quitar esta línea también.
        $data['company_id'] = Auth::user()->company_id;

        return DeliveryRoute::create($data);
    }

    public function update(DeliveryRoute $route, array $data)
    {
        $route->update($data);
        return $route;
    }

    public function delete(DeliveryRoute $route)
    {
        $route->delete();
    }

    public function toggle(DeliveryRoute $route)
    {
        $route->is_active = !$route->is_active;
        $route->save();

        return $route;
    }
}