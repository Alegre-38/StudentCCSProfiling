<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faculty_core', function (Blueprint $table) {
            $table->string('Faculty_ID', 20)->primary();
            $table->string('First_Name', 50);
            $table->string('Last_Name', 50);
            $table->string('Department', 100);
            $table->string('Employment_Type', 30);
            $table->string('Email', 100)->unique()->nullable();
            $table->string('Specialization', 150)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty_core');
    }
};
