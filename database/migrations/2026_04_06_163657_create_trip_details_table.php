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
        Schema::create('trip_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            
            $table->integer('initial_quantity'); // carga inicial de productos que lleva el camion
            $table->integer('returned_quantity')->nullable();
            $table->integer('recovered_bottles')->nullable();
             
     
            $table->integer('quantity'); // stock actual en el camión (se va descontando)
            
            $table->timestamps();

            // Índice compuesto
            $table->index(['trip_id', 'product_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trip_details');
    }
};
