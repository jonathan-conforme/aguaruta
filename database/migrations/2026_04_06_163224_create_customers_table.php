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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_route_id')->constrained()->cascadeOnDelete();   
            $table->string('name');
            $table->string('identification')->nullable(); // cédula o RUC
            $table->unique(['company_id', 'identification']);
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            
            $table->integer('bottle_debt')->default(0);
            $table->timestamps();

            // indeces para mejorar la búsqueda por nombre o teléfono
            $table->index(['company_id', 'name']);
            $table->index(['company_id', 'phone']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
