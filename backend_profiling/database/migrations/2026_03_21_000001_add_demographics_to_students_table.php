<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Personal
            $table->string('Middle_Name', 50)->nullable()->after('First_Name');
            $table->date('Date_of_Birth')->nullable()->after('Last_Name');
            $table->integer('Age')->nullable()->after('Date_of_Birth');
            $table->string('Gender', 20)->nullable()->after('Age');
            $table->string('Civil_Status', 20)->nullable()->after('Gender');
            $table->string('Nationality', 50)->nullable()->after('Civil_Status');
            $table->string('Religion', 50)->nullable()->after('Nationality');

            // Contact
            $table->string('Mobile_Number', 20)->nullable()->after('Email');
            $table->string('Street', 100)->nullable()->after('Mobile_Number');
            $table->string('Barangay', 100)->nullable()->after('Street');
            $table->string('City', 100)->nullable()->after('Barangay');
            $table->string('Province', 100)->nullable()->after('City');
            $table->string('ZIP_Code', 10)->nullable()->after('Province');

            // Academic
            $table->string('Section', 50)->nullable()->after('Degree_Program');
            $table->string('School_Year', 20)->nullable()->after('Section');

            // Parent/Guardian
            $table->string('Guardian_Name', 100)->nullable()->after('School_Year');
            $table->string('Guardian_Relationship', 50)->nullable()->after('Guardian_Name');
            $table->string('Guardian_Contact', 20)->nullable()->after('Guardian_Relationship');
            $table->string('Guardian_Occupation', 100)->nullable()->after('Guardian_Contact');
            $table->string('Guardian_Address', 255)->nullable()->after('Guardian_Occupation');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'Middle_Name','Date_of_Birth','Age','Gender','Civil_Status','Nationality','Religion',
                'Mobile_Number','Street','Barangay','City','Province','ZIP_Code',
                'Section','School_Year',
                'Guardian_Name','Guardian_Relationship','Guardian_Contact','Guardian_Occupation','Guardian_Address',
            ]);
        });
    }
};
