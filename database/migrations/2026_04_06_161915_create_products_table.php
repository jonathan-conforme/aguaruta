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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->integer('units_per_package')->default(1);
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->integer('current_stock')->default(0);
            $table->integer('empty_stock')->default(0);
            $table->boolean('requires_return')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // indices para mejorar la búsqueda por nombre
            $table->index(['company_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
