<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tire extends Model
{
    protected $fillable = [
        'sifra',
        'ime',
        'vp_cijena',
        'mp_cijena',
        'dimenzije',
        'sirina',
        'visina',
        'kolicina_na_stanju',
        'kategorija',
        'sezona',
        'eprel_code',
    ];
}
