<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ruc_number')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('logo')->nullable();
            $table->enum('plan', ['basico', 'premium', 'empresarial', 'vip'])->default('basico');
            $table->date('subscription_ends_at')->nullable();

            // Campos SRI (Opcionales al registrarse, configurables después)
            $table->enum('sri_environment', ['1', '2'])->default('1')->comment('1: Pruebas, 2: Producción');
            $table->string('sri_establishment', 3)->default('001');
            $table->string('sri_emission_point', 3)->default('001');
            $table->boolean('sri_accounting_obliged')->default(false);
            $table->string('sri_rimpe_type')->nullable(); // Ej: CONTRIBUYENTE RÉGIMEN RIMPE
            $table->string('sri_signature_path')->nullable();
            $table->string('sri_signature_password')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
