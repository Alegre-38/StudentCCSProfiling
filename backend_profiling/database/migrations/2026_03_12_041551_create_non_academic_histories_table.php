<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('non_academic_histories', function (Blueprint $table) {
            $table->id('Activity_ID');
            $table->string('Student_ID', 20);
            $table->string('Activity_Type', 100);
            $table->string('Activity_Name', 150);
            $table->date('Date_Logged');
            $table->text('Contribution')->nullable();

            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('non_academic_histories');
    }
};
