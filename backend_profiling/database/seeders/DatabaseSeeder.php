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
        $this->call(StudentSeeder::class);
    }
}
