<?php

namespace Database\Factories;

use App\Models\StudentDemographic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StudentDemographic>
 */
class StudentDemographicFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Student_ID' => $this->faker->unique()->numerify('ID-#####'),
            'First_Name' => $this->faker->firstName,
            'Last_Name' => $this->faker->lastName,
            'Year_Level' => $this->faker->numberBetween(1, 4),
            'Degree_Program' => $this->faker->randomElement(['BSCS', 'BSIT', 'BSIS', 'BSEMC']),
            'Email_Address' => $this->faker->unique()->safeEmail,
            'Med_Clearance' => $this->faker->boolean(80), // 80% chance of true
        ];
    }
}
