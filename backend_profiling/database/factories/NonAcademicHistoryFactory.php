<?php

namespace Database\Factories;

use App\Models\NonAcademicHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NonAcademicHistory>
 */
class NonAcademicHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Activity_Type' => $this->faker->word,
            'Activity_Name' => $this->faker->sentence(3),
            'Date_Logged' => $this->faker->date(),
            'Contribution' => $this->faker->sentence(6),
        ];
    }
}
