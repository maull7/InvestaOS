<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_managers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable()->unique();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('mutual_funds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('investment_manager_id')->nullable()->constrained()->nullOnDelete();
            $table->string('code')->nullable()->unique();
            $table->string('name');
            $table->string('fund_type');
            $table->string('currency')->default('IDR');
            $table->unsignedTinyInteger('risk_level')->nullable();
            $table->string('custodian_bank')->nullable();
            $table->date('launch_date')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mutual_funds');
        Schema::dropIfExists('investment_managers');
    }
};
