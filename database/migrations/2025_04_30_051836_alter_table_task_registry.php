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
        Schema::table('tk_user_task_registry', function (Blueprint $table) {
            $table->tinyInteger('is_trash')->default(0)->after('is_published');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tk_user_task_registry', function (Blueprint $table) {
            $table->dropColumn('is_trash');
        });
    }
};
