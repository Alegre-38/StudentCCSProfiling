<?php

namespace Database\Factories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Certificate>
 */
class CertificateFactory extends Factory
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
            'Certificate_Name' => $this->faker->words(3, true) . ' Certificate',
            'Issuing_Organization' => $this->faker->company(),
            'Date_Issued' => $this->faker->date(),
            'Category' => $this->faker->randomElement(['Academic', 'Professional', 'Extracurricular']),
        ];
    }
}
