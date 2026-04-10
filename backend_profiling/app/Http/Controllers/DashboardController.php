<?php

namespace App\Http\Controllers;

use App\Models\StudentDemographic;
use App\Models\FacultyCore;
use App\Models\AcademicHistory;
use App\Models\DisciplinaryRecord;
use App\Models\SkillRepository;
use App\Models\Affiliation;
use App\Models\NonAcademicHistory;
use App\Models\FacultyRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function stats()
    {
        // Cache for 2 minutes to avoid hammering the DB on every page visit
        return Cache::remember('dashboard_stats', 120, function () {

            // Single query for all student aggregates
            $studentStats = DB::table('students')->selectRaw("
                COUNT(*) as total,
                SUM(Gender = 'Male') as male,
                SUM(Gender = 'Female') as female,
                SUM(Medical_Clearance = 1) as cleared
            ")->first();

            $total   = (int) $studentStats->total;
            $male    = (int) $studentStats->male;
            $female  = (int) $studentStats->female;
            $cleared = (int) $studentStats->cleared;

            // Breakdowns via GROUP BY — no full table loads
            $programBreakdown = DB::table('students')
                ->select('Degree_Program', DB::raw('COUNT(*) as count'))
                ->whereNotNull('Degree_Program')
                ->groupBy('Degree_Program')
                ->orderByDesc('count')
                ->limit(5)
                ->pluck('count', 'Degree_Program');

            $yearBreakdown = DB::table('students')
                ->select('Year_Level', DB::raw('COUNT(*) as count'))
                ->whereNotNull('Year_Level')
                ->groupBy('Year_Level')
                ->orderBy('Year_Level')
                ->pluck('count', 'Year_Level');

            $enrollmentBreakdown = DB::table('students')
                ->select('Enrollment_Status', DB::raw('COUNT(*) as count'))
                ->whereNotNull('Enrollment_Status')
                ->groupBy('Enrollment_Status')
                ->pluck('count', 'Enrollment_Status');

            // Faculty
            $totalFaculty = DB::table('faculty_core')->count();
            $facultyType  = DB::table('faculty_core')
                ->select('Employment_Type', DB::raw('COUNT(*) as count'))
                ->whereNotNull('Employment_Type')
                ->groupBy('Employment_Type')
                ->pluck('count', 'Employment_Type');
            $totalRoles = DB::table('faculty_roles')->count();

            // Record counts — simple COUNT queries
            $discStats = DB::table('disciplinary_records')->selectRaw("
                COUNT(*) as total,
                SUM(Status = 'Pending') as pending,
                SUM(Status = 'Resolved') as resolved
            ")->first();

            return response()->json([
                'total_students'        => $total,
                'male'                  => $male,
                'female'                => $female,
                'other_gender'          => max(0, $total - $male - $female),
                'cleared'               => $cleared,
                'pending_clearance'     => $total - $cleared,
                'enrollment_breakdown'  => $enrollmentBreakdown,
                'program_breakdown'     => $programBreakdown,
                'year_breakdown'        => $yearBreakdown,
                'total_faculty'         => $totalFaculty,
                'faculty_type'          => $facultyType,
                'total_roles'           => $totalRoles,
                'disciplinary_total'    => (int) $discStats->total,
                'disciplinary_pending'  => (int) $discStats->pending,
                'disciplinary_resolved' => (int) $discStats->resolved,
                'total_skills'          => DB::table('skill_repository')->count(),
                'total_affiliations'    => DB::table('affiliations')->count(),
                'total_activities'      => DB::table('non_academic_histories')->count(),
                'total_academic'        => DB::table('academic_histories')->count(),
            ]);
        });
    }
}
