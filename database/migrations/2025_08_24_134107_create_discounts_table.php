<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // veza sa korisnikom
            $table->string('tire_type'); // tip gume (možeš koristiti 'tip' iz Tire modela)
            $table->decimal('percentage', 5, 2); // procenat popusta, npr. 10.50%
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
