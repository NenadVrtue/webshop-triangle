<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\User;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function index()
    {
        $discounts = Discount::with('user')->paginate(10);

        return inertia('Discounts/Index', [
            'discounts' => $discounts,
        ]);
    }

    public function create()
    {
        return inertia('Discounts/Create', [
            'users' => User::all(['id', 'company_name', 'full_name']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'scope' => 'required|in:app_wide,per_user',
            'user_id' => 'required_if:scope,per_user|nullable|exists:users,id',
            'tire_kategorija' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
        ]);

        // Ako je app-wide, postavi user_id na null
        if ($data['scope'] === 'app_wide') {
            $data['user_id'] = null;
        }

        Discount::create($data);

        return back()->with('success', 'Popust je uspešno kreiran.');
    }

    public function edit(Discount $discount)
    {
        return inertia('Discounts/Edit', [
            'discount' => $discount,
            'users' => User::all(['id', 'company_name', 'full_name']),
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        $data = $request->validate([
            'scope' => 'required|in:app_wide,per_user',
            'user_id' => 'required_if:scope,per_user|nullable|exists:users,id',
            'tire_kategorija' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
        ]);

        // Ako je app-wide, postavi user_id na null
        if ($data['scope'] === 'app_wide') {
            $data['user_id'] = null;
        }

        $discount->update($data);

        return back()->with('success', 'Popust je uspešno ažuriran.');
    }

    public function destroy(Discount $discount)
    {
        $discount->delete();

        return back()->with('success', 'Popust je uspešno obrisan.');
    }
}
