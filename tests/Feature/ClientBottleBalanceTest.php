<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use App\Models\Company;
use App\Models\User;
use App\Models\Customer;
use App\Models\CustomerCategory;
use App\Models\DeliveryRoute;
use App\Models\Shift;
use App\Models\Trip;
use App\Models\Product;

class ClientBottleBalanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_actualiza_la_deuda_de_botellones_del_cliente_tras_registrar_entrega()
    {
        // 1. Empresa y Usuario (Chofer / Vendedor)
        $company = Company::factory()->create([
            'is_active' => true,
            'subscription_ends_at' => now()->addDays(30),
        ]);

        $user = User::factory()->create([
            'company_id' => $company->id,
            'role' => 'empleado',
            'is_active' => true,
        ]);

        // 2. Turno Abierto
        $shift = Shift::forceCreate([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'opened_at' => now(),
            'initial_cash' => 100.00,
            'status' => 'open',
        ]);

        // 3. Geografía y Ruta
        $provinceId = DB::table('provinces')->insertGetId([
            'name' => 'Provincia Pruebas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $cantonId = DB::table('cantons')->insertGetId([
            'province_id' => $provinceId,
            'name' => 'Cantón Pruebas',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $route = DeliveryRoute::forceCreate([
            'company_id' => $company->id,
            'canton_id' => $cantonId,
            'route_name' => 'Ruta Centro',
        ]);

        // 4. Viaje completo según esquema de base de datos
        $trip = Trip::forceCreate([
            'company_id' => $company->id,
            'shift_id' => $shift->id,
            'driver_id' => $user->id,
            'seller_id' => $user->id,
            'delivery_route_id' => $route->id,
            'trip_number' => 1,
            'date' => now()->toDateString(),
            'status' => 'active',
        ]);

        // 5. Producto con bandera de retorno habilitada
        $product = Product::forceCreate([
            'company_id' => $company->id,
            'name' => 'Botellón 20L',
            'price' => 3.00,
            'requires_return' => true,
        ]);

        // 6. Cargar stock del producto en el viaje (trip_details)
        $trip->products()->attach($product->id, [
            'company_id' => $company->id,
            'initial_quantity' => 10,
            'quantity' => 10,
        ]);

        // 7. Cliente con deuda inicial de 5 botellones
        $category = CustomerCategory::create([
            'company_id' => $company->id,
            'name' => 'General',
            'is_active' => true,
        ]);

        $customer = Customer::create([
            'company_id' => $company->id,
            'customer_category_id' => $category->id,
            'delivery_route_id' => $route->id,
            'name' => 'Cliente Pruebas',
            'bottle_debt' => 5,
        ]);

        // 8. Ejecutar la venta (Compra 3 envases de retorno, devuelve 1)
        $response = $this->actingAs($user)
            ->post(route('repartidor.sales.store'), [
                'customer_id' => $customer->id,
                'trip_id' => $trip->id,
                'returned_bottles' => 1,
                'payment_method' => 'cash',
                'total' => 9.00,
                'products' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 3,
                        'price' => 3.00,
                    ]
                ],
            ]);

        $response->assertSessionHasNoErrors();

        // 9. Deuda inicial (5) + Comprados (3) - Devueltos (1) = Deuda final (7)
        $this->assertDatabaseHas('customers', [
            'id' => $customer->id,
            'bottle_debt' => 7,
        ]);
    }
}
