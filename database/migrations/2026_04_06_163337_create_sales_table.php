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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('shift_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trip_id')->constrained()->cascadeOnDelete();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();

            $table->enum('payment_method', ['cash', 'transfer', 'credit'])->default('cash');
            $table->enum('status', ['paid', 'partial', 'pending'])->default('paid');
            $table->decimal('total', 8, 2);
            $table->decimal('paid_amount', 8, 2)->default(0);
            $table->decimal('balance_amount', 8, 2)->default(0);
            $table->timestamps();

            // indices para mejorar rendimiento en consultas comunes
            $table->index(['company_id', 'created_at']); // Muy útil para reportes de ventas por fecha
            $table->index(['company_id', 'payment_method']);
            $table->index(['company_id', 'status']);
            $table->index(['customer_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
