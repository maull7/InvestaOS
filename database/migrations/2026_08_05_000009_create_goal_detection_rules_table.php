<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('goal_detection_rules', function (Blueprint $table) {
            $table->id();
            $table->string('goal_type');
            $table->string('condition');
            $table->decimal('threshold', 8, 2);
            $table->decimal('target_multiplier', 8, 2);
            $table->unsignedInteger('target_months')->default(12);
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('reason');
            $table->boolean('enabled')->default(true);
            $table->unsignedInteger('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('goal_detection_rules');
    }
};
