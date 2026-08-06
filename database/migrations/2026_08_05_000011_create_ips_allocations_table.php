<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ips_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ips_id')->constrained('investment_policy_statements')->cascadeOnDelete();
            $table->string('asset');
            $table->unsignedSmallInteger('pct');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ips_allocations');
    }
};
