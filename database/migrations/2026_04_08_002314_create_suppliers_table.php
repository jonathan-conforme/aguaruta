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
        Schema::create('suppliers', function (Blueprint $table) {
         $table->id();
            // Multitenant: Relación con la empresa
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->string('name'); 
            $table->string('contact_name')->nullable(); 
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('ruc_or_id')->nullable(); 
            
            $table->timestamps();
            
            // Índice para acelerar búsquedas por empresa
            $table->index(['company_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
