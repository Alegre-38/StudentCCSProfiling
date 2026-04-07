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
        Schema::create('skills', function (Blueprint $table) {
            $table->id('Skill_ID');
            $table->string('Student_ID', 20);
            $table->unsignedBigInteger('Skill_Category_ID');
            $table->string('Skill_Name', 100);
            // ENUM equivalent in string validation: Beginner, Intermediate, Advanced
            $table->string('Proficiency_Level', 30);
            
            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
                  
            $table->foreign('Skill_Category_ID')
                  ->references('Category_ID')
                  ->on('skill_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
