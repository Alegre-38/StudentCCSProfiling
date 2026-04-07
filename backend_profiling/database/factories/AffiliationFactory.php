<?php

namespace Database\Factories;

use App\Models\Affiliation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Affiliation>
 */
class AffiliationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Org_Name' => $this->faker->company,
            'Role' => $this->faker->jobTitle,
        ];
    }
}
