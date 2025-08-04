@component('mail::message')
    # Nova narudžba

    Naručilac: {{ $order->user->name }}

    Datum: {{ $order->order_date }}

    Popust: {{ $order->discount }} KM

    ## Stavke:
    @foreach ($order->items as $item)
        - **{{ $item->tire->name }}**: {{ $item->quantity }} kom x {{ $item->unit_price }} KM = {{ $item->total_price }} KM
    @endforeach

    Hvala!
@endcomponent
