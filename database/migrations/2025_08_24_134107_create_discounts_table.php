<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->enum('scope', ['app_wide', 'per_user'])->default('per_user'); // tip popusta
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // veza sa korisnikom (null za app-wide)
            $table->string('tire_kategorija'); // kategorija gume (koristi 'kategorija' iz Tire modela)
            $table->decimal('percentage', 5, 2); // procenat popusta, npr. 10.50%
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
