<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    'accepted' => 'Polje :attribute mora biti prihvaćeno.',
    'accepted_if' => 'Polje :attribute mora biti prihvaćeno kada je :other :value.',
    'active_url' => 'Polje :attribute mora biti važeći URL.',
    'after' => 'Polje :attribute mora biti datum nakon :date.',
    'after_or_equal' => 'Polje :attribute mora biti datum nakon ili jednak :date.',
    'alpha' => 'Polje :attribute može sadržavati samo slova.',
    'alpha_dash' => 'Polje :attribute može sadržavati samo slova, brojeve, crtice i podvlake.',
    'alpha_num' => 'Polje :attribute može sadržavati samo slova i brojeve.',
    'array' => 'Polje :attribute mora biti niz.',
    'ascii' => 'Polje :attribute može sadržavati samo jednobajt alfanumeričke karaktere i simbole.',
    'before' => 'Polje :attribute mora biti datum prije :date.',
    'before_or_equal' => 'Polje :attribute mora biti datum prije ili jednak :date.',
    'between' => [
        'array' => 'Polje :attribute mora imati između :min i :max stavki.',
        'file' => 'Polje :attribute mora biti između :min i :max kilobajta.',
        'numeric' => 'Polje :attribute mora biti između :min i :max.',
        'string' => 'Polje :attribute mora imati između :min i :max karaktera.',
    ],
    'boolean' => 'Polje :attribute mora biti tačno ili netačno.',
    'can' => 'Polje :attribute sadrži neautorizovanu vrijednost.',
    'confirmed' => 'Potvrda polja :attribute se ne slaže.',
    'contains' => 'Polje :attribute ne sadrži obaveznu vrijednost.',
    'current_password' => 'Šifra je netačna.',
    'date' => 'Polje :attribute mora biti važeći datum.',
    'date_equals' => 'Polje :attribute mora biti datum jednak :date.',
    'date_format' => 'Polje :attribute mora odgovarati formatu :format.',
    'decimal' => 'Polje :attribute mora imati :decimal decimalnih mjesta.',
    'declined' => 'Polje :attribute mora biti odbačeno.',
    'declined_if' => 'Polje :attribute mora biti odbačeno kada je :other :value.',
    'different' => 'Polja :attribute i :other moraju biti različita.',
    'digits' => 'Polje :attribute mora imati :digits cifara.',
    'digits_between' => 'Polje :attribute mora imati između :min i :max cifara.',
    'dimensions' => 'Polje :attribute ima neispravne dimenzije slike.',
    'distinct' => 'Polje :attribute ima duplikatnu vrijednost.',
    'doesnt_end_with' => 'Polje :attribute ne smije završavati sa jednim od sljedećih: :values.',
    'doesnt_start_with' => 'Polje :attribute ne smije počinjati sa jednim od sljedećih: :values.',
    'email' => 'Polje :attribute mora biti važeća email adresa.',
    'ends_with' => 'Polje :attribute mora završavati sa jednim od sljedećih: :values.',
    'enum' => 'Izabrana vrijednost za :attribute je neispravna.',
    'exists' => 'Izabrana vrijednost za :attribute je neispravna.',
    'extensions' => 'Polje :attribute mora imati jednu od sljedećih ekstenzija: :values.',
    'file' => 'Polje :attribute mora biti datoteka.',
    'filled' => 'Polje :attribute mora imati vrijednost.',
    'gt' => [
        'array' => 'Polje :attribute mora imati više od :value stavki.',
        'file' => 'Polje :attribute mora biti veće od :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti veće od :value.',
        'string' => 'Polje :attribute mora imati više od :value karaktera.',
    ],
    'gte' => [
        'array' => 'Polje :attribute mora imati :value stavki ili više.',
        'file' => 'Polje :attribute mora biti veće ili jednako :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti veće ili jednako :value.',
        'string' => 'Polje :attribute mora imati :value karaktera ili više.',
    ],
    'hex_color' => 'Polje :attribute mora biti važeća heksadecimalna boja.',
    'image' => 'Polje :attribute mora biti slika.',
    'in' => 'Izabrana vrijednost za :attribute je neispravna.',
    'in_array' => 'Polje :attribute mora postojati u :other.',
    'integer' => 'Polje :attribute mora biti cijeli broj.',
    'ip' => 'Polje :attribute mora biti važeća IP adresa.',
    'ipv4' => 'Polje :attribute mora biti važeća IPv4 adresa.',
    'ipv6' => 'Polje :attribute mora biti važeća IPv6 adresa.',
    'json' => 'Polje :attribute mora biti važeći JSON string.',
    'list' => 'Polje :attribute mora biti lista.',
    'lowercase' => 'Polje :attribute mora biti napisano malim slovima.',
    'lt' => [
        'array' => 'Polje :attribute mora imati manje od :value stavki.',
        'file' => 'Polje :attribute mora biti manje od :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti manje od :value.',
        'string' => 'Polje :attribute mora imati manje od :value karaktera.',
    ],
    'lte' => [
        'array' => 'Polje :attribute ne smije imati više od :value stavki.',
        'file' => 'Polje :attribute mora biti manje ili jednako :value kilobajta.',
        'numeric' => 'Polje :attribute mora biti manje ili jednako :value.',
        'string' => 'Polje :attribute mora imati :value karaktera ili manje.',
    ],
    'mac_address' => 'Polje :attribute mora biti važeća MAC adresa.',
    'max' => [
        'array' => 'Polje :attribute ne smije imati više od :max stavki.',
        'file' => 'Polje :attribute ne smije biti veće od :max kilobajta.',
        'numeric' => 'Polje :attribute ne smije biti veće od :max.',
        'string' => 'Polje :attribute ne smije imati više od :max karaktera.',
    ],
    'max_digits' => 'Polje :attribute ne smije imati više od :max cifara.',
    'mimes' => 'Polje :attribute mora biti datoteka tipa: :values.',
    'mimetypes' => 'Polje :attribute mora biti datoteka tipa: :values.',
    'min' => [
        'array' => 'Polje :attribute mora imati najmanje :min stavki.',
        'file' => 'Polje :attribute mora biti najmanje :min kilobajta.',
        'numeric' => 'Polje :attribute mora biti najmanje :min.',
        'string' => 'Polje :attribute mora imati najmanje :min karaktera.',
    ],
    'min_digits' => 'Polje :attribute mora imati najmanje :min cifara.',
    'missing' => 'Polje :attribute mora nedostajati.',
    'missing_if' => 'Polje :attribute mora nedostajati kada je :other :value.',
    'missing_unless' => 'Polje :attribute mora nedostajati osim ako :other nije :value.',
    'missing_with' => 'Polje :attribute mora nedostajati kada je :values prisutno.',
    'missing_with_all' => 'Polje :attribute mora nedostajati kada su :values prisutni.',
    'multiple_of' => 'Polje :attribute mora biti umnožak od :value.',
    'not_in' => 'Izabrana vrijednost za :attribute je neispravna.',
    'not_regex' => 'Format polja :attribute je neispravan.',
    'numeric' => 'Polje :attribute mora biti broj.',
    'password' => [
        'letters' => 'Polje :attribute mora sadržavati najmanje jedno slovo.',
        'mixed' => 'Polje :attribute mora sadržavati najmanje jedno veliko i jedno malo slovo.',
        'numbers' => 'Polje :attribute mora sadržavati najmanje jedan broj.',
        'symbols' => 'Polje :attribute mora sadržavati najmanje jedan simbol.',
        'uncompromised' => 'Dato :attribute se pojavljuje u curenju podataka. Molimo izaberite drugo :attribute.',
    ],
    'present' => 'Polje :attribute mora biti prisutno.',
    'present_if' => 'Polje :attribute mora biti prisutno kada je :other :value.',
    'present_unless' => 'Polje :attribute mora biti prisutno osim ako :other nije :value.',
    'present_with' => 'Polje :attribute mora biti prisutno kada je :values prisutno.',
    'present_with_all' => 'Polje :attribute mora biti prisutno kada su :values prisutni.',
    'prohibited' => 'Polje :attribute je zabranjeno.',
    'prohibited_if' => 'Polje :attribute je zabranjeno kada je :other :value.',
    'prohibited_unless' => 'Polje :attribute je zabranjeno osim ako :other nije u :values.',
    'prohibits' => 'Polje :attribute zabranjuje da :other bude prisutno.',
    'regex' => 'Format polja :attribute je neispravan.',
    'required' => 'Polje :attribute je obavezno.',
    'required_array_keys' => 'Polje :attribute mora sadržavati unose za: :values.',
    'required_if' => 'Polje :attribute je obavezno kada je :other :value.',
    'required_if_accepted' => 'Polje :attribute je obavezno kada je :other prihvaćeno.',
    'required_if_declined' => 'Polje :attribute je obavezno kada je :other odbačeno.',
    'required_unless' => 'Polje :attribute je obavezno osim ako :other nije u :values.',
    'required_with' => 'Polje :attribute je obavezno kada je :values prisutno.',
    'required_with_all' => 'Polje :attribute je obavezno kada su :values prisutni.',
    'required_without' => 'Polje :attribute je obavezno kada :values nije prisutno.',
    'required_without_all' => 'Polje :attribute je obavezno kada nijedan od :values nije prisutan.',
    'same' => 'Polja :attribute i :other moraju se slagati.',
    'size' => [
        'array' => 'Polje :attribute mora sadržavati :size stavki.',
        'file' => 'Polje :attribute mora biti :size kilobajta.',
        'numeric' => 'Polje :attribute mora biti :size.',
        'string' => 'Polje :attribute mora imati :size karaktera.',
    ],
    'starts_with' => 'Polje :attribute mora počinjati sa jednim od sljedećih: :values.',
    'string' => 'Polje :attribute mora biti string.',
    'timezone' => 'Polje :attribute mora biti važeća vremenska zona.',
    'unique' => 'Polje :attribute je već zauzeto.',
    'uploaded' => 'Polje :attribute nije uspješno otpremljeno.',
    'uppercase' => 'Polje :attribute mora biti napisano velikim slovima.',
    'url' => 'Polje :attribute mora biti važeći URL.',
    'ulid' => 'Polje :attribute mora biti važeći ULID.',
    'uuid' => 'Polje :attribute mora biti važeći UUID.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "rule.attribute" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        'email' => 'email adresa',
        'password' => 'šifra',
        'name' => 'ime',
        'first_name' => 'ime',
        'last_name' => 'prezime',
        'phone' => 'telefon',
        'address' => 'adresa',
        'city' => 'grad',
        'postal_code' => 'poštanski broj',
        'company_name' => 'naziv firme',
        'notes' => 'napomene',
    ],
];
