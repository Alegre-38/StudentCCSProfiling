<?php

namespace App\Http\Controllers;

use App\Models\SkillRepository;
use Illuminate\Http\Request;

class SkillRepositoryController extends Controller
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
    public function show(SkillRepository $skillRepository)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SkillRepository $skillRepository)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $skill = \App\Models\SkillRepository::findOrFail($id);
        $skill->delete();
        return response()->json(['message' => 'Skill deleted successfully.']);
    }

    public function storeSkill(Request $request, $studentId)
    {
        $request->validate([
            'Skill_Category' => 'required|string',
            'Specific_Skill' => 'required|string',
            'Proficiency' => 'required|string',
        ]);

        $skill = \App\Models\SkillRepository::addSkill(
            $studentId,
            $request->input('Skill_Category'),
            $request->input('Specific_Skill'),
            $request->input('Proficiency')
        );

        return response()->json(['message' => 'Skill added successfully.', 'skill' => $skill], 201);
    }

    public function updateProficiency(Request $request, $id)
    {
        $request->validate(['Proficiency' => 'required|string']);
        $skill = \App\Models\SkillRepository::findOrFail($id);
        $skill->updateProficiency($request->input('Proficiency'));
        return response()->json(['message' => 'Proficiency updated successfully.', 'skill' => $skill]);
    }
}
