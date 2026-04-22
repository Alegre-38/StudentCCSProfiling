<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
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

        $skillCategoryIds = $skillCategories->pluck('Category_ID')->toArray();
        $sportTypeIds     = $sportTypes->pluck('Sport_Type_ID')->toArray();
        $organizationIds  = $organizations->pluck('Organization_ID')->toArray();

        // Static data pools — avoids calling fake() 1000+ times
        $firstNames = ['Juan','Maria','Jose','Ana','Pedro','Rosa','Carlos','Elena','Miguel','Sofia',
                       'Luis','Carmen','Antonio','Isabel','Francisco','Laura','Manuel','Patricia',
                       'Rafael','Sandra','David','Monica','Jorge','Diana','Roberto','Claudia',
                       'Eduardo','Melissa','Fernando','Kristine','Mark','Jasmine','John','Lovely',
                       'James','Grace','Ryan','Faith','Kevin','Hope','Daniel','Joy','Michael','Angel'];
        $lastNames  = ['Santos','Reyes','Cruz','Garcia','Torres','Flores','Ramos','Mendoza','Lopez',
                       'Gonzales','Dela Cruz','Bautista','Aquino','Villanueva','Castillo','Morales',
                       'Pascual','Navarro','Soriano','Aguilar','Diaz','Fernandez','Hernandez','Perez',
                       'Rivera','Ramirez','Jimenez','Alvarez','Romero','Serrano','Nuguid','Dagul',
                       'Alegre','Mala','Castillano','Nugi','Lim','Tan','Ong','Sy','Co','Go','Chan'];
        $programs   = ['BS Information Technology', 'BS Computer Science'];
        $sections   = ['A','B','C','D','E'];
        $statuses   = ['New','Returning','Transferee'];
        $religions  = ['Catholic','Christian','Islam','Others'];
        $genders    = ['Male','Female'];
        $cities     = ['Manila','Cebu','Davao','Quezon City','Makati','Pasig','Taguig','Mandaluyong'];
        $provinces  = ['Metro Manila','Cebu','Davao del Sur','Laguna','Cavite','Bulacan','Rizal'];
        $skills     = ['Programming','Web Development','Database Management','Networking','UI/UX Design',
                       'Data Analysis','Machine Learning','Cybersecurity','Mobile Development','Cloud Computing'];
        $profLevels = ['Beginner','Intermediate','Advanced'];
        $positions  = ['Player','Captain','Reserve'];
        $certCats   = ['Academic','Professional','Extracurricular'];
        $offenses   = ['Minor Offense','Major Offense','Academic Dishonesty'];
        $orgRoles   = ['Member','Officer','President','Vice President'];

        $hashedPw = Hash::make('Student@123');
        $total    = 1000;
        $chunk    = 100;

        $this->command->info("Seeding {$total} students...");

        // Pre-check existing IDs/emails to avoid duplicates
        $existingIds    = DB::table('students')->pluck('Student_ID')->flip()->toArray();
        $existingEmails = DB::table('students')->pluck('Email')->flip()->toArray();
        $existingUsers  = DB::table('users')->pluck('Username')->flip()->toArray();

        $seeded = 0;

        while ($seeded < $total) {
            $users    = [];
            $students = [];
            $skillRows = [];
            $sportRows = [];
            $certRows  = [];
            $violRows  = [];
            $orgRows   = [];

            $batchCount = 0;

            while ($batchCount < $chunk && $seeded < $total) {
                $fn        = $firstNames[array_rand($firstNames)];
                $ln        = $lastNames[array_rand($lastNames)];
                $yr        = rand(1, 4);
                $prog      = $programs[array_rand($programs)];
                $progCode  = str_contains($prog, 'Technology') ? 'BSIT' : 'BSCS';
                $section   = $progCode . '-' . $yr . $sections[array_rand($sections)];
                $studentId = 'S' . strtoupper(substr(uniqid(), -5));
                $userId    = 'USR-' . strtoupper(substr(uniqid(), -6));

                // Skip if ID collision
                if (isset($existingIds[$studentId])) continue;
                $existingIds[$studentId] = 1;

                // Unique email
                $emailBase = strtolower($fn . '.' . $ln);
                $email     = $emailBase . rand(100, 9999) . '@gmail.com';
                $attempts  = 0;
                while (isset($existingEmails[$email]) && $attempts < 10) {
                    $email = $emailBase . rand(100, 9999) . '@gmail.com';
                    $attempts++;
                }
                if (isset($existingEmails[$email])) continue;
                $existingEmails[$email] = 1;

                // Unique username
                $uname = strtolower($fn . '.' . $ln);
                $sfx   = 1;
                while (isset($existingUsers[$uname])) {
                    $uname = strtolower($fn . '.' . $ln) . $sfx++;
                }
                $existingUsers[$uname] = 1;

                $users[] = [
                    'User_ID'        => $userId,
                    'Username'       => $uname,
                    'Password'       => $hashedPw,
                    'Role'           => 'Student',
                    'Account_Status' => 'Active',
                ];

                $students[] = [
                    'Student_ID'            => $studentId,
                    'User_ID'               => $userId,
                    'First_Name'            => $fn,
                    'Middle_Name'           => rand(0,1) ? $lastNames[array_rand($lastNames)] : null,
                    'Last_Name'             => $ln,
                    'Date_of_Birth'         => date('Y-m-d', strtotime('-' . rand(18,25) . ' years')),
                    'Age'                   => rand(17, 25),
                    'Gender'                => $genders[array_rand($genders)],
                    'Civil_Status'          => 'Single',
                    'Nationality'           => 'Filipino',
                    'Religion'              => $religions[array_rand($religions)],
                    'Email'                 => $email,
                    'Mobile_Number'         => '09' . rand(100000000, 999999999),
                    'Street'                => rand(1,999) . ' Sample St.',
                    'Barangay'              => 'Brgy. ' . $lastNames[array_rand($lastNames)],
                    'City'                  => $cities[array_rand($cities)],
                    'Province'              => $provinces[array_rand($provinces)],
                    'ZIP_Code'              => (string) rand(1000, 9999),
                    'Year_Level'            => $yr,
                    'Degree_Program'        => $prog,
                    'Section'               => $section,
                    'School_Year'           => '2024-2025',
                    'Medical_Clearance'     => (bool) rand(0, 1),
                    'Enrollment_Status'     => $statuses[array_rand($statuses)],
                    'Guardian_Name'         => $firstNames[array_rand($firstNames)] . ' ' . $lastNames[array_rand($lastNames)],
                    'Guardian_Relationship' => ['Father','Mother','Guardian'][rand(0,2)],
                    'Guardian_Contact'      => '09' . rand(100000000, 999999999),
                    'Guardian_Occupation'   => ['Teacher','Engineer','Nurse','Driver','Farmer'][rand(0,4)],
                    'Guardian_Address'      => rand(1,999) . ' ' . $cities[array_rand($cities)],
                ];

                // Skills
                for ($s = 0; $s < rand(1,3); $s++) {
                    $skillRows[] = [
                        'Student_ID'        => $studentId,
                        'Skill_Category_ID' => $skillCategoryIds[array_rand($skillCategoryIds)],
                        'Skill_Name'        => $skills[array_rand($skills)],
                        'Proficiency_Level' => $profLevels[array_rand($profLevels)],
                    ];
                }

                // Sports (60%)
                if (rand(1,10) > 4) {
                    $sportRows[] = [
                        'Student_ID'         => $studentId,
                        'Sport_Type_ID'      => $sportTypeIds[array_rand($sportTypeIds)],
                        'Position'           => $positions[array_rand($positions)],
                        'Skill_Level'        => $profLevels[array_rand($profLevels)],
                        'Eligibility_Status' => (bool) rand(0,1),
                    ];
                }

                // Certs (0-2)
                for ($s = 0; $s < rand(0,2); $s++) {
                    $certRows[] = [
                        'Student_ID'           => $studentId,
                        'Certificate_Name'     => $skills[array_rand($skills)] . ' Certificate',
                        'Issuing_Organization' => ['TESDA','DICT','Microsoft','Google','Cisco'][rand(0,4)],
                        'Date_Issued'          => date('Y-m-d', strtotime('-' . rand(1,3) . ' years')),
                        'Category'             => $certCats[array_rand($certCats)],
                    ];
                }

                // Violations (20%)
                if (rand(1,10) > 8) {
                    $violRows[] = [
                        'Student_ID'     => $studentId,
                        'Offense_Type'   => $offenses[array_rand($offenses)],
                        'Severity_Level' => rand(1,5),
                        'Status'         => ['Open','Closed','Under Review'][rand(0,2)],
                        'Date_Reported'  => date('Y-m-d', strtotime('-' . rand(1,365) . ' days')),
                    ];
                }

                // Orgs (1-2)
                $orgSample = $organizationIds;
                shuffle($orgSample);
                foreach (array_slice($orgSample, 0, rand(1, min(2, count($orgSample)))) as $orgId) {
                    $orgRows[] = [
                        'Student_ID'      => $studentId,
                        'Organization_ID' => $orgId,
                        'Role'            => $orgRoles[array_rand($orgRoles)],
                        'Date_Joined'     => date('Y-m-d', strtotime('-' . rand(1,3) . ' years')),
                    ];
                }

                $batchCount++;
                $seeded++;
            }

            DB::table('users')->insert($users);
            DB::table('students')->insert($students);
            if (!empty($skillRows)) DB::table('skills')->insert($skillRows);
            if (!empty($sportRows)) DB::table('sports')->insert($sportRows);
            if (!empty($certRows))  DB::table('certificates')->insert($certRows);
            if (!empty($violRows))  DB::table('violations')->insert($violRows);
            if (!empty($orgRows))   DB::table('student_organizations')->insert($orgRows);

            $this->command->info("  {$seeded}/{$total} done.");
        }

        $this->command->info('Seeding complete!');
    }
}
