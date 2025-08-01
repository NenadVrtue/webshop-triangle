<?php

namespace App\Http\Controllers;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tire;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderCreated;
class OrderController extends Controller
{


    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.tire_id' => 'required|exists:tires,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount' => 'nullable|numeric|min:0',
        ]);

        $user = auth()->user();
        $order = Order::create([
            'user_id' => $user->id,
            'status' => 'pending',
            'discount' => $request->input('discount', 0),
            'order_date' => now(),
        ]);

        foreach ($request->items as $item) {
            $tire = Tire::findOrFail($item['tire_id']);
            $unitPrice = $tire->veleprodajna_cijena ?? 0;
            $quantity = $item['quantity'];
            $totalPrice = $unitPrice * $quantity;

            OrderItem::create([
                'order_id' => $order->id,
                'tire_id' => $tire->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
            ]);
        }

        // Slanje maila
        Mail::to(config('mail.admin_email'))->send(new OrderCreated($order));

        return redirect()->back()->with('success', 'Narudžba uspješno kreirana!');
    }

}
