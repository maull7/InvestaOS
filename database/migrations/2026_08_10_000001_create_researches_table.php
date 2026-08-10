<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('researches', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['stock', 'fund', 'bond', 'macro', 'sector', 'theme', 'economic_outlook']);
            $table->string('asset_type')->nullable();
            $table->unsignedBigInteger('asset_id')->nullable();
            $table->string('asset_code')->nullable();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->json('content');
            $table->enum('status', ['draft', 'processing', 'completed', 'published', 'archived'])->default('draft');
            $table->string('source_type')->default('ai');
            $table->string('model')->nullable();
            $table->decimal('confidence', 5, 2)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('researches')->nullOnDelete();
            $table->unsignedInteger('version')->default(1);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['category', 'status']);
            $table->index(['asset_type', 'asset_code']);
            $table->index('published_at');
        });

        Schema::create('research_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('research_id')->constrained('researches')->cascadeOnDelete();
            $table->string('claim_key');
            $table->json('data');
            $table->string('source');
            $table->string('period')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('as_of')->nullable();
            $table->timestamps();

            $table->index('research_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('research_sources');
        Schema::dropIfExists('researches');
    }
};
