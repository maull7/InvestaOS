<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('investment_profiles')->cascadeOnDelete();
            $table->string('type');
            $table->decimal('target_amount', 15, 2);
            $table->date('target_date');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_goals');
    }
};
