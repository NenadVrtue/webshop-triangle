<?php
namespace App\Mail;
use App\Models\Order;
use Illuminate\Mail\Mailable;

class ToUserOrder extends Mailable
{
    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order->load('items.tire', 'user');
    }

    public function build()
    {
        return $this->subject('Nova narudžba')
            ->markdown('emails.order.touser');
    }
}
