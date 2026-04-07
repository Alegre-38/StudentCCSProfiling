<?php

namespace Database\Factories;

use App\Models\SportType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SportType>
 */
class SportTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Sport_Name' => $this->faker->unique()->word() . ' Sport',
        ];
    }
}
