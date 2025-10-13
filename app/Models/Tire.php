<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tire extends Model
{
    protected $fillable = [
        'grupa',
        'podgrupa',
        'sifra',
        'tip',
        'dobavljac',
        'naziv_dobavljaca',
        'bar_kod',
        'naziv',
        'kataloski_brojevi',
        'kataloski_broj_2',
        'kataloski_broj_3',
        'brend',
        'erp',
        'pdv_tarifa',
        'jm',
        'tezina',
        'ukupno_narucivanje',
        'koristi_za_cjenovnik',
        'dimenzije',
        'komercijalni_naziv_dezena',
        'fabricki_kod_dezena',
        'napomena_2',
        'e_sound',
        'e_mark',
        'pr',
        'load_speedindex',
        'dot',
        'pmsf',
        'm_s',
        'qty_utovar',
        'sirina',
        'visina',
        'precnik',
        'rr',
        'wet',
        'noise',
        'xl',
        'rim',
        'eprel_code',
        'pritisak_duvanja',
        'dubina_gaznog_sloja',
        'sirina_gaznog_sloja',
        'is_active',
        'nabavna_cijena',
        'maloprodajna_cijena',
        'veleprodajna_cijena',
        'kategorija',
        'sezona',
        'kolicina_na_stanju',
    ];

    // Accessors for backward compatibility - map old column names to new ones
    public function getImeAttribute()
    {
        return $this->naziv;
    }

    public function getVpCijenaAttribute()
    {
        return $this->veleprodajna_cijena;
    }

    public function getMpCijenaAttribute()
    {
        return $this->maloprodajna_cijena;
    }

    // Mutators for backward compatibility - map old column names to new ones when setting
    public function setImeAttribute($value)
    {
        $this->attributes['naziv'] = $value;
    }

    public function setVpCijenaAttribute($value)
    {
        $this->attributes['veleprodajna_cijena'] = $value;
    }

    public function setMpCijenaAttribute($value)
    {
        $this->attributes['maloprodajna_cijena'] = $value;
    }
}
