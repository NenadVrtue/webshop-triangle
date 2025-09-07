<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\Tire;
use App\Models\PromoCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
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
                    'role' => $user->role->value,
                    'is_active' => $user->is_active,
                    'orders_count' => $user->orders_count,
                    'created_at' => $user->created_at,
                ];
            });

        // Get all orders with customer and items info
        $query = Order::with(['user', 'items']);

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('order_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('order_date', '<=', $request->date_to);
        }

        // Filter by customer search
        if ($request->filled('customer_search')) {
            $search = $request->customer_search;
            $query->where(function($q) use ($search) {
                $q->where('customer_name', 'like', '%' . $search . '%')
                  ->orWhere('customer_email', 'like', '%' . $search . '%')
                  ->orWhere('company_name', 'like', '%' . $search . '%');
            });
        }

        $orders = $query->orderBy('created_at', 'desc')
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

        // Get all tires
        $tires = Tire::select('id', 'sifra', 'ime', 'vp_cijena', 'mp_cijena', 'dimenzije', 'sirina', 'visina', 'kolicina_na_stanju', 'kategorija', 'sezona', 'eprel_code', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tire) {
                return [
                    'id' => $tire->id,
                    'sifra' => $tire->sifra,
                    'ime' => $tire->ime,
                    'veleprodajna_cijena' => $tire->vp_cijena ?? 0,
                    'maloprodajna_cijena' => $tire->mp_cijena ?? 0,
                    'nabavna_cijena' => 0, // Not in model fillable yet
                    'kolicina_na_stanju' => $tire->kolicina_na_stanju ?? 0,
                    'sezona' => $tire->sezona ?? 'N/A',
                    'is_active' => true, // Default until column added
                    'created_at' => $tire->created_at,
                    'updated_at' => $tire->updated_at,
                ];
            });

        // Get promo codes with usage counts
        $promoCodes = PromoCode::withCount('users')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($promoCode) {
                return [
                    'id' => $promoCode->id,
                    'code' => $promoCode->code,
                    'discount' => (float) $promoCode->discount,
                    'expires_at' => $promoCode->expires_at ? $promoCode->expires_at->format('d.m.Y') : null,
                    'is_expired' => $promoCode->isExpired(),
                    'usage_count' => $promoCode->users_count,
                    'created_at' => $promoCode->created_at->format('d.m.Y H:i'),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'orders' => $orders,
            'tires' => $tires,
            'promoCodes' => $promoCodes,
            'stats' => [
                'total_users' => $users->count(),
                'active_users' => $users->where('is_active', true)->count(),
                'total_orders' => $orders->count(),
                'pending_orders' => $orders->where('status', 'pending')->count(),
                'total_revenue' => $orders->sum('total'),
            ],
            'filters' => [
                'status' => $request->status ?? 'all',
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'customer_search' => $request->customer_search,
            ]
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status narudžbe je uspešno ažuriran.');
    }
}
