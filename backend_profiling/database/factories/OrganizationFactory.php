<?php

namespace Database\Factories;

use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'Org_Name' => $this->faker->unique()->company() . ' Club',
            'Org_Type' => $this->faker->randomElement(['Academic', 'Non-Academic', 'Sports', 'Arts']),
            'Department_ID' => \App\Models\Department::factory(),
            'Adviser_ID' => \App\Models\Professor::factory(),
        ];
    }
}
