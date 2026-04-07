<?php

namespace Database\Factories;

use App\Models\Violation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Violation>
 */
class ViolationFactory extends Factory
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
            'Offense_Type' => $this->faker->randomElement(['Minor Offense', 'Major Offense', 'Academic Dishonesty']),
            'Severity_Level' => $this->faker->numberBetween(1, 5),
            'Status' => $this->faker->randomElement(['Open', 'Closed', 'Under Review']),
            'Date_Reported' => $this->faker->date(),
        ];
    }
}
