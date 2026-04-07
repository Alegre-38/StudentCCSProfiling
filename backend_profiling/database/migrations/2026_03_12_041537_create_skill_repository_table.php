<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skill_repository', function (Blueprint $table) {
            $table->id('Skill_Repo_ID');
            $table->string('Student_ID', 20);
            $table->string('Skill_Category', 100);
            $table->string('Specific_Skill', 100);
            $table->string('Proficiency', 30);

            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skill_repository');
    }
};
