<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Tire;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user() && method_exists($request->user(), 'isAdmin') && $request->user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($request->user() && method_exists($request->user(), 'isSales') && $request->user()->isSales()) {
            return redirect()->route('sales.dashboard');
        }

        $user = $request->user();

        // Get user's discounts if authenticated
        $userDiscounts = [];
        if ($user) {
            // Get per-user discounts (higher priority)
            $perUserDiscounts = Discount::where('user_id', $user->id)
                ->get()
                ->keyBy('tire_kategorija')
                ->map(fn ($discount) => $discount->percentage)
                ->toArray();

            // Get app-wide discounts (lower priority)
            $appWideDiscounts = Discount::where('scope', 'app_wide')
                ->get()
                ->keyBy('tire_kategorija')
                ->map(fn ($discount) => $discount->percentage)
                ->toArray();

            // Merge with per-user taking priority
            $userDiscounts = array_merge($appWideDiscounts, $perUserDiscounts);
        }

        // Get all tires with proper data mapping for DataTable
        $tires = Tire::select('id', 'sifra', 'ime', 'vp_cijena', 'mp_cijena', 'dimenzije', 'sirina', 'visina', 'kolicina_na_stanju', 'kategorija', 'sezona', 'eprel_code', 'is_active', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tire) use ($userDiscounts) {
                $discountPercentage = $userDiscounts[$tire->kategorija] ?? 0;
                $originalPrice = (float) ($tire->vp_cijena ?? 0);
                $discountedPrice = $originalPrice * (1 - $discountPercentage / 100);

                return [
                    'id' => $tire->id,
                    'sifra' => $tire->sifra,
                    'ime' => $tire->ime,
                    'dimenzije' => $tire->dimenzije,
                    'sirina' => $tire->sirina,
                    'visina' => $tire->visina,
                    'eprel_code' => $tire->eprel_code,
                    'vp_cijena' => $originalPrice,
                    'mp_cijena' => (float) ($tire->mp_cijena ?? 0),
                    'discount_percentage' => $discountPercentage,
                    'discounted_price' => $discountedPrice,
                    'kolicina_na_stanju' => (int) $tire->kolicina_na_stanju,
                    'sezona' => $tire->sezona,
                    'kategorija' => $tire->kategorija,
                    'is_active' => (bool) $tire->is_active,
                    'created_at' => $tire->created_at ? $tire->created_at->format('d.m.Y H:i') : null,
                    'updated_at' => $tire->updated_at ? $tire->updated_at->format('d.m.Y H:i') : null,
                ];
            });

        return Inertia::render('dashboard', [
            'tires' => $tires,
        ]);
    }
}
