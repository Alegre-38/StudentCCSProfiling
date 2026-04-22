<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentDemographicController;
use App\Http\Controllers\FacultyCoreController;
use App\Http\Controllers\ComprehensiveSearchController;
use App\Http\Controllers\AuthController;

// Handle CORS preflight for all routes
Route::options('{any}', function() {
    return response()->json([], 204);
})->where('any', '.*');

// Auth routes (public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Auth routes (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout',          [AuthController::class, 'logout']);
    Route::get('/auth/me',               [AuthController::class, 'me']);
    Route::post('/auth/admin-register',  [AuthController::class, 'adminRegister']); // Admin only
});

// Students
Route::get('/students', [StudentDemographicController::class, 'index']);
Route::post('/students', [StudentDemographicController::class, 'store']);
Route::get('/students/{id}', [StudentDemographicController::class, 'show']);
Route::put('/students/{id}', [StudentDemographicController::class, 'update']);
Route::delete('/students/{id}', [StudentDemographicController::class, 'destroy']);
Route::put('/students/{id}/clearance', [StudentDemographicController::class, 'updateClearance']);
Route::post('/students/{id}/non-academic', [\App\Http\Controllers\NonAcademicHistoryController::class, 'logActivity']);
Route::post('/students/{id}/skills', [\App\Http\Controllers\SkillRepositoryController::class, 'storeSkill']);
Route::post('/students/{id}/academic', [\App\Http\Controllers\AcademicHistoryController::class, 'store']);
Route::post('/students/{id}/disciplinary', [\App\Http\Controllers\DisciplinaryRecordController::class, 'store']);
Route::post('/students/{id}/affiliations', [\App\Http\Controllers\AffiliationController::class, 'store']);

// Record management
Route::put('/disciplinary/{id}/status', [\App\Http\Controllers\DisciplinaryRecordController::class, 'updateStatus']);
Route::delete('/disciplinary/{id}', [\App\Http\Controllers\DisciplinaryRecordController::class, 'destroy']);
Route::put('/skills/{id}/proficiency', [\App\Http\Controllers\SkillRepositoryController::class, 'updateProficiency']);
Route::delete('/skills/{id}', [\App\Http\Controllers\SkillRepositoryController::class, 'destroy']);
Route::put('/affiliations/{id}/promote', [\App\Http\Controllers\AffiliationController::class, 'promoteRole']);
Route::delete('/affiliations/{id}', [\App\Http\Controllers\AffiliationController::class, 'destroy']);
Route::delete('/academic/{id}', [\App\Http\Controllers\AcademicHistoryController::class, 'destroy']);
Route::delete('/non-academic/{id}', [\App\Http\Controllers\NonAcademicHistoryController::class, 'destroy']);

// Faculty
Route::get('/faculties', [FacultyCoreController::class, 'index']);
Route::post('/faculties', [FacultyCoreController::class, 'store']);
Route::get('/faculties/{id}', [FacultyCoreController::class, 'show']);
Route::put('/faculties/{id}', [FacultyCoreController::class, 'update']);
Route::delete('/faculties/{id}', [FacultyCoreController::class, 'destroy']);
Route::post('/faculties/{id}/roles', [\App\Http\Controllers\FacultyRoleController::class, 'assignRole']);

// Comprehensive Search
Route::get('/search/students', [ComprehensiveSearchController::class, 'search']);

// Dashboard stats
Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'stats']);

// Student classmates (students in same section/program/year)
Route::get('/students/{id}/classmates', function ($id) {
    $student = \App\Models\StudentDemographic::findOrFail($id);

    // Normalize degree program for matching (handles both short and long names)
    $programMap = [
        'BS IT'  => ['BS IT', 'BS Information Technology', 'BSIT'],
        'BS CS'  => ['BS CS', 'BS Computer Science', 'BSCS'],
        'BS Information Technology' => ['BS IT', 'BS Information Technology', 'BSIT'],
        'BS Computer Science'       => ['BS CS', 'BS Computer Science', 'BSCS'],
    ];
    $matchPrograms = $programMap[$student->Degree_Program] ?? [$student->Degree_Program];

    $query = \App\Models\StudentDemographic::where('Student_ID', '!=', $id)
        ->whereIn('Degree_Program', $matchPrograms)
        ->where('Year_Level', $student->Year_Level);

    if ($student->Section) {
        $query->where('Section', $student->Section);
    }

    $classmates = $query->select('Student_ID', 'First_Name', 'Last_Name', 'Degree_Program', 'Year_Level', 'Section', 'Enrollment_Status')
        ->get();

    return response()->json($classmates);
});
