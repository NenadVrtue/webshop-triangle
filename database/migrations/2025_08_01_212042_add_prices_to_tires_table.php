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
            $table->decimal('mp_cijena', 10, 2)->nullable()->after('nabavna_cijena');
            $table->decimal('vp_cijena', 10, 2)->nullable()->after('mp_cijena');
            $table->integer('kolicina_na_stanju')->default(0)->after('vp_cijena');
            $table->string('kategorija')->nullable()->after('kolicina_na_stanju');
            $table->string('sezona')->nullable()->after('kategorija');
        });
    }

    public function down(): void
    {
        Schema::table('tires', function (Blueprint $table) {
            $table->dropColumn(['nabavna_cijena', 'mp_cijena', 'vp_cijena', 'kolicina_na_stanju', 'kategorija', 'sezona']);
        });
    }
};
