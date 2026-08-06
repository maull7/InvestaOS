<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('risk_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_profile_id')->constrained('risk_profiles')->cascadeOnDelete();
            $table->string('asset');
            $table->unsignedSmallInteger('pct');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('risk_allocations');
    }
};
