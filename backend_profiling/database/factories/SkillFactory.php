<?php

namespace Database\Factories;

use App\Models\Skill;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Skill>
 */
class SkillFactory extends Factory
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
            'Skill_Category_ID' => \App\Models\SkillCategory::factory(),
            'Skill_Name' => $this->faker->word(),
            'Proficiency_Level' => $this->faker->randomElement(['Beginner', 'Intermediate', 'Advanced']),
        ];
    }
}
