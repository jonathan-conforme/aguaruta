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
        Schema::create('provinces', function (Blueprint $table) {
            $table->id();    
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Tabla de Cantones
        Schema::create('cantons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
            
            $table->unique(['province_id', 'name']); // Evita duplicados
        });

        // Tabla de Sectores (Opcionales)
        Schema::create('sectors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('canton_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sectors');
        Schema::dropIfExists('cantons');
        Schema::dropIfExists('provinces');
    }
};
