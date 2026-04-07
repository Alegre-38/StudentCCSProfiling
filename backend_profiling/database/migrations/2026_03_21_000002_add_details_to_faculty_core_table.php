<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('faculty_core', function (Blueprint $table) {
            $table->string('Middle_Name', 50)->nullable()->after('First_Name');
            $table->string('Position', 100)->nullable()->after('Last_Name');
            $table->date('Hire_Date')->nullable()->after('Employment_Type');
            $table->string('Contact_Number', 20)->nullable()->after('Email');
            $table->string('Office_Location', 100)->nullable()->after('Contact_Number');
        });
    }

    public function down(): void
    {
        Schema::table('faculty_core', function (Blueprint $table) {
            $table->dropColumn(['Middle_Name','Position','Hire_Date','Contact_Number','Office_Location']);
        });
    }
};
