<?php

namespace Database\Factories;

use App\Models\SkillRepository;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SkillRepository>
 */
class SkillRepositoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Skill_Category' => $this->faker->randomElement(['Programming', 'Design', 'Soft Skills', 'Hardware']),
            'Specific_Skill' => $this->faker->word,
            'Proficiency' => $this->faker->randomElement(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
        ];
    }
}
