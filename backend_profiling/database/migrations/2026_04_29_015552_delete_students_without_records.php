<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Find students that have NO skills, NO non-academic activities, AND NO disciplinary records
        $toDelete = DB::table('students as s')
            ->leftJoin('skill_repository as sk', 'sk.Student_ID', '=', 's.Student_ID')
            ->leftJoin('non_academic_histories as na', 'na.Student_ID', '=', 's.Student_ID')
            ->leftJoin('disciplinary_records as dr', 'dr.Student_ID', '=', 's.Student_ID')
            ->whereNull('sk.Student_ID')
            ->whereNull('na.Student_ID')
            ->whereNull('dr.Student_ID')
            ->pluck('s.Student_ID')
            ->toArray();

        if (empty($toDelete)) {
            echo "No students to delete.\n";
            return;
        }

        echo "Deleting " . count($toDelete) . " students with no records...\n";

        // Delete in chunks to avoid query size limits
        $chunks = array_chunk($toDelete, 100);
        foreach ($chunks as $chunk) {
            // Delete related user accounts
            DB::table('users')
                ->whereIn('User_ID', DB::table('students')
                    ->whereIn('Student_ID', $chunk)
                    ->pluck('User_ID'))
                ->delete();

            // Delete the students
            DB::table('students')->whereIn('Student_ID', $chunk)->delete();
        }

        echo "Done. Deleted " . count($toDelete) . " students.\n";
    }

    public function down(): void
    {
        // Not reversible
    }
};
