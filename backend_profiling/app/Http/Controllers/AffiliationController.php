<?php

namespace App\Http\Controllers;

use App\Models\Affiliation;
use Illuminate\Http\Request;

class AffiliationController extends Controller
{
    public function store(Request $request, $studentId)
    {
        $request->validate([
            'Org_Name' => 'required|string|max:150',
            'Role'     => 'nullable|string|max:100',
        ]);

        $affiliation = Affiliation::create([
            'Student_ID' => $studentId,
            'Org_Name'   => $request->Org_Name,
            'Role'       => $request->Role ?? 'Member',
        ]);

        return response()->json(['message' => 'Affiliation added.', 'affiliation' => $affiliation], 201);
    }

    public function promoteRole(Request $request, $id)
    {
        $request->validate(['Role' => 'required|string']);
        $affiliation = Affiliation::findOrFail($id);
        $affiliation->promoteRole($request->input('Role'));
        return response()->json(['message' => 'Role updated.', 'affiliation' => $affiliation]);
    }

    public function destroy($id)
    {
        Affiliation::findOrFail($id)->delete();
        return response()->json(['message' => 'Affiliation removed.']);
    }
}
