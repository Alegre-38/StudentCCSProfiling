<?php

namespace Database\Factories;

use App\Models\FacultyRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FacultyRole>
 */
class FacultyRoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Advisory_Type' => $this->faker->randomElement(['Academic', 'Thesis', 'Organization']),
            'Assigned_Group' => $this->faker->word,
        ];
    }
}
