<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('investment_policy_statements', function (Blueprint $table) {
            $table->string('written_by')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('investment_policy_statements', function (Blueprint $table) {
            $table->dropColumn('written_by');
        });
    }
};
