<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get all users with their order counts
        $users = User::withCount('orders')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'company_name' => $user->company_name,
                    'phone' => $user->phone,
                    'jib' => $user->jib,
                    'role' => $user->role->name,
                    'is_active' => $user->is_active,
                    'orders_count' => $user->orders_count,
                    'created_at' => $user->created_at,
                ];
            });

        // Get all orders with customer and items info
        $orders = Order::with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_date' => $order->order_date,
                    'status' => $order->status,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'customer_phone' => $order->customer_phone,
                    'company_name' => $order->company_name,
                    'address' => $order->address,
                    'city' => $order->city,
                    'postal_code' => $order->postal_code,
                    'subtotal' => (float) ($order->subtotal ?? 0),
                    'discount_amount' => (float) ($order->discount_amount ?? 0),
                    'total' => (float) ($order->total ?? 0),
                    'items_count' => $order->items->count(),
                    'user' => $order->user ? [
                        'id' => $order->user->id,
                        'full_name' => $order->user->full_name,
                        'email' => $order->user->email,
                    ] : null,
                    'created_at' => $order->created_at,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'orders' => $orders,
            'stats' => [
                'total_users' => $users->count(),
                'active_users' => $users->where('is_active', true)->count(),
                'total_orders' => $orders->count(),
                'pending_orders' => $orders->where('status', 'pending')->count(),
                'total_revenue' => $orders->sum('total'),
            ]
        ]);
    }
}
