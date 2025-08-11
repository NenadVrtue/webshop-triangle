@component('mail::message')
# Nova narudžba #{{ $order->id }}

Pozdrav,

Primili smo novu narudžbu od kupca **{{ $order->customer_name }}**.

## Detalji narudžbe

**Broj narudžbe:** #{{ $order->id }}  
**Datum:** {{ $order->order_date->format('d.m.Y H:i') }}  
**Status:** {{ ucfirst($order->status) }}

## Informacije o kupcu

**Ime:** {{ $order->customer_name }}  
**Email:** {{ $order->customer_email }}  
@if($order->customer_phone)
**Telefon:** {{ $order->customer_phone }}  
@endif
@if($order->company_name)
**Firma:** {{ $order->company_name }}  
@endif

@if($order->address || $order->city || $order->postal_code)
## Adresa dostave

@if($order->address)
{{ $order->address }}  
@endif
@if($order->postal_code || $order->city)
{{ $order->postal_code }} {{ $order->city }}  
@endif
@endif

## Stavke narudžbe

@component('mail::table')
| Proizvod | Šifra | Količina | Cijena | Ukupno |
|:---------|:------|:---------|:-------|:--------|
@foreach($order->items as $item)
| {{ $item->tire->naziv }} | {{ $item->tire->sifra }} | {{ $item->quantity }} | {{ number_format($item->unit_price, 2) }} KM | {{ number_format($item->total_price, 2) }} KM |
@endforeach
@endcomponent

## Ukupno

**Subtotal:** {{ number_format($order->subtotal, 2) }} KM  
@if($order->discount_amount > 0)
**Popust:** -{{ number_format($order->discount_amount, 2) }} KM  
@endif
**Ukupno:** {{ number_format($order->total, 2) }} KM

@if($order->notes)
## Napomene

{{ $order->notes }}
@endif

@component('mail::button', ['url' => config('app.url')])
Otvori dashboard
@endcomponent

Hvala,<br>
{{ config('app.name') }}
@endcomponent
