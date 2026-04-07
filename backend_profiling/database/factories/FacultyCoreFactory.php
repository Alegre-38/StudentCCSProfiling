<?php

namespace Database\Factories;

use App\Models\FacultyCore;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FacultyCore>
 */
class FacultyCoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Faculty_ID' => $this->faker->unique()->numerify('FAC-#####'),
            'First_Name' => $this->faker->firstName,
            'Last_Name' => $this->faker->lastName,
            'Department' => $this->faker->randomElement(['Computer Science', 'Information Technology', 'Information Systems']),
            'Employment_Type' => $this->faker->randomElement(['Full-Time', 'Part-Time']),
        ];
    }
}
