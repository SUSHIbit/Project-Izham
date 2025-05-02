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
        Schema::table('enemies', function (Blueprint $table) {
            // Drop existing columns
            $table->dropColumn(['attack', 'defense']);
        });
        
        // Create a separate operation to add the new columns
        Schema::table('enemies', function (Blueprint $table) {
            // Add new columns
            $table->integer('attack_min')->default(5);
            $table->integer('attack_max')->default(10);
            $table->integer('defense')->default(2);
            $table->integer('level_group')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('enemies', function (Blueprint $table) {
            // Revert changes by removing new columns
            $table->dropColumn(['attack_min', 'attack_max', 'level_group']);
            
            // Add back original columns
            $table->integer('attack')->default(5);
            $table->integer('defense')->default(2);
        });
    }
};