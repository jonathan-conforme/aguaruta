<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryRoute;
use App\Models\Province; // Importamos el modelo Province
use App\Services\DeliveryRouteService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class DeliveryRouteController extends Controller
{
    protected $service;

    public function __construct(DeliveryRouteService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        // Traemos las provincias con sus cantones y sectores para los selects en cascada
        $provinces = Province::with('cantons.sectors')->get();

        return Inertia::render('Admin/Routes/Index', [
            'routes' => $this->service->getAll(),
            'provinces' => $provinces // Pasamos las provincias a React
        ]);
    }

    public function store(Request $request)
    {
        // Actualizamos las validaciones para aceptar IDs reales de la base de datos
        $validated = $request->validate([
            'route_name' => [
            'required',
            'string',
            'max:255',

            Rule::unique('delivery_routes')->where(function ($query) {
                    return $query->where('company_id', Auth::user()->company_id);
                })
            ],
            'canton_id'  => 'required|exists:cantons,id', 
            'sector_id'  => 'nullable|exists:sectors,id',
        ], [
            'route_name.unique' => 'Ya existe una ruta con este nombre en tu empresa.'
        ]);

        $this->service->create($validated);

        return back()->with('success', 'Ruta creada correctamente');
    }

    public function update(Request $request, DeliveryRoute $route)
    {
        $validated = $request->validate([
            'route_name' => 'required|string|max:255',
            'canton_id'  => 'required|exists:cantons,id',
            'sector_id'  => 'nullable|exists:sectors,id',
        ]);

        $this->service->update($route, $validated);

        return back()->with('success', 'Ruta actualizada');
    }

    public function destroy(DeliveryRoute $route)
    {
        $this->service->delete($route);

        return back()->with('success', 'Ruta eliminada');
    }

    public function toggle(DeliveryRoute $route)
    {
        $this->service->toggle($route);

        return back()->with('success', 'Estado actualizado');
    }
}