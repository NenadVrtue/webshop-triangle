<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('promo_code_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promo_code_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('used_at')->nullable(); // kada je kod iskorišten
            $table->timestamps();

            $table->unique(['promo_code_id', 'user_id']); // jedan korisnik ne može isti promo kod više puta
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_code_user');
    }
};
