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
        Schema::create('organizations', function (Blueprint $table) {
            $table->id('Organization_ID');
            $table->string('Org_Name', 150)->unique();
            $table->string('Org_Type', 50);
            $table->unsignedBigInteger('Department_ID')->nullable();
            $table->string('Adviser_ID', 20)->nullable();
            
            $table->foreign('Department_ID')
                  ->references('Department_ID')
                  ->on('departments');
                  
            $table->foreign('Adviser_ID')
                  ->references('Professor_ID')
                  ->on('professors');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
