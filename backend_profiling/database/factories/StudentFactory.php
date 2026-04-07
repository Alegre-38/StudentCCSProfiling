<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Student_ID' => 'S' . $this->faker->unique()->numerify('#####'),
            'User_ID' => \App\Models\User::factory(),
            'First_Name' => $this->faker->firstName(),
            'Last_Name' => $this->faker->lastName(),
            'Year_Level' => $this->faker->numberBetween(1, 5),
            'Degree_Program' => $this->faker->randomElement(['BS CS', 'BS IT', 'BS Cpe', 'BS IS']),
            'Email' => $this->faker->unique()->safeEmail(),
            'Medical_Clearance' => $this->faker->boolean(80),
            'Enrollment_Status' => $this->faker->randomElement(['Active', 'Graduated', 'Inactive']),
        ];
    }
}
