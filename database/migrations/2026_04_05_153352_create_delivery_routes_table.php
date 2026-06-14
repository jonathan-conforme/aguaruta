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
        Schema::create('delivery_routes', function (Blueprint $table) {
            $table->id();
            // Relaciones
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('canton_id')->constrained('cantons'); 
            $table->foreignId('sector_id')->nullable()->constrained('sectors');
            
            $table->string('route_name');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->unique(['company_id', 'route_name']);
           
            // indices para optimizar consultas 
            $table->index('company_id');
            $table->index(['company_id', 'is_active']); 
            $table->index(['company_id', 'canton_id']); 
        

   
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_routes');
    }
};
