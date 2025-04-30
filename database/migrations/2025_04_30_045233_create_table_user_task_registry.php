<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tk_user_task_registry', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('user_id')->nullable()->default(null);
            $table->string('title', 150)->nullable()->default(null);
            $table->text('content')->nullable()->default(null);
            $table->tinyInteger('status')->default(0);
            $table->tinyInteger('is_published')->default(0)->comment("1: Published");
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tk_user_task_registry');
    }
};
