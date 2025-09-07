@component('mail::message')

Poštovani {{ $order->customer_name }},

Vaša narudžba je proslijeđena na odobravanje.

## Stavke narudžbe

@component('mail::table')
| Proizvod | Šifra | Količina | Cijena | Ukupno |
|:---------|:------|:---------|:-------|:--------|
@foreach($order->items as $item)
| {{ $item->tire->ime }} | {{ $item->tire->sifra }} | {{ $item->quantity }} | {{ number_format($item->unit_price, 2) }} KM | {{ number_format($item->total_price, 2) }} KM |
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
