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
                       'Alegre','Mala','Castillano','Lim','Tan','Ong','Sy','Co','Go','Chan','Reyes'];

        $programs  = ['BS Information Technology', 'BS Computer Science'];
        $sections  = ['A','B','C','D','E'];
        $statuses  = ['New','Returning','Transferee'];
        $religions = ['Catholic','Christian','Islam','Others'];
        $genders   = ['Male','Female'];
        $cities    = ['Manila','Cebu','Davao','Quezon City','Makati','Pasig','Taguig','Mandaluyong'];
        $provinces = ['Metro Manila','Cebu','Davao del Sur','Laguna','Cavite','Bulacan','Rizal'];

        $hashedPw = Hash::make('Student@123');

        $this->command->info("Seeding {$total} students...");

        $existingIds    = DB::table('students')->pluck('Student_ID')->flip()->toArray();
        $existingEmails = DB::table('students')->pluck('Email')->flip()->toArray();
        $existingUsers  = DB::table('users')->pluck('Username')->flip()->toArray();

        $users    = [];
        $students = [];
        $seeded   = 0;

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

            $seeded++;
        }

        // Single bulk insert — fast
        DB::table('users')->insert($users);
        DB::table('students')->insert($students);

        $this->command->info("Done! {$total} students seeded.");
    }
}
