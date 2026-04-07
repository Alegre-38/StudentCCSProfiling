<?php

namespace Database\Factories;

use App\Models\StudentOrganization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentOrganization>
 */
class StudentOrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Student_ID' => \App\Models\Student::factory(),
            'Organization_ID' => \App\Models\Organization::factory(),
            'Role' => $this->faker->randomElement(['Member', 'Officer', 'President', 'Vice President']),
            'Date_Joined' => $this->faker->date(),
        ];
    }
}
