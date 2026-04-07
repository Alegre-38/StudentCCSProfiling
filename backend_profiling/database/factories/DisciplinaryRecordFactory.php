<?php

namespace Database\Factories;

use App\Models\DisciplinaryRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DisciplinaryRecord>
 */
class DisciplinaryRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Offense_Level' => $this->faker->randomElement(['Minor', 'Major', 'Severe']),
            'Status' => $this->faker->randomElement(['Pending', 'Resolved', 'Under Investigation']),
            'Date_Logged' => $this->faker->date(),
        ];
    }
}
