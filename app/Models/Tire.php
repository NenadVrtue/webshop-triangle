<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tire extends Model
{
    protected $fillable = [
        'grupa', 'podgrupa', 'sifra', 'tip', 'dobavjac', 'naziv_dobavljaca',
        'bar_kod', 'naziv', 'katalosski_brojevi', 'katalosski_broj_2', 'katalosski_broj_3',
        'brend', 'erp', 'pdv_tarifa', 'jm', 'tezzina', 'ukupno_narucccivanje',
        'koristi_za_cjenovnik', 'dimenzije', 'komercijalni_naziv_dezena', 'fabricccki_kod_dezena',
        'napomena_2', 'e_sound', 'e_mark', 'pr', 'load_speedindex', 'dot', 'pmsf', 'm_s',
        'qty_utovar', 'ssirina', 'visina', 'precccnik', 'rr', 'wet', 'noise', 'xl', 'rim',
        'eprel_code', 'pritisak_duvanja', 'dubina_gaznog_sloja', 'ssirina_gaznog_sloja', 'is_active'
    ];

}
