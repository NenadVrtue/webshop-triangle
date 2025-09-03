<?php

namespace App\Http\Controllers;

use App\Mail\ToUserOrder;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PromoCode;
use App\Models\Tire;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderCreated;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function checkout()
    {
        return Inertia::render('Checkout');
    }


    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        $user = auth()->user();

        // Izračunaj subtotal
        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $tire = Tire::findOrFail($item['tire_id']);
            $unitPrice = $tire->veleprodajna_cijena ?? 0;
            $subtotal += $unitPrice * $item['quantity'];
        }

        // Saberi sve popuste
        $discountAmount  = $this->applyPromoCodeDiscount($validated, $user);
        $discountAmount += $this->applyTireTypeDiscount($validated, $user);

        // konačni total
        $total = $subtotal - $discountAmount;

        // Kreiraj order
        $order = Order::create([
            'user_id'         => $user->id,
            'status'          => 'pending',
            'customer_name'   => $validated['customer_name'],
            'customer_email'  => $validated['customer_email'],
            'customer_phone'  => $validated['customer_phone'] ?? null,
            'company_name'    => $validated['company_name'] ?? null,
            'address'         => $validated['address'] ?? null,
            'city'            => $validated['city'] ?? null,
            'postal_code'     => $validated['postal_code'] ?? null,
            'notes'           => $validated['notes'] ?? null,
            'subtotal'        => $subtotal,
            'discount_amount' => $discountAmount,
            'total'           => $total,
            'order_date'      => now(),
        ]);

        // Sačuvaj stavke
        foreach ($validated['items'] as $item) {
            $tire = Tire::findOrFail($item['tire_id']);
            $unitPrice = $tire->veleprodajna_cijena ?? 0;
            $totalPrice = $unitPrice * $item['quantity'];

            OrderItem::create([
                'order_id'    => $order->id,
                'tire_id'     => $tire->id,
                'quantity'    => $item['quantity'],
                'unit_price'  => $unitPrice,
                'total_price' => $totalPrice,
            ]);
        }

        // Email notifikacije
        try {
            Mail::to(config('mail.admin_email', 'nenadvrtue@gmail.com'))->send(new OrderCreated($order));
            Mail::to($order['customer_email'])->send(new ToUserOrder($order));
        } catch (\Exception $e) {
            \Log::error('Failed to send order email: ' . $e->getMessage());
        }

        return redirect()->route('orders.success', $order)->with('success', 'Narudžba je uspješno kreirana!');
    }

    /**
     * Primjena promo koda
     */
    protected function applyPromoCodeDiscount(array $validated, $user): float
    {
        $discount = 0;

        if (!empty($validated['promo_code'])) {
            $promo = PromoCode::where('code', $validated['promo_code'])->first();

            if ($promo && !$promo->isExpired()) {
                if (!$user->promoCodes()->where('promo_code_id', $promo->id)->exists()) {
                    $discount += $promo->discount;
                    $user->promoCodes()->attach($promo->id, ['used_at' => now()]);
                }
            }
        }

        return $discount;
    }

    /**
     * Primjena popusta po tipu gume
     */
    protected function applyTireTypeDiscount(array $validated, $user): float
    {
        $discountAmount = 0;

        foreach ($validated['items'] as $item) {
            $tire = Tire::findOrFail($item['tire_id']);
            $unitPrice = $tire->veleprodajna_cijena ?? 0;
            $lineTotal = $unitPrice * $item['quantity'];

            $discount = Discount::where('user_id', $user->id)
                ->where('tire_type', $tire->tip)
                ->first();

            if ($discount) {
                $lineDiscount = $lineTotal * ($discount->percentage / 100);
                $discountAmount += $lineDiscount;
            }
        }

        return $discountAmount;
    }


    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_date' => $order->order_date,
                    'status' => $order->status,
                    'customer_name' => $order->customer_name,
                    'total' => (float) ($order->total ?? 0),
                    'items_count' => $order->items()->count(),
                ];
            });

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function success(Order $order)
    {
        // Load order with items and tire details
        $order->load(['items.tire', 'user']);

        return Inertia::render('Orders/Success', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status ?? 'pending',
                'order_date' => $order->order_date ?? now(),
                'customer_name' => $order->customer_name ?? 'Test Customer',
                'customer_email' => $order->customer_email ?? 'test@example.com',
                'customer_phone' => $order->customer_phone,
                'company_name' => $order->company_name,
                'address' => $order->address,
                'city' => $order->city,
                'postal_code' => $order->postal_code,
                'notes' => $order->notes,
                'subtotal' => (float) ($order->subtotal ?? 0),
                'discount_amount' => (float) ($order->discount_amount ?? 0),
                'total' => (float) ($order->total ?? 0),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'tire_id' => $item->tire_id,
                        'quantity' => (int) $item->quantity,
                        'unit_price' => (float) ($item->unit_price ?? 0),
                        'total_price' => (float) ($item->total_price ?? 0),
                        'tire' => $item->tire ? [
                            'id' => $item->tire->id,
                            'sifra' => $item->tire->sifra,
                            'naziv' => $item->tire->naziv,
                            'tip' => $item->tire->tip,
                            'dimenzije' => $item->tire->dimenzije,
                            'brend' => $item->tire->brend,
                            'veleprodajna_cijena' => (float) ($item->tire->veleprodajna_cijena ?? 0),
                        ] : null
                    ];
                })
            ]
        ]);
    }
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,done,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return redirect()->back()->with('success', "Status narudžbe je postavljen na {$request->status}.");
    }


}
