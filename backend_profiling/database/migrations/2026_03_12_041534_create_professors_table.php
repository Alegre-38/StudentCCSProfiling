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
        Schema::create('professors', function (Blueprint $table) {
            $table->string('Professor_ID', 20)->primary();
            $table->string('User_ID', 20);
            $table->string('First_Name', 50);
            $table->string('Last_Name', 50);
            $table->unsignedBigInteger('Department_ID');
            $table->string('Employment_Type', 30);
            
            $table->foreign('User_ID')
                  ->references('User_ID')
                  ->on('users')
                  ->onDelete('cascade');
                  
            $table->foreign('Department_ID')
                  ->references('Department_ID')
                  ->on('departments');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professors');
    }
};
