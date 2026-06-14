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
        Schema::create('purchases', function (Blueprint $table) {
          $table->id();
           
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();   
            $table->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $table->string('invoice_number')->nullable(); 
            $table->decimal('total_amount', 10, 2)->default(0); 
            $table->date('purchase_date'); 
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed');
            $table->text('notes')->nullable(); 
            
            $table->timestamps();
            
            // Índice para búsquedas rápidas en el historial de la empresa
            $table->index(['company_id', 'purchase_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
