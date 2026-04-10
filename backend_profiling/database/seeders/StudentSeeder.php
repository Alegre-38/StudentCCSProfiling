<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Reuse existing lookup data if available, otherwise create minimal sets
        $skillCategories = \App\Models\SkillCategory::all();
        if ($skillCategories->isEmpty()) {
            $skillCategories = \App\Models\SkillCategory::factory(5)->create();
        }

        $sportTypes = \App\Models\SportType::all();
        if ($sportTypes->isEmpty()) {
            $sportTypes = \App\Models\SportType::factory(8)->create();
        }

        $organizations = \App\Models\Organization::all();
        if ($organizations->isEmpty()) {
            $departments = \App\Models\Department::all();
            if ($departments->isEmpty()) {
                $departments = \App\Models\Department::factory(5)->create();
            }
            $professors = \App\Models\Professor::all();
            if ($professors->isEmpty()) {
                $professors = \App\Models\Professor::factory(5)->create([
                    'Department_ID' => $departments->random()->Department_ID
                ]);
            }
            for ($i = 0; $i < 5; $i++) {
                $organizations->push(\App\Models\Organization::factory()->create([
                    'Department_ID' => $departments->random()->Department_ID,
                    'Adviser_ID'    => $professors->random()->Professor_ID,
                ]));
            }
        }

        // Create 100 students with associated records
        $students = \App\Models\Student::factory(100)->create();

        foreach ($students as $student) {
            // Skills
            for ($i = 0; $i < rand(1, 3); $i++) {
                \App\Models\Skill::factory()->create([
                    'Student_ID'       => $student->Student_ID,
                    'Skill_Category_ID' => $skillCategories->random()->Category_ID,
                ]);
            }

            // Sports (optional)
            if (rand(1, 100) > 40) {
                for ($i = 0; $i < rand(1, 2); $i++) {
                    \App\Models\Sport::factory()->create([
                        'Student_ID'   => $student->Student_ID,
                        'Sport_Type_ID' => $sportTypes->random()->Sport_Type_ID,
                    ]);
                }
            }

            // Certificates
            for ($i = 0; $i < rand(0, 3); $i++) {
                \App\Models\Certificate::factory()->create([
                    'Student_ID' => $student->Student_ID,
                ]);
            }

            // Violations (optional)
            if (rand(1, 100) > 80) {
                \App\Models\Violation::factory()->create([
                    'Student_ID' => $student->Student_ID,
                ]);
            }

            // Organization memberships
            $joinedOrgs = $organizations->random(rand(1, min(3, $organizations->count())));
            foreach ($joinedOrgs as $org) {
                \App\Models\StudentOrganization::factory()->create([
                    'Student_ID'      => $student->Student_ID,
                    'Organization_ID' => $org->Organization_ID,
                ]);
            }
        }
    }
}
