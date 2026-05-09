<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use App\Models\Order;
use App\Models\PromoCode;
use App\Models\Tire;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)->count();
        $totalOrders = Order::count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $totalRevenue = Order::sum('total');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'total_revenue' => (float) $totalRevenue,
            ],
        ]);
    }

    public function orders(Request $request)
    {
        $query = Order::with(['user', 'items']);

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('order_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('order_date', '<=', $request->date_to);
        }

        if ($request->filled('customer_search')) {
            $search = $request->customer_search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', '%'.$search.'%')
                    ->orWhere('customer_email', 'like', '%'.$search.'%')
                    ->orWhere('company_name', 'like', '%'.$search.'%');
            });
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($order) {
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

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
            'filters' => [
                'status' => $request->status ?? 'all',
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'customer_search' => $request->customer_search,
            ],
        ]);
    }

    public function tires(Request $request)
    {
        $query = Tire::select('id', 'sifra', 'ime', 'vp_cijena', 'mp_cijena', 'dimenzije', 'sirina', 'visina', 'kolicina_na_stanju', 'kategorija', 'sezona', 'eprel_code', 'image_url', 'is_active', 'created_at', 'updated_at');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('sifra', 'like', '%'.$search.'%')
                    ->orWhere('ime', 'like', '%'.$search.'%');
            });
        }

        if ($request->filled('kategorija')) {
            $query->where('kategorija', $request->kategorija);
        }

        if ($request->filled('sezona')) {
            $query->where('sezona', $request->sezona);
        }

        $tires = $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($tire) {
                return [
                    'id' => $tire->id,
                    'sifra' => $tire->sifra,
                    'ime' => $tire->ime,
                    'dimenzije' => $tire->dimenzije,
                    'sirina' => $tire->sirina,
                    'visina' => $tire->visina,
                    'eprel_code' => $tire->eprel_code,
                    'image_url' => $tire->image_url,
                    'vp_cijena' => (float) ($tire->vp_cijena ?? 0),
                    'mp_cijena' => (float) ($tire->mp_cijena ?? 0),
                    'kolicina_na_stanju' => (int) $tire->kolicina_na_stanju,
                    'sezona' => $tire->sezona,
                    'kategorija' => $tire->kategorija,
                    'is_active' => (bool) $tire->is_active,
                    'created_at' => $tire->created_at ? $tire->created_at->format('d.m.Y H:i') : null,
                    'updated_at' => $tire->updated_at ? $tire->updated_at->format('d.m.Y H:i') : null,
                ];
            });

        $kategorije = Tire::distinct()->orderBy('kategorija')->pluck('kategorija')->filter()->values();
        $sezone = Tire::distinct()->orderBy('sezona')->pluck('sezona')->filter()->values();

        return Inertia::render('Admin/Tires', [
            'tires' => $tires,
            'kategorije' => $kategorije,
            'sezone' => $sezone,
            'filters' => [
                'search' => $request->search,
                'kategorija' => $request->kategorija,
                'sezona' => $request->sezona,
            ],
        ]);
    }

    public function users(Request $request)
    {
        $query = User::withCount('orders');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere('company_name', 'like', '%'.$search.'%');
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($user) {
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

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function discounts(Request $request)
    {
        $discounts = Discount::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($discount) {
                return [
                    'id' => $discount->id,
                    'scope' => $discount->scope,
                    'user_id' => $discount->user_id,
                    'user' => $discount->user ? [
                        'id' => $discount->user->id,
                        'full_name' => $discount->user->full_name,
                        'company_name' => $discount->user->company_name,
                    ] : null,
                    'tire_kategorija' => $discount->tire_kategorija,
                    'percentage' => (float) $discount->percentage,
                    'created_at' => $discount->created_at->format('d.m.Y H:i'),
                ];
            });

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

        $allUsers = User::orderBy('full_name')->get()->map(fn($u) => [
            'id' => $u->id,
            'full_name' => $u->full_name,
            'company_name' => $u->company_name,
        ]);

        return Inertia::render('Admin/Discounts', [
            'discounts' => $discounts,
            'promoCodes' => $promoCodes,
            'users' => $allUsers,
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,done,cancelled',
        ]);

        $order->update([
            'status' => $request->status,
        ]);

        return back()->with('success', 'Status narudžbe je uspešno ažuriran.');
    }
}
