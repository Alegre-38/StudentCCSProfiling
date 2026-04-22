<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        // Reuse or create lookup data
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
                    'Department_ID' => $departments->random()->Department_ID,
                ]);
            }
            for ($i = 0; $i < 5; $i++) {
                $organizations->push(\App\Models\Organization::factory()->create([
                    'Department_ID' => $departments->random()->Department_ID,
                    'Adviser_ID'    => $professors->random()->Professor_ID,
                ]));
            }
        }

        $total     = 1000;
        $chunkSize = 100;

        $skillCategoryIds = $skillCategories->pluck('Category_ID')->toArray();
        $sportTypeIds     = $sportTypes->pluck('Sport_Type_ID')->toArray();
        $organizationIds  = $organizations->pluck('Organization_ID')->toArray();

        $this->command->info("Seeding {$total} students in chunks of {$chunkSize}...");

        for ($chunk = 0; $chunk < ($total / $chunkSize); $chunk++) {
            $students = \App\Models\Student::factory($chunkSize)->create();

            $skills      = [];
            $sports      = [];
            $certs       = [];
            $violations  = [];
            $studentOrgs = [];

            foreach ($students as $student) {
                $sid = $student->Student_ID;

                // Skills: 1-3 per student
                for ($i = 0; $i < rand(1, 3); $i++) {
                    $skills[] = [
                        'Student_ID'        => $sid,
                        'Skill_Category_ID' => $skillCategoryIds[array_rand($skillCategoryIds)],
                        'Skill_Name'        => fake()->word(),
                        'Proficiency_Level' => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
                    ];
                }

                // Sports: 60% chance, 1-2
                if (rand(1, 100) > 40) {
                    for ($i = 0; $i < rand(1, 2); $i++) {
                        $sports[] = [
                            'Student_ID'         => $sid,
                            'Sport_Type_ID'      => $sportTypeIds[array_rand($sportTypeIds)],
                            'Position'           => fake()->randomElement(['Player', 'Captain', 'Reserve']),
                            'Skill_Level'        => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
                            'Eligibility_Status' => (bool) rand(0, 1),
                        ];
                    }
                }

                // Certificates: 0-3
                for ($i = 0; $i < rand(0, 3); $i++) {
                    $certs[] = [
                        'Student_ID'           => $sid,
                        'Certificate_Name'     => fake()->words(3, true) . ' Certificate',
                        'Issuing_Organization' => fake()->company(),
                        'Date_Issued'          => fake()->date(),
                        'Category'             => fake()->randomElement(['Academic', 'Professional', 'Extracurricular']),
                    ];
                }

                // Violations: 20% chance
                if (rand(1, 100) > 80) {
                    $violations[] = [
                        'Student_ID'     => $sid,
                        'Offense_Type'   => fake()->randomElement(['Minor Offense', 'Major Offense', 'Academic Dishonesty']),
                        'Severity_Level' => rand(1, 5),
                        'Status'         => fake()->randomElement(['Open', 'Closed', 'Under Review']),
                        'Date_Reported'  => fake()->date(),
                    ];
                }

                // Org memberships: 1-2 orgs
                $orgSample = $organizationIds;
                shuffle($orgSample);
                $orgSample = array_slice($orgSample, 0, rand(1, min(2, count($orgSample))));
                foreach ($orgSample as $orgId) {
                    $studentOrgs[] = [
                        'Student_ID'      => $sid,
                        'Organization_ID' => $orgId,
                        'Role'            => fake()->randomElement(['Member', 'Officer', 'President', 'Vice President']),
                        'Date_Joined'     => fake()->date(),
                    ];
                }
            }

            // Bulk insert all related records for this chunk
            if (!empty($skills))      DB::table('skills')->insert($skills);
            if (!empty($sports))      DB::table('sports')->insert($sports);
            if (!empty($certs))       DB::table('certificates')->insert($certs);
            if (!empty($violations))  DB::table('violations')->insert($violations);
            if (!empty($studentOrgs)) DB::table('student_organizations')->insert($studentOrgs);

            $done = ($chunk + 1) * $chunkSize;
            $this->command->info("  {$done}/{$total} students seeded.");
        }

        $this->command->info('Done! 1000 students seeded successfully.');
    }
}
