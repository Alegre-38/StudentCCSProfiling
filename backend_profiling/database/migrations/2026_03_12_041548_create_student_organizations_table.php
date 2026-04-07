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
        Schema::create('student_organizations', function (Blueprint $table) {
            $table->id('ID');
            $table->string('Student_ID', 20);
            $table->unsignedBigInteger('Organization_ID');
            $table->string('Role', 50);
            $table->date('Date_Joined');
            
            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
                  
            $table->foreign('Organization_ID')
                  ->references('Organization_ID')
                  ->on('organizations')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_organizations');
    }
};
