<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Company;
use App\Models\User;
use App\Models\Shift;

class TenantSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_un_chofer_no_puede_cerrar_el_turno_de_otra_empresa()
    {
        $companyA = Company::factory()->create([
            'is_active' => true,
            'subscription_ends_at' => now()->addDays(30),
        ]);
        $companyB = Company::factory()->create([
            'is_active' => true,
            'subscription_ends_at' => now()->addDays(30),
        ]);

        $driverA = User::factory()->create(['company_id' => $companyA->id, 'role' => 'empleado', 'is_active' => true]);
        $driverB = User::factory()->create(['company_id' => $companyB->id, 'role' => 'empleado', 'is_active' => true]);

        $shiftB = Shift::create([
            'company_id' => $companyB->id,
            'user_id' => $driverB->id,
            'opened_at' => now(),
            'initial_cash' => 50.00,
            'status' => 'open',
        ]);

        $response = $this->actingAs($driverA)
            ->post(route('repartidor.shifts.storeClosure'), [
                'shift_id' => $shiftB->id,
                'final_cash' => 100.00,
            ]);

        // BelongsToCompany oculta el turno de la otra empresa devolviendo 404
        $response->assertStatus(404);
    }

    public function test_respeta_el_limite_diario_de_rutas_configurado_en_config_plans()
    {
        $company = Company::factory()->create([
            'plan' => 'basico',
            'is_active' => true,
            'subscription_ends_at' => now()->addDays(10),
        ]);

        $user = User::factory()->create([
            'company_id' => $company->id,
            'role' => 'empleado',
            'is_active' => true,
        ]);

        for ($i = 0; $i < 25; $i++) {
            Shift::create([
                'company_id' => $company->id,
                'user_id' => $user->id,
                'opened_at' => now(),
                'initial_cash' => 50.00,
                'status' => 'closed',
            ]);
        }

        $response = $this->actingAs($user)
            ->post(route('repartidor.shifts.store'), [
                'initial_cash' => 50.00,
            ]);

        // Al exceder el límite, la aplicación redirige de vuelta con mensaje de error (302)
        $response->assertRedirect();
    }
}
