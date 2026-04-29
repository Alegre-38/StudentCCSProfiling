<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        $total = 100;

        $firstNames = ['Juan','Maria','Jose','Ana','Pedro','Rosa','Carlos','Elena','Miguel','Sofia',
                       'Luis','Carmen','Antonio','Isabel','Francisco','Laura','Manuel','Patricia',
                       'Rafael','Sandra','David','Monica','Jorge','Diana','Roberto','Claudia',
                       'Eduardo','Melissa','Fernando','Kristine','Mark','Jasmine','John','Lovely',
                       'James','Grace','Ryan','Faith','Kevin','Hope','Daniel','Joy','Michael','Angel',
                       'Richard','Maricel','Bernard','Liza','Ronald','Sheila','Dennis','Rowena'];

        $lastNames  = ['Santos','Reyes','Cruz','Garcia','Torres','Flores','Ramos','Mendoza','Lopez',
                       'Gonzales','Dela Cruz','Bautista','Aquino','Villanueva','Castillo','Morales',
                       'Pascual','Navarro','Soriano','Aguilar','Diaz','Fernandez','Hernandez','Perez',
                       'Rivera','Ramirez','Jimenez','Alvarez','Romero','Serrano','Lim','Tan','Ong'];

        $departments    = ['Computer Science', 'Information Technology'];
        $positions      = ['Professor', 'Associate Professor', 'Assistant Professor', 'Instructor',
                           'Lecturer', 'Department Head', 'Dean'];
        $employmentTypes= ['Full-Time', 'Part-Time', 'Contractual'];
        $specializations= ['Web Development', 'Data Science', 'Networking', 'Cybersecurity',
                           'Machine Learning', 'Database Systems', 'Software Engineering',
                           'Mobile Development', 'Cloud Computing', 'UI/UX Design',
                           'Algorithms', 'Computer Architecture', 'Operating Systems'];
        $offices        = ['Room 101', 'Room 202', 'Room 305', 'Faculty Office A', 'Faculty Office B',
                           'Lab 1', 'Lab 2', 'Admin Building'];

        $this->command->info("Seeding {$total} faculty members...");

        $existingIds    = DB::table('faculty_core')->pluck('Faculty_ID')->flip()->toArray();
        $existingEmails = DB::table('faculty_core')->pluck('Email')->flip()->toArray();

        $rows   = [];
        $seeded = 0;

        while ($seeded < $total) {
            $fn  = $firstNames[array_rand($firstNames)];
            $ln  = $lastNames[array_rand($lastNames)];
            $id  = 'FAC-' . strtoupper(substr(uniqid(), -6));

            if (isset($existingIds[$id])) continue;
            $existingIds[$id] = 1;

            $emailBase = strtolower($fn . '.' . $ln);
            $email     = $emailBase . rand(10, 999) . '@ccs.edu.ph';
            $attempts  = 0;
            while (isset($existingEmails[$email]) && $attempts < 10) {
                $email = $emailBase . rand(10, 999) . '@ccs.edu.ph';
                $attempts++;
            }
            if (isset($existingEmails[$email])) continue;
            $existingEmails[$email] = 1;

            $rows[] = [
                'Faculty_ID'      => $id,
                'First_Name'      => $fn,
                'Middle_Name'     => rand(0,1) ? $lastNames[array_rand($lastNames)] : null,
                'Last_Name'       => $ln,
                'Position'        => $positions[array_rand($positions)],
                'Department'      => $departments[array_rand($departments)],
                'Employment_Type' => $employmentTypes[array_rand($employmentTypes)],
                'Hire_Date'       => date('Y-m-d', strtotime('-' . rand(1, 20) . ' years')),
                'Email'           => $email,
                'Contact_Number'  => '09' . rand(100000000, 999999999),
                'Office_Location' => $offices[array_rand($offices)],
                'Specialization'  => $specializations[array_rand($specializations)],
            ];

            $seeded++;
        }

        DB::table('faculty_core')->insert($rows);
        $this->command->info("Done! {$total} faculty members seeded.");
    }
}
