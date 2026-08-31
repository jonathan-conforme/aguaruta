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

class MobileSaleTest extends TestCase
{
    use RefreshDatabase;

    private function setupBaseScenario(): array
    {
        $company = Company::factory()->create(['is_active' => true, 'subscription_ends_at' => now()->addDays(30)]);
        $user = User::factory()->create(['company_id' => $company->id, 'role' => 'empleado', 'is_active' => true]);
        $shift = Shift::forceCreate(['company_id' => $company->id, 'user_id' => $user->id, 'opened_at' => now(), 'initial_cash' => 100.00, 'status' => 'open']);

        $provinceId = DB::table('provinces')->insertGetId(['name' => 'Provincia Pruebas', 'created_at' => now(), 'updated_at' => now()]);
        $cantonId = DB::table('cantons')->insertGetId(['province_id' => $provinceId, 'name' => 'Cantón Pruebas', 'created_at' => now(), 'updated_at' => now()]);
        $route = DeliveryRoute::forceCreate(['company_id' => $company->id, 'canton_id' => $cantonId, 'route_name' => 'Ruta Centro']);

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

        $product = Product::forceCreate(['company_id' => $company->id, 'name' => 'Botellón 20L', 'price' => 3.00, 'requires_return' => true]);
        $trip->products()->attach($product->id, ['company_id' => $company->id, 'initial_quantity' => 10, 'quantity' => 10]);

        $category = CustomerCategory::create(['company_id' => $company->id, 'name' => 'General', 'is_active' => true]);
        $customer = Customer::create(['company_id' => $company->id, 'customer_category_id' => $category->id, 'delivery_route_id' => $route->id, 'name' => 'Cliente Pruebas', 'bottle_debt' => 0]);

        return compact('user', 'trip', 'product', 'customer');
    }

    public function test_no_permite_vender_mas_del_stock_disponible_en_el_viaje()
    {
        extract($this->setupBaseScenario());

        $response = $this->actingAs($user)
            ->post(route('repartidor.sales.store'), [
                'customer_id' => $customer->id,
                'trip_id' => $trip->id,
                'returned_bottles' => 0,
                'payment_method' => 'cash',
                'total' => 45.00,
                'products' => [
                    ['product_id' => $product->id, 'quantity' => 15, 'price' => 3.00]
                ],
            ]);

        $hasSessionErrors = session()->has('errors') && session('errors')->has('products');
        $hasFlashError = session()->has('error') && str_contains(session('error'), 'Stock insuficiente');

        $this->assertTrue(
            $hasSessionErrors || $hasFlashError,
            'El sistema no bloqueó la venta con stock insuficiente.'
        );
    }

    public function test_registra_venta_a_credito_con_deuda_monetaria()
    {
        extract($this->setupBaseScenario());

        $response = $this->actingAs($user)
            ->post(route('repartidor.sales.store'), [
                'customer_id' => $customer->id,
                'trip_id' => $trip->id,
                'returned_bottles' => 0,
                'payment_method' => 'credit',
                'initial_payment' => 3.00,
                'total' => 9.00,
                'products' => [
                    ['product_id' => $product->id, 'quantity' => 3, 'price' => 3.00]
                ],
            ]);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('sales', [
            'customer_id' => $customer->id,
            'total' => 9.00,
            'paid_amount' => 3.00,
            'balance_amount' => 6.00,
            'status' => 'partial',
        ]);
    }
}
