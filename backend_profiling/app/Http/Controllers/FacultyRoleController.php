<?php

namespace App\Http\Controllers;

use App\Models\FacultyRole;
use Illuminate\Http\Request;

class FacultyRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(FacultyRole $facultyRole)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FacultyRole $facultyRole)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FacultyRole $facultyRole)
    {
        //
    }

    public function assignRole(Request $request, $facultyId)
    {
        $request->validate([
            'Advisory_Type' => 'required|string',
            'Assigned_Group' => 'required|string',
        ]);

        $role = \App\Models\FacultyRole::firstOrCreate(
            ['Faculty_ID' => $facultyId],
            ['Advisory_Type' => 'None', 'Assigned_Group' => 'None']
        );

        $role->assignRole($request->input('Advisory_Type'), $request->input('Assigned_Group'));
        
        return response()->json(['message' => 'Role assigned successfully.', 'role' => $role]);
    }
}
