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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('ruc_number')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('logo')->nullable();
            $table->enum('plan', ['basico', 'premium', 'empresarial', 'vip'])->default('basico');
            $table->date('subscription_ends_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
