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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
           $table->foreignId('shift_id')->constrained()->cascadeOnDelete();
           $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 8, 2);
            $table->enum('category', ['fuel', 'toll', 'repair', 'food', 'other']);
            $table->string('description')->nullable();
            
            $table->string('receipt_photo_url')->nullable();
            $table->timestamps();


            $table->index(['shift_id']);
            $table->index(['user_id']);
            $table->index(['company_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
