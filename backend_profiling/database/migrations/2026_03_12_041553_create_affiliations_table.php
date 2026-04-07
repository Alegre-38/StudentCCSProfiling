<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('affiliations', function (Blueprint $table) {
            $table->id('Affiliation_ID');
            $table->string('Student_ID', 20);
            $table->string('Org_Name', 150);
            $table->string('Role', 100)->nullable();

            $table->foreign('Student_ID')
                  ->references('Student_ID')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('affiliations');
    }
};
