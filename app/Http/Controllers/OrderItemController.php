<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderItemRequest;
use App\Models\OrderItem;

class OrderItemController extends Controller
{
    public function index()
    {
        return OrderItem::all();
    }

    public function store(OrderItemRequest $request)
    {
        return OrderItem::create($request->validated());
    }

    public function show(OrderItem $orderItem)
    {
        return $orderItem;
    }

    public function update(OrderItemRequest $request, OrderItem $orderItem)
    {
        $orderItem->update($request->validated());

        return $orderItem;
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();

        return response()->json();
    }
}
