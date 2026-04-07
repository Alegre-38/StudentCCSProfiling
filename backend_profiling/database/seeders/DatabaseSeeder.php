<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Core Lookup/Standalone Entities
        $departments = \App\Models\Department::factory(5)->create();
        $skillCategories = \App\Models\SkillCategory::factory(5)->create();
        $sportTypes = \App\Models\SportType::factory(8)->create();

        // 2. Create Professors (relies on Departments)
        $professors = collect();
        for ($i = 0; $i < 15; $i++) {
            $professors->push(\App\Models\Professor::factory()->create([
                'Department_ID' => $departments->random()->Department_ID
            ]));
        }

        // 3. Create Organizations (relies on Departments and Professors)
        $organizations = collect();
        for ($i = 0; $i < 10; $i++) {
            $organizations->push(\App\Models\Organization::factory()->create([
                'Department_ID' => $departments->random()->Department_ID,
                'Adviser_ID' => $professors->random()->Professor_ID
            ]));
        }

        // 4. Create Students and their associated records
        $students = \App\Models\Student::factory(40)->create();

        foreach ($students as $student) {
            // Add Skills
            for ($i = 0; $i < rand(1, 3); $i++) {
                \App\Models\Skill::factory()->create([
                    'Student_ID' => $student->Student_ID,
                    'Skill_Category_ID' => $skillCategories->random()->Category_ID
                ]);
            }

            // Add Sports (optional)
            if (rand(1, 100) > 40) {
                for ($i = 0; $i < rand(1, 2); $i++) {
                    \App\Models\Sport::factory()->create([
                        'Student_ID' => $student->Student_ID,
                        'Sport_Type_ID' => $sportTypes->random()->Sport_Type_ID
                    ]);
                }
            }

            // Add Certificates
            for ($i = 0; $i < rand(0, 3); $i++) {
                \App\Models\Certificate::factory()->create([
                    'Student_ID' => $student->Student_ID
                ]);
            }

            // Add Violations (optional)
            if (rand(1, 100) > 80) {
                \App\Models\Violation::factory()->create([
                    'Student_ID' => $student->Student_ID
                ]);
            }

            // Add Organization Memberships
            $joinedOrgs = $organizations->random(rand(1, 3));
            foreach ($joinedOrgs as $org) {
                \App\Models\StudentOrganization::factory()->create([
                    'Student_ID' => $student->Student_ID,
                    'Organization_ID' => $org->Organization_ID
                ]);
            }
        }
    }
}
