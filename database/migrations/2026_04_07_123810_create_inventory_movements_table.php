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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trip_id')->nullable();
            
            // Especificamos 'products' porque la convención plural vs singular nos puede dar problemas si lo dejamos vacío
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete(); 
            
            // Datos del movimiento
            $table->enum('type', ['in', 'out', 'packaging'])->comment('in = entrada, out = salida, packaging = ensasado');
            $table->integer('quantity');
            $table->string('description')->nullable(); // Opcional, por si quieren poner "Botellones rotos" o "Lote #123"
            $table->timestamps();

           // ÍNDICES PARA OPTIMIZAR BÚSQUEDAS
            // Acelera la búsqueda de todos los movimientos de un producto dentro de una empresa
            $table->index(['company_id', 'product_id']);
            
            // Acelera el historial general (el query exacto que usa tu vista actual)
            $table->index(['company_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
