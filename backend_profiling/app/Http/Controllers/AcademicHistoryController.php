<?php

namespace App\Http\Controllers;

use App\Models\AcademicHistory;
use Illuminate\Http\Request;

class AcademicHistoryController extends Controller
{
    public function store(Request $request, $studentId)
    {
        $request->validate([
            'Course_Code' => 'required|string|max:20',
            'Final_Grade' => 'required|numeric|min:1|max:5',
            'Term_Taken'  => 'required|string|max:50',
        ]);

        $record = AcademicHistory::create([
            'Student_ID'  => $studentId,
            'Course_Code' => $request->Course_Code,
            'Final_Grade' => $request->Final_Grade,
            'Term_Taken'  => $request->Term_Taken,
        ]);

        return response()->json(['message' => 'Academic record added.', 'record' => $record], 201);
    }

    public function destroy($id)
    {
        AcademicHistory::findOrFail($id)->delete();
        return response()->json(['message' => 'Record deleted.']);
    }
}
