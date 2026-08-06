<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investment_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained('investment_profiles')->cascadeOnDelete();
            $table->foreignId('question_id')->constrained('investment_questions')->cascadeOnDelete();
            $table->foreignId('option_id')->constrained('investment_question_options')->cascadeOnDelete();
            $table->unique(['profile_id', 'question_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investment_answers');
    }
};
