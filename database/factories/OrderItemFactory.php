<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Tire;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        return [
            'order_id' => $this->faker->randomNumber(),
            'quantity' => $this->faker->randomFloat(),
            'unit_price' => $this->faker->randomFloat(),
            'total_price' => $this->faker->randomFloat(),
            'order_id' => $this->faker->randomNumber(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'tire_id' => Tire::factory(),
            'tire_id' => Tire::factory(),
        ];
    }
}
