<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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

        $programs  = ['BS Information Technology', 'BS Computer Science'];
        $sections  = ['A', 'B', 'C', 'D', 'E'];
        $statuses  = ['New', 'Returning', 'Transferee'];
        $genders   = ['Male', 'Female'];
        $hashedPw  = Hash::make('Student@123');

        $this->command->info("Seeding {$total} students in chunks of {$chunkSize}...");

        $usedEmails    = [];
        $usedUsernames = [];

        for ($chunk = 0; $chunk < ($total / $chunkSize); $chunk++) {
            $users       = [];
            $students    = [];
            $skills      = [];
            $sports      = [];
            $certs       = [];
            $violations  = [];
            $studentOrgs = [];

            for ($i = 0; $i < $chunkSize; $i++) {
                $firstName = fake()->firstName();
                $lastName  = fake()->lastName();
                $yearLevel = rand(1, 4);
                $program   = $programs[array_rand($programs)];
                $progCode  = str_contains($program, 'Technology') ? 'BSIT' : 'BSCS';
                $section   = $progCode . '-' . $yearLevel . $sections[array_rand($sections)];

                // Unique student ID
                $studentId = 'S' . strtoupper(substr(uniqid(), -5));

                // Unique email
                $emailBase = strtolower($firstName . '.' . $lastName);
                $email     = $emailBase . rand(10, 9999) . '@gmail.com';
                while (in_array($email, $usedEmails)) {
                    $email = $emailBase . rand(10, 9999) . '@gmail.com';
                }
                $usedEmails[] = $email;

                // Unique username
                $unameBase = strtolower($firstName . '.' . $lastName);
                $username  = $unameBase;
                $suffix    = 1;
                while (in_array($username, $usedUsernames)) {
                    $username = $unameBase . $suffix++;
                }
                $usedUsernames[] = $username;

                $userId = 'USR-' . strtoupper(substr(uniqid(), -6));

                $users[] = [
                    'User_ID'        => $userId,
                    'Username'       => $username,
                    'Password'       => $hashedPw,
                    'Role'           => 'Student',
                    'Account_Status' => 'Active',
                ];

                $students[] = [
                    'Student_ID'        => $studentId,
                    'User_ID'           => $userId,
                    'First_Name'        => $firstName,
                    'Middle_Name'       => rand(0, 1) ? fake()->lastName() : null,
                    'Last_Name'         => $lastName,
                    'Date_of_Birth'     => fake()->date('Y-m-d', '-18 years'),
                    'Age'               => rand(17, 25),
                    'Gender'            => $genders[array_rand($genders)],
                    'Civil_Status'      => 'Single',
                    'Nationality'       => 'Filipino',
                    'Religion'          => fake()->randomElement(['Catholic', 'Christian', 'Islam', 'Others']),
                    'Email'             => $email,
                    'Mobile_Number'     => '09' . rand(100000000, 999999999),
                    'Street'            => fake()->streetAddress(),
                    'Barangay'          => fake()->word(),
                    'City'              => fake()->city(),
                    'Province'          => fake()->state(),
                    'ZIP_Code'          => fake()->numerify('#####'),
                    'Year_Level'        => $yearLevel,
                    'Degree_Program'    => $program,
                    'Section'           => $section,
                    'School_Year'       => '2024-2025',
                    'Medical_Clearance' => (bool) rand(0, 1),
                    'Enrollment_Status' => $statuses[array_rand($statuses)],
                    'Guardian_Name'     => fake()->name(),
                    'Guardian_Relationship' => fake()->randomElement(['Father', 'Mother', 'Guardian']),
                    'Guardian_Contact'  => '09' . rand(100000000, 999999999),
                    'Guardian_Occupation' => fake()->jobTitle(),
                    'Guardian_Address'  => fake()->address(),
                ];

                // Skills: 1-3
                for ($s = 0; $s < rand(1, 3); $s++) {
                    $skills[] = [
                        'Student_ID'        => $studentId,
                        'Skill_Category_ID' => $skillCategoryIds[array_rand($skillCategoryIds)],
                        'Skill_Name'        => fake()->word(),
                        'Proficiency_Level' => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
                    ];
                }

                // Sports: 60% chance
                if (rand(1, 100) > 40) {
                    for ($s = 0; $s < rand(1, 2); $s++) {
                        $sports[] = [
                            'Student_ID'         => $studentId,
                            'Sport_Type_ID'      => $sportTypeIds[array_rand($sportTypeIds)],
                            'Position'           => fake()->randomElement(['Player', 'Captain', 'Reserve']),
                            'Skill_Level'        => fake()->randomElement(['Beginner', 'Intermediate', 'Advanced']),
                            'Eligibility_Status' => (bool) rand(0, 1),
                        ];
                    }
                }

                // Certificates: 0-2
                for ($s = 0; $s < rand(0, 2); $s++) {
                    $certs[] = [
                        'Student_ID'           => $studentId,
                        'Certificate_Name'     => fake()->words(3, true) . ' Certificate',
                        'Issuing_Organization' => fake()->company(),
                        'Date_Issued'          => fake()->date(),
                        'Category'             => fake()->randomElement(['Academic', 'Professional', 'Extracurricular']),
                    ];
                }

                // Violations: 20% chance
                if (rand(1, 100) > 80) {
                    $violations[] = [
                        'Student_ID'     => $studentId,
                        'Offense_Type'   => fake()->randomElement(['Minor Offense', 'Major Offense', 'Academic Dishonesty']),
                        'Severity_Level' => rand(1, 5),
                        'Status'         => fake()->randomElement(['Open', 'Closed', 'Under Review']),
                        'Date_Reported'  => fake()->date(),
                    ];
                }

                // Org memberships: 1-2
                $orgSample = $organizationIds;
                shuffle($orgSample);
                foreach (array_slice($orgSample, 0, rand(1, min(2, count($orgSample)))) as $orgId) {
                    $studentOrgs[] = [
                        'Student_ID'      => $studentId,
                        'Organization_ID' => $orgId,
                        'Role'            => fake()->randomElement(['Member', 'Officer', 'President', 'Vice President']),
                        'Date_Joined'     => fake()->date(),
                    ];
                }
            }

            // Bulk insert
            DB::table('users')->insert($users);
            DB::table('students')->insert($students);
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
