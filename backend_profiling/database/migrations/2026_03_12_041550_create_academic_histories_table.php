<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('academic_histories', function (Blueprint $table) {
            $table->id('Record_ID');
            $table->string('Student_ID', 20);
            $table->string('Course_Code', 20);
            $table->decimal('Final_Grade', 4, 2);
            $table->string('Term_Taken', 50);

            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('academic_histories');
    }
};
