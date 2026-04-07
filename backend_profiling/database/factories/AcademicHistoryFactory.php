<?php

namespace Database\Factories;

use App\Models\AcademicHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AcademicHistory>
 */
class AcademicHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Course_Code' => $this->faker->bothify('CS###'),
            'Final_Grade' => $this->faker->randomFloat(2, 1, 5), // Grades between 1.00 and 5.00
            'Term_Taken' => $this->faker->randomElement(['1st Semester', '2nd Semester', 'Summer']),
        ];
    }
}
