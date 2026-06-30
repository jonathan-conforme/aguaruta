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
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('trip_number');
            $table->foreignId('shift_id')->nullable()->constrained('shifts')->nullOnDelete();
            $table->foreignId('driver_id')->constrained('users');
            $table->foreignId('seller_id')->constrained('users');
            $table->foreignId('helper_1_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('helper_2_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('delivery_route_id')->constrained()->cascadeOnDelete();

            $table->date('date');
            $table->enum('status', ['pending', 'active', 'completed'])->default('pending');
            $table->text('notes')->nullable();

            $table->timestamps();

            // Índices para optimizar reportes
            $table->index(['company_id', 'trip_number']);
            $table->index(['company_id', 'date']);
            $table->index(['company_id', 'status']);
            $table->index(['company_id', 'delivery_route_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trips');
    }
};
