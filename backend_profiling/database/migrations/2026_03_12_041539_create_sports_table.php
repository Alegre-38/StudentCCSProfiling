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
        Schema::create('sports', function (Blueprint $table) {
            $table->id('Sport_ID');
            $table->string('Student_ID', 20);
            $table->unsignedBigInteger('Sport_Type_ID');
            $table->string('Position', 50)->nullable();
            $table->string('Skill_Level', 30);
            $table->boolean('Eligibility_Status')->default(false); // Derived from Medical_Clearance
            
            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
                  
            $table->foreign('Sport_Type_ID')
                  ->references('Sport_Type_ID')
                  ->on('sport_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sports');
    }
};
