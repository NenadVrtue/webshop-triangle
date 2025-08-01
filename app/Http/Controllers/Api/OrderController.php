<?php

namespace App\Http\Controllers\Api;
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Tire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items.tire', 'user')->latest()->paginate(10);
        return OrderResource::collection($orders);
    }

    public function show(Order $order)
    {
        return new OrderResource($order->load('items.tire', 'user'));
    }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();

        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $user->id,
                'status' => 'pending',
                'discount' => $validated['discount'] ?? 0,
                'order_date' => now(),
            ]);

            foreach ($validated['items'] as $item) {
                $tire = Tire::findOrFail($item['tire_id']);
                $unitPrice = $tire->price;
                $total = $unitPrice * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'tire_id' => $tire->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'total_price' => $total,
                ]);
            }

            DB::commit();
            return new OrderResource($order->load('items.tire', 'user'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Greška pri kreiranju narudžbe.'], 500);
        }
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,approved,rejected,cancelled',
        ]);

        $order->update(['status' => $request->status]);
        return new OrderResource($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }
}
