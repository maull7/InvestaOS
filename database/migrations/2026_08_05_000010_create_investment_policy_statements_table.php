<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_policy_statements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('investment_profiles')->cascadeOnDelete();
            $table->enum('status', ['draft', 'final', 'superseded'])->default('draft');
            $table->string('objective');
            $table->foreignId('risk_profile_id')->nullable()->constrained('risk_profiles')->nullOnDelete();
            $table->integer('risk_score')->nullable();
            $table->text('risk_tolerance')->nullable();
            $table->string('time_horizon');
            $table->text('liquidity_requirement');
            $table->string('benchmark');
            $table->text('tax_note');
            $table->string('rebalancing_policy');
            $table->string('review_schedule');
            $table->enum('language', ['en', 'id'])->default('en');
            $table->timestamp('generated_at')->nullable();
            $table->timestamp('declared_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_policy_statements');
    }
};
