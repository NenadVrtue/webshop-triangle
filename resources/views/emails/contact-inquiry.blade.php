@component('mail::message')
# Novi upit o gumi

Pozdrav,

Primili ste novi upit o gumi od kupca **{{ $inquiryData['customer_name'] }}**.

## Detalji upita

**Datum:** {{ $inquiryData['submitted_at']->format('d.m.Y H:i') }}  
**Kupac:** {{ $inquiryData['customer_name'] }}  
**Email:** {{ $inquiryData['customer_email'] }}  
@if($inquiryData['customer_phone'])
**Telefon:** {{ $inquiryData['customer_phone'] }}  
@endif

## Informacije o gumi

@component('mail::table')
| Polje | Vrednost |
|:------|:---------|
| Šifra | {{ $inquiryData['tire']->sifra }} |
| Naziv | {{ $inquiryData['tire']->ime ?? $inquiryData['tire']->naziv }} |
@if($inquiryData['tire']->dimenzije)
| Dimenzije | {{ $inquiryData['tire']->dimenzije }} |
@endif
@if($inquiryData['tire']->sirina)
| Širina | {{ $inquiryData['tire']->sirina }} |
@endif
@if($inquiryData['tire']->visina)
| Visina | {{ $inquiryData['tire']->visina }} |
@endif
@if($inquiryData['tire']->sezona)
| Sezona | {{ $inquiryData['tire']->sezona }} |
@endif
@if($inquiryData['tire']->brend)
| Brend | {{ $inquiryData['tire']->brend }} |
@endif
| Stanje na stanju | {{ $inquiryData['tire']->kolicina_na_stanju }} kom |
| Status | {{ $inquiryData['tire']->is_active ? 'Aktivna' : 'Neaktivna' }} |
@if($inquiryData['tire']->veleprodajna_cijena)
| VP Cijena | {{ number_format($inquiryData['tire']->veleprodajna_cijena, 2) }} KM |
@endif
@if($inquiryData['tire']->maloprodajna_cijena)
| MP Cijena | {{ number_format($inquiryData['tire']->maloprodajna_cijena, 2) }} KM |
@endif
@endcomponent

## Poruka kupca

{{ $inquiryData['message'] }}

@if($inquiryData['user'])
## Registrovani korisnik

**Korisnik ID:** {{ $inquiryData['user']->id }}  
**Ime:** {{ $inquiryData['user']->name }}  
**Email:** {{ $inquiryData['user']->email }}  
@if($inquiryData['user']->company_name)
**Firma:** {{ $inquiryData['user']->company_name }}  
@endif
@if($inquiryData['user']->phone)
**Telefon:** {{ $inquiryData['user']->phone }}  
@endif
@endif

## Akcije

Za odgovor na upit, jednostavno odgovorite na ovaj email ili kontaktirajte kupca direktno.

@component('mail::button', ['url' => config('app.url')])
Otvori dashboard
@endcomponent

Hvala,<br>
{{ config('app.name') }}
@endcomponent
