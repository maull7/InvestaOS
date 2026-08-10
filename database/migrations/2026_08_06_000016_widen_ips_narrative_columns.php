<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('investment_policy_statements', function (Blueprint $table) {
            $table->text('objective')->change();
            $table->text('time_horizon')->change();
            $table->text('benchmark')->change();
            $table->text('rebalancing_policy')->change();
            $table->text('review_schedule')->change();
        });
    }

    public function down(): void
    {
        Schema::table('investment_policy_statements', function (Blueprint $table) {
            $table->string('objective')->change();
            $table->string('time_horizon')->change();
            $table->string('benchmark')->change();
            $table->string('rebalancing_policy')->change();
            $table->string('review_schedule')->change();
        });
    }
};
