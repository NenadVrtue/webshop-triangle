<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tires', function (Blueprint $table) {
            $table->id();
            $table->string('grupa')->nullable();
            $table->string('podgrupa')->nullable();
            $table->string('sifra')->nullable();
            $table->string('tip')->nullable();
            $table->string('dobavljac')->nullable();
            $table->string('naziv_dobavljaca')->nullable();
            $table->string('bar_kod')->nullable();
            $table->string('naziv')->nullable();
            $table->text('kataloski_brojevi')->nullable();
            $table->text('kataloski_broj_2')->nullable();
            $table->text('kataloski_broj_3')->nullable();
            $table->string('brend')->nullable();
            $table->string('erp')->nullable();
            $table->string('pdv_tarifa')->nullable();
            $table->string('jm')->nullable();
            $table->string('tezina')->nullable();
            $table->string('ukupno_narucivanje')->nullable();
            $table->string('koristi_za_cjenovnik')->nullable();
            $table->string('dimenzije')->nullable();
            $table->string('komercijalni_naziv_dezena')->nullable();
            $table->string('fabricki_kod_dezena')->nullable();
            $table->text('napomena_2')->nullable();
            $table->string('e_sound')->nullable();
            $table->string('e_mark')->nullable();
            $table->string('pr')->nullable();
            $table->string('load_speedindex')->nullable();
            $table->string('dot')->nullable();
            $table->string('pmsf')->nullable();
            $table->string('m_s')->nullable();
            $table->string('qty_utovar')->nullable();
            $table->string('sirina')->nullable();
            $table->string('visina')->nullable();
            $table->string('precnik')->nullable();
            $table->string('rr')->nullable();
            $table->string('wet')->nullable();
            $table->string('noise')->nullable();
            $table->string('xl')->nullable();
            $table->string('rim')->nullable();
            $table->string('eprel_code')->nullable();
            $table->string('pritisak_duvanja')->nullable();
            $table->string('dubina_gaznog_sloja')->nullable();
            $table->string('sirina_gaznog_sloja')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tires');
    }
};
