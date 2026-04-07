<?php

namespace Database\Factories;

use App\Models\Professor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Professor>
 */
class ProfessorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Professor_ID' => 'P' . $this->faker->unique()->numerify('####'),
            'User_ID' => \App\Models\User::factory(),
            'First_Name' => $this->faker->firstName(),
            'Last_Name' => $this->faker->lastName(),
            'Department_ID' => \App\Models\Department::factory(),
            'Employment_Type' => $this->faker->randomElement(['Full-Time', 'Part-Time', 'Visiting']),
        ];
    }
}
