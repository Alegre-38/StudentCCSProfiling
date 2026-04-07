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
        Schema::create('students', function (Blueprint $table) {
            $table->string('Student_ID', 20)->primary();
            $table->string('User_ID', 20);
            $table->string('First_Name', 50);
            $table->string('Last_Name', 50);
            $table->integer('Year_Level');
            $table->string('Degree_Program', 100);
            $table->string('Email', 100)->unique();
            $table->boolean('Medical_Clearance')->default(false);
            $table->string('Enrollment_Status', 20); // Active/Graduated/Inactive
            
            // Check constraints are typically DB specific. 
            // We use simple integer in migration, validation in Laravel handles BETWEEN 1 and 5.

            $table->foreign('User_ID')
                  ->references('User_ID')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
