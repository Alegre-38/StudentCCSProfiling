<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faculty_roles', function (Blueprint $table) {
            $table->id('Role_ID');
            $table->string('Faculty_ID', 20);
            $table->string('Advisory_Type', 100);
            $table->string('Assigned_Group', 100);

            $table->foreign('Faculty_ID')
                  ->references('Faculty_ID')
                  ->on('faculty_core')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty_roles');
    }
};
