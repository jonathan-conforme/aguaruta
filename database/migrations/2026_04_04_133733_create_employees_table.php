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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('employee_category_id')->constrained()->onDelete('cascade');
            $table->string('identification')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            // Índice para búsquedas rápidas por empresa y estado activo (muy común al listar personal).
            $table->index(['company_id', 'is_active']);

            // Índice para búsquedas rápidas por apellido (muy común al buscar personal).
            $table->index('last_name');
            $table->index('identification');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
