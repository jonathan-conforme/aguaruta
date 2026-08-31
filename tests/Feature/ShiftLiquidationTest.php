<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Company;
use App\Models\User;
use App\Models\Shift;

class ShiftLiquidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_calcula_correctamente_botellones_vendidos_y_descuadre_de_caja_al_cerrar_turno()
    {
        $company = Company::factory()->create([
            'plan' => 'basico',
            'is_active' => true,
            'subscription_ends_at' => now()->addDays(30),
        ]);

        $driver = User::factory()->create([
            'company_id' => $company->id,
            'role' => 'empleado',
            'is_active' => true,
        ]);

        $shift = Shift::create([
            'company_id' => $company->id,
            'user_id' => $driver->id,
            'opened_at' => now(),
            'initial_cash' => 100.00,
            'status' => 'open',
        ]);

        $response = $this->actingAs($driver)
            ->post(route('repartidor.shifts.storeClosure'), [
                'shift_id' => $shift->id,
                'final_cash' => 780.00,
                'closed_at' => now(),
            ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('shifts', [
            'id' => $shift->id,
            'status' => 'closed',
        ]);
    }
}
