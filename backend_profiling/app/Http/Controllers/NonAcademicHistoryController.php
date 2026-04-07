<?php

namespace App\Http\Controllers;

use App\Models\NonAcademicHistory;
use Illuminate\Http\Request;

class NonAcademicHistoryController extends Controller
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
    public function show(NonAcademicHistory $nonAcademicHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NonAcademicHistory $nonAcademicHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $activity = \App\Models\NonAcademicHistory::findOrFail($id);
        $activity->delete();
        return response()->json(['message' => 'Activity deleted successfully.']);
    }

    public function logActivity(Request $request, $studentId)
    {
        $request->validate([
            'Activity_Type' => 'required|string',
            'Activity_Name' => 'required|string',
            'Date_Logged' => 'required|date',
            'Contribution' => 'required|string',
        ]);

        $activity = \App\Models\NonAcademicHistory::logActivity(
            $studentId,
            $request->input('Activity_Type'),
            $request->input('Activity_Name'),
            $request->input('Date_Logged'),
            $request->input('Contribution')
        );

        return response()->json(['message' => 'Activity logged successfully.', 'activity' => $activity], 201);
    }
}
