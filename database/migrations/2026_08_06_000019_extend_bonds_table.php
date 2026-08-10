<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bonds', function (Blueprint $table) {
            $table->date('issue_date')->nullable()->after('maturity_date');
            $table->decimal('face_value', 12, 2)->default(1000)->after('maturity_date');
            $table->string('payment_frequency')->default('semiannual')->after('issue_date');
            $table->decimal('last_price', 12, 2)->nullable()->after('payment_frequency');
            $table->decimal('yield', 8, 4)->nullable()->after('last_price');
            $table->decimal('benchmark_yield', 8, 4)->nullable()->after('yield');
            $table->string('benchmark_label')->nullable()->after('benchmark_yield');
            $table->string('currency')->default('IDR')->after('benchmark_label');
        });

        Schema::create('bond_watchlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('bond_id')->constrained()->cascadeOnDelete();
            $table->unique(['user_id', 'bond_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bond_watchlists');

        Schema::table('bonds', function (Blueprint $table) {
            $table->dropColumn([
                'issue_date',
                'face_value',
                'payment_frequency',
                'last_price',
                'yield',
                'benchmark_yield',
                'benchmark_label',
                'currency',
            ]);
        });
    }
};
