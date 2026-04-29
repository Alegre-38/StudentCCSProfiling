<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $total = 500;

        $firstNames = ['Juan','Maria','Jose','Ana','Pedro','Rosa','Carlos','Elena','Miguel','Sofia',
                       'Luis','Carmen','Antonio','Isabel','Francisco','Laura','Manuel','Patricia',
                       'Rafael','Sandra','David','Monica','Jorge','Diana','Roberto','Claudia',
                       'Eduardo','Melissa','Fernando','Kristine','Mark','Jasmine','John','Lovely',
                       'James','Grace','Ryan','Faith','Kevin','Hope','Daniel','Joy','Michael','Angel',
                       'Richard','Maricel','Bernard','Liza','Ronald','Sheila','Dennis','Rowena',
                       'Allan','Marites','Rodel','Gina','Arnel','Nena','Danilo','Cynthia'];

        $lastNames  = ['Santos','Reyes','Cruz','Garcia','Torres','Flores','Ramos','Mendoza','Lopez',
                       'Gonzales','Dela Cruz','Bautista','Aquino','Villanueva','Castillo','Morales',
                       'Pascual','Navarro','Soriano','Aguilar','Diaz','Fernandez','Hernandez','Perez',
                       'Rivera','Ramirez','Jimenez','Alvarez','Romero','Serrano','Nuguid','Dagul',
                       'Alegre','Mala','Castillano','Lim','Tan','Ong','Sy','Co','Go','Chan'];

        $programs      = ['BS Information Technology', 'BS Computer Science'];
        $sections      = ['A','B','C','D','E'];
        $statuses      = ['New','Returning','Transferee'];
        $religions     = ['Catholic','Christian','Islam','Others'];
        $genders       = ['Male','Female'];
        $cities        = ['Manila','Cebu','Davao','Quezon City','Makati','Pasig','Taguig','Mandaluyong'];
        $provinces     = ['Metro Manila','Cebu','Davao del Sur','Laguna','Cavite','Bulacan','Rizal'];

        // Skills data
        $skillCategories = ['Technical','Sports','Arts & Creative','Leadership','Communication','Academic'];
        $specificSkills  = [
            'Technical'      => ['Python','Java','Web Development','Database Management','Networking','Cybersecurity','Mobile Development','UI/UX Design'],
            'Sports'         => ['Basketball','Volleyball','Swimming','Badminton','Football','Table Tennis'],
            'Arts & Creative'=> ['Drawing','Photography','Video Editing','Music','Dancing','Painting'],
            'Leadership'     => ['Project Management','Public Speaking','Team Building','Event Planning'],
            'Communication'  => ['English Proficiency','Technical Writing','Presentation Skills'],
            'Academic'       => ['Research','Data Analysis','Machine Learning','Statistics'],
        ];
        $proficiencies = ['Beginner','Intermediate','Advanced'];

        // Non-academic activities
        $activityTypes = ['Sports','Cultural','Community Service','Leadership','Academic Competition'];
        $activityNames = [
            'Sports'               => ['Basketball Tournament','Volleyball League','Swimming Meet','Badminton Open','Football Cup'],
            'Cultural'             => ['Dance Competition','Theater Play','Art Exhibit','Music Festival','Cultural Night'],
            'Community Service'    => ['Tree Planting','Coastal Cleanup','Blood Donation','Feeding Program','Outreach Program'],
            'Leadership'           => ['Student Council','Youth Leadership Summit','Seminar Facilitation','Club Officer'],
            'Academic Competition' => ['Programming Contest','Math Olympiad','Science Quiz Bee','Hackathon','Debate Competition'],
        ];
        $contributions = ['1st Place','2nd Place','3rd Place','Participant','Best Presenter','Most Outstanding','Finalist'];

        // Disciplinary
        $offenseLevels = ['Minor','Major'];
        $discStatuses  = ['Pending','Resolved','Under Investigation'];

        $hashedPw = Hash::make('Student@123');

        $this->command->info("Seeding {$total} students with skills, activities & records...");

        $existingIds    = DB::table('students')->pluck('Student_ID')->flip()->toArray();
        $existingEmails = DB::table('students')->pluck('Email')->flip()->toArray();
        $existingUsers  = DB::table('users')->pluck('Username')->flip()->toArray();

        $users       = [];
        $students    = [];
        $skills      = [];
        $activities  = [];
        $disciplinary= [];
        $seeded      = 0;

        while ($seeded < $total) {
            $fn       = $firstNames[array_rand($firstNames)];
            $ln       = $lastNames[array_rand($lastNames)];
            $yr       = rand(1, 4);
            $prog     = $programs[array_rand($programs)];
            $progCode = str_contains($prog, 'Technology') ? 'BSIT' : 'BSCS';
            $section  = $progCode . '-' . $yr . $sections[array_rand($sections)];
            $sid      = 'S' . strtoupper(substr(uniqid(), -5));
            $uid      = 'USR-' . strtoupper(substr(uniqid(), -6));

            if (isset($existingIds[$sid])) continue;
            $existingIds[$sid] = 1;

            $emailBase = strtolower($fn . '.' . $ln);
            $email     = $emailBase . rand(100, 9999) . '@gmail.com';
            $attempts  = 0;
            while (isset($existingEmails[$email]) && $attempts < 10) {
                $email = $emailBase . rand(100, 9999) . '@gmail.com';
                $attempts++;
            }
            if (isset($existingEmails[$email])) continue;
            $existingEmails[$email] = 1;

            $uname = strtolower($fn . '.' . $ln);
            $sfx   = 1;
            while (isset($existingUsers[$uname])) {
                $uname = strtolower($fn . '.' . $ln) . $sfx++;
            }
            $existingUsers[$uname] = 1;

            $users[] = [
                'User_ID'        => $uid,
                'Username'       => $uname,
                'Password'       => $hashedPw,
                'Role'           => 'Student',
                'Account_Status' => 'Active',
            ];

            $students[] = [
                'Student_ID'            => $sid,
                'User_ID'               => $uid,
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

            // Skills: 1-3 per student
            $numSkills = rand(1, 3);
            $usedCats  = [];
            for ($s = 0; $s < $numSkills; $s++) {
                $cat = $skillCategories[array_rand($skillCategories)];
                if (in_array($cat, $usedCats)) continue;
                $usedCats[] = $cat;
                $skillList  = $specificSkills[$cat];
                $skills[] = [
                    'Student_ID'     => $sid,
                    'Skill_Category' => $cat,
                    'Specific_Skill' => $skillList[array_rand($skillList)],
                    'Proficiency'    => $proficiencies[array_rand($proficiencies)],
                ];
            }

            // Non-academic: 1-2 activities per student
            $numActs = rand(1, 2);
            for ($a = 0; $a < $numActs; $a++) {
                $type     = $activityTypes[array_rand($activityTypes)];
                $nameList = $activityNames[$type];
                $activities[] = [
                    'Student_ID'    => $sid,
                    'Activity_Type' => $type,
                    'Activity_Name' => $nameList[array_rand($nameList)],
                    'Date_Logged'   => date('Y-m-d', strtotime('-' . rand(1, 730) . ' days')),
                    'Contribution'  => $contributions[array_rand($contributions)],
                ];
            }

            // Disciplinary: 25% chance of 1 record
            if (rand(1, 4) === 1) {
                $disciplinary[] = [
                    'Student_ID'   => $sid,
                    'Offense_Level'=> $offenseLevels[array_rand($offenseLevels)],
                    'Status'       => $discStatuses[array_rand($discStatuses)],
                    'Date_Logged'  => date('Y-m-d', strtotime('-' . rand(1, 365) . ' days')),
                ];
            }

            $seeded++;
        }

        // Bulk inserts
        DB::table('users')->insert($users);
        DB::table('students')->insert($students);
        if (!empty($skills))       DB::table('skill_repository')->insert($skills);
        if (!empty($activities))   DB::table('non_academic_histories')->insert($activities);
        if (!empty($disciplinary)) DB::table('disciplinary_records')->insert($disciplinary);

        $this->command->info("Done! {$total} students seeded with skills, activities & disciplinary records.");
    }
}
