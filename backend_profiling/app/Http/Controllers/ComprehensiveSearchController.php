<?php

namespace App\Http\Controllers;

use App\Models\StudentDemographic;
use Illuminate\Http\Request;

class ComprehensiveSearchController extends Controller
{
    /**
     * Query students based on profile criteria.
     * Supports filtering by: skill, sport, clearance, degree_program, year_level, violation_status
     */
    public function search(Request $request)
    {
        $query = StudentDemographic::query();

        // Filter by degree program
        if ($request->filled('degree_program')) {
            $query->where('Degree_Program', 'like', '%' . $request->degree_program . '%');
        }

        // Filter by year level
        if ($request->filled('year_level')) {
            $query->where('Year_Level', $request->year_level);
        }

        // Filter by medical clearance
        if ($request->filled('clearance')) {
            $query->where('Medical_Clearance', $request->clearance === 'cleared' ? 1 : 0);
        }

        // Filter by enrollment status
        if ($request->filled('enrollment_status')) {
            $query->where('Enrollment_Status', $request->enrollment_status);
        }

        // Filter by skill (joins skill_repository)
        if ($request->filled('skill')) {
            $query->whereHas('skillRepositories', function ($q) use ($request) {
                $q->where('Specific_Skill', 'like', '%' . $request->skill . '%')
                  ->orWhere('Skill_Category', 'like', '%' . $request->skill . '%');
            });
        }

        // Filter by skill proficiency level
        if ($request->filled('proficiency')) {
            $query->whereHas('skillRepositories', function ($q) use ($request) {
                $q->where('Proficiency', $request->proficiency);
            });
        }

        // Filter by affiliation / org
        if ($request->filled('organization')) {
            $query->whereHas('affiliations', function ($q) use ($request) {
                $q->where('Org_Name', 'like', '%' . $request->organization . '%');
            });
        }

        // Filter by non-academic activity type (category 3)
        if ($request->filled('activity_type')) {
            $query->whereHas('nonAcademicHistories', function ($q) use ($request) {
                $q->where('Activity_Type', 'like', '%' . $request->activity_type . '%');
            });
        }

        // Filter by disciplinary status
        if ($request->filled('violation_status')) {
            if ($request->violation_status === 'none') {
                $query->doesntHave('disciplinaryRecords');
            } else {
                $query->whereHas('disciplinaryRecords', function ($q) use ($request) {
                    $q->where('Status', $request->violation_status);
                });
            }
        }

        // General name/ID search
        if ($request->filled('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('Student_ID', 'like', '%' . $term . '%')
                  ->orWhere('First_Name', 'like', '%' . $term . '%')
                  ->orWhere('Last_Name', 'like', '%' . $term . '%')
                  ->orWhere('Email', 'like', '%' . $term . '%');
            });
        }

        $students = $query->with([
            'skillRepositories',
            'affiliations',
            'disciplinaryRecords',
            'nonAcademicHistories',
            'academicHistories',
        ])->get();

        // Add calculated GWA and normalize keys for frontend
        $students = $students->map(function ($s) {
            $data = $s->toArray();
            $data['skill_repositories']     = $s->skillRepositories;
            $data['affiliations']           = $s->affiliations;
            $data['disciplinary_records']   = $s->disciplinaryRecords;
            $data['non_academic_histories'] = $s->nonAcademicHistories;
            $data['academic_histories']     = $s->academicHistories;
            $data['calculated_gwa']         = \App\Models\AcademicHistory::calculateGWA($s->Student_ID);
            return $data;
        });

        return response()->json($students);
    }
}
