<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tires', function (Blueprint $table) {
            $table->decimal('nabavna_cijena', 10, 2)->nullable()->after('is_active');
            $table->decimal('maloprodajna_cijena', 10, 2)->nullable()->after('nabavna_cijena');
            $table->decimal('veleprodajna_cijena', 10, 2)->nullable()->after('maloprodajna_cijena');
        });
    }

    public function down(): void
    {
        Schema::table('tires', function (Blueprint $table) {
            $table->dropColumn(['nabavna_cijena', 'maloprodajna_cijena', 'veleprodajna_cijena']);
        });
    }

};
