<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();

            $table->string('full_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('occupation')->nullable();
            $table->string('company')->nullable();

            $table->decimal('annual_income', 15, 2)->nullable();
            $table->decimal('monthly_expenses', 15, 2)->nullable();
            $table->decimal('total_assets', 15, 2)->nullable();
            $table->decimal('total_liabilities', 15, 2)->nullable();
            $table->decimal('emergency_fund', 15, 2)->nullable();

            $table->foreignId('risk_profile_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('risk_score')->nullable();

            $table->unsignedTinyInteger('current_step')->default(1);
            $table->enum('status', ['draft', 'completed'])->default('draft');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_profiles');
    }
};
