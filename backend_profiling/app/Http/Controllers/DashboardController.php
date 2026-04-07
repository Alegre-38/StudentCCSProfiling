<?php

namespace App\Http\Controllers;

use App\Models\StudentDemographic;
use App\Models\FacultyCore;
use App\Models\AcademicHistory;
use App\Models\DisciplinaryRecord;
use App\Models\SkillRepository;
use App\Models\Affiliation;
use App\Models\NonAcademicHistory;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $students = StudentDemographic::all();
        $faculty  = FacultyCore::with('roles')->get();

        $total     = $students->count();
        $male      = $students->where('Gender', 'Male')->count();
        $female    = $students->where('Gender', 'Female')->count();
        $other     = $total - $male - $female;
        $cleared   = $students->where('Medical_Clearance', 1)->count();
        $pending   = $total - $cleared;

        // Enrollment breakdown
        $enrollmentBreakdown = $students->groupBy('Enrollment_Status')
            ->map(fn($g) => $g->count());

        // Program breakdown
        $programBreakdown = $students->groupBy('Degree_Program')
            ->map(fn($g) => $g->count())
            ->sortByDesc(fn($v) => $v)
            ->take(5);

        // Year level breakdown
        $yearBreakdown = $students->groupBy('Year_Level')
            ->map(fn($g) => $g->count())
            ->sortKeys();

        // Faculty employment type
        $facultyTypeBreakdown = $faculty->groupBy('Employment_Type')
            ->map(fn($g) => $g->count());

        // Disciplinary
        $disciplinaryTotal  = DisciplinaryRecord::count();
        $disciplinaryPending = DisciplinaryRecord::where('Status', 'Pending')->count();
        $disciplinaryResolved = DisciplinaryRecord::where('Status', 'Resolved')->count();

        // Skills & affiliations counts
        $totalSkills       = SkillRepository::count();
        $totalAffiliations = Affiliation::count();
        $totalActivities   = NonAcademicHistory::count();
        $totalAcademic     = AcademicHistory::count();

        // Faculty roles
        $totalRoles = $faculty->sum(fn($f) => $f->roles->count());

        return response()->json([
            // Students
            'total_students'       => $total,
            'male'                 => $male,
            'female'               => $female,
            'other_gender'         => $other,
            'cleared'              => $cleared,
            'pending_clearance'    => $pending,
            'enrollment_breakdown' => $enrollmentBreakdown,
            'program_breakdown'    => $programBreakdown,
            'year_breakdown'       => $yearBreakdown,

            // Faculty
            'total_faculty'        => $faculty->count(),
            'faculty_type'         => $facultyTypeBreakdown,
            'total_roles'          => $totalRoles,

            // Records
            'disciplinary_total'   => $disciplinaryTotal,
            'disciplinary_pending' => $disciplinaryPending,
            'disciplinary_resolved'=> $disciplinaryResolved,
            'total_skills'         => $totalSkills,
            'total_affiliations'   => $totalAffiliations,
            'total_activities'     => $totalActivities,
            'total_academic'       => $totalAcademic,
        ]);
    }
}
