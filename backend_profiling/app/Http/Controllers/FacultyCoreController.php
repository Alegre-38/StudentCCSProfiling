<?php

namespace App\Http\Controllers;

use App\Models\FacultyCore;
use Illuminate\Http\Request;

class FacultyCoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            \App\Models\FacultyCore::with(['roles'])->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'Faculty_ID'      => 'required|string|max:20|unique:faculty_core,Faculty_ID',
            'First_Name'      => 'required|string|max:50',
            'Last_Name'       => 'required|string|max:50',
            'Department'      => 'required|string|max:100',
            'Employment_Type' => 'required|string|max:30',
            'Email'           => 'required|email|unique:faculty_core,Email',
        ]);

        $faculty = \App\Models\FacultyCore::create($request->only([
            'Faculty_ID', 'First_Name', 'Middle_Name', 'Last_Name',
            'Position', 'Department', 'Employment_Type', 'Hire_Date',
            'Email', 'Contact_Number', 'Office_Location', 'Specialization',
        ]));

        return response()->json(['message' => 'Faculty registered successfully.', 'faculty' => $faculty], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $faculty = \App\Models\FacultyCore::with(['roles'])->find($id);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        $details = $faculty->getFacultyDetails();
        $details['roles'] = $faculty->roles;

        return response()->json($details);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $faculty = FacultyCore::find($id);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        $request->validate([
            'First_Name'      => 'sometimes|required|string|max:50',
            'Last_Name'       => 'sometimes|required|string|max:50',
            'Department'      => 'sometimes|required|string|max:100',
            'Employment_Type' => 'sometimes|required|string|max:30',
            'Email'           => 'sometimes|required|email|unique:faculty_core,Email,' . $id . ',Faculty_ID',
        ]);

        $faculty->update($request->only([
            'First_Name', 'Middle_Name', 'Last_Name',
            'Position', 'Department', 'Employment_Type', 'Hire_Date',
            'Email', 'Contact_Number', 'Specialization',
        ]));

        return response()->json(['message' => 'Faculty updated successfully.', 'faculty' => $faculty]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $faculty = FacultyCore::find($id);

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        // Delete related roles first
        $faculty->roles()->delete();

        // Delete linked user account if exists
        \App\Models\User::where('User_ID', $faculty->User_ID)->delete();

        $faculty->delete();

        return response()->json(['message' => 'Faculty deleted successfully.']);
    }
}
