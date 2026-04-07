<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disciplinary_records', function (Blueprint $table) {
            $table->id('Violation_ID');
            $table->string('Student_ID', 20);
            $table->string('Offense_Level', 50);
            $table->string('Status', 50)->default('Pending');
            $table->date('Date_Logged');

            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disciplinary_records');
    }
};
