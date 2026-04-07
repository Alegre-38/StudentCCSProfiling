<?php

namespace App\Http\Controllers;

use App\Models\StudentDemographic;
use Illuminate\Http\Request;

class StudentDemographicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(StudentDemographic::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'Student_ID'     => 'required|string|max:20|unique:students,Student_ID',
            'First_Name'     => 'required|string|max:50',
            'Last_Name'      => 'required|string|max:50',
            'Email'          => 'required|email|unique:students,Email',
            'Degree_Program' => 'required|string|max:100',
            'Year_Level'     => 'required|integer|min:1|max:5',
            'Enrollment_Status' => 'required|string',
        ]);

        $baseUsername = strtolower(str_replace(' ', '.', $request->First_Name)) . '.' . strtolower(str_replace(' ', '.', $request->Last_Name));
        $username = $baseUsername;
        $suffix = 1;
        while (\App\Models\User::where('Username', $username)->exists()) {
            $username = $baseUsername . $suffix;
            $suffix++;
        }

        $user = \App\Models\User::create([
            'User_ID'        => $request->Student_ID,
            'Username'       => $username,
            'Password'       => bcrypt('Student@123'),
            'Role'           => 'Student',
            'Account_Status' => 'Active',
        ]);

        $student = StudentDemographic::create([
            'Student_ID'            => $request->Student_ID,
            'User_ID'               => $user->User_ID,
            // Personal
            'First_Name'            => $request->First_Name,
            'Middle_Name'           => $request->Middle_Name,
            'Last_Name'             => $request->Last_Name,
            'Date_of_Birth'         => $request->Date_of_Birth,
            'Age'                   => $request->Age,
            'Gender'                => $request->Gender,
            'Civil_Status'          => $request->Civil_Status,
            'Nationality'           => $request->Nationality,
            'Religion'              => $request->Religion,
            // Contact
            'Email'                 => $request->Email,
            'Mobile_Number'         => $request->Mobile_Number,
            'Street'                => $request->Street,
            'Barangay'              => $request->Barangay,
            'City'                  => $request->City,
            'Province'              => $request->Province,
            'ZIP_Code'              => $request->ZIP_Code,
            // Academic
            'Year_Level'            => $request->Year_Level,
            'Degree_Program'        => $request->Degree_Program,
            'Section'               => $request->Section,
            'School_Year'           => $request->School_Year,
            'Medical_Clearance'     => false,
            'Enrollment_Status'     => $request->Enrollment_Status,
            // Guardian
            'Guardian_Name'         => $request->Guardian_Name,
            'Guardian_Relationship' => $request->Guardian_Relationship,
            'Guardian_Contact'      => $request->Guardian_Contact,
            'Guardian_Occupation'   => $request->Guardian_Occupation,
            'Guardian_Address'      => $request->Guardian_Address,
        ]);

        return response()->json(['message' => 'Student registered successfully.', 'student' => $student], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $student = StudentDemographic::findOrFail($id);
        $student->load([
            'academicHistories',
            'nonAcademicHistories',
            'disciplinaryRecords',
            'skillRepositories',
            'affiliations'
        ]);

        $gwa = \App\Models\AcademicHistory::calculateGWA($student->Student_ID);

        return response()->json(array_merge($student->toArray(), [
            'academic_histories'     => $student->academicHistories,
            'non_academic_histories' => $student->nonAcademicHistories,
            'disciplinary_records'   => $student->disciplinaryRecords,
            'skill_repositories'     => $student->skillRepositories,
            'affiliations'           => $student->affiliations,
            'calculated_gwa'         => $gwa,
            // Aliases for frontend compatibility
            'Email_Address'          => $student->Email,
            'Med_Clearance'          => $student->Medical_Clearance,
        ]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $student = StudentDemographic::findOrFail($id);

        $request->validate([
            'First_Name'     => 'sometimes|required|string|max:50',
            'Last_Name'      => 'sometimes|required|string|max:50',
            'Email'          => 'sometimes|required|email|unique:students,Email,' . $id . ',Student_ID',
            'Degree_Program' => 'sometimes|required|string|max:100',
            'Year_Level'     => 'sometimes|required|integer|min:1|max:5',
        ]);

        $student->update($request->only([
            'First_Name', 'Middle_Name', 'Last_Name',
            'Date_of_Birth', 'Age', 'Gender', 'Civil_Status', 'Nationality', 'Religion',
            'Email', 'Mobile_Number', 'Street', 'Barangay', 'City', 'Province', 'ZIP_Code',
            'Year_Level', 'Degree_Program', 'Section', 'School_Year', 'Enrollment_Status',
            'Guardian_Name', 'Guardian_Relationship', 'Guardian_Contact', 'Guardian_Occupation', 'Guardian_Address',
        ]));

        return response()->json(['message' => 'Student updated successfully.', 'student' => $student->fresh()]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $student = StudentDemographic::findOrFail($id);

        // Delete all related records first
        $student->academicHistories()->delete();
        $student->nonAcademicHistories()->delete();
        $student->disciplinaryRecords()->delete();
        $student->skillRepositories()->delete();
        $student->affiliations()->delete();

        // Delete associated user account
        \App\Models\User::where('User_ID', $student->Student_ID)->delete();

        $student->delete();

        return response()->json(['message' => 'Student deleted successfully.']);
    }

    public function updateClearance(Request $request, $id)
    {
        $request->validate(['Med_Clearance' => 'required|boolean']);
        $student = StudentDemographic::findOrFail($id);
        $student->updateClearance($request->input('Med_Clearance'));
        return response()->json(['message' => 'Medical clearance updated securely.', 'student' => $student]);
    }
}
