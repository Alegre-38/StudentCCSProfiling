<?php

namespace App\Http\Controllers;

use App\Models\DisciplinaryRecord;
use Illuminate\Http\Request;

class DisciplinaryRecordController extends Controller
{
    public function store(Request $request, $studentId)
    {
        $request->validate([
            'Offense_Level' => 'required|string|max:50',
            'Date_Logged'   => 'required|date',
            'Status'        => 'nullable|string|max:50',
        ]);

        $record = DisciplinaryRecord::create([
            'Student_ID'    => $studentId,
            'Offense_Level' => $request->Offense_Level,
            'Date_Logged'   => $request->Date_Logged,
            'Status'        => $request->Status ?? 'Pending',
        ]);

        return response()->json(['message' => 'Disciplinary record added.', 'record' => $record], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['Status' => 'required|string']);
        $record = DisciplinaryRecord::findOrFail($id);
        $record->updateStatus($request->input('Status'));
        return response()->json(['message' => 'Status updated.', 'record' => $record]);
    }

    public function destroy($id)
    {
        DisciplinaryRecord::findOrFail($id)->delete();
        return response()->json(['message' => 'Record deleted.']);
    }
}
