<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ips_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ips_id')->constrained('investment_policy_statements')->cascadeOnDelete();
            $table->string('type');
            $table->decimal('target_amount', 15, 2);
            $table->date('target_date');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ips_goals');
    }
};
