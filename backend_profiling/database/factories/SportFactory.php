<?php

namespace Database\Factories;

use App\Models\Sport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sport>
 */
class SportFactory extends Factory
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
            'Sport_Type_ID' => \App\Models\SportType::factory(),
            'Position' => $this->faker->word(),
            'Skill_Level' => $this->faker->randomElement(['Beginner', 'Intermediate', 'Advanced']),
            'Eligibility_Status' => $this->faker->boolean(90),
        ];
    }
}
