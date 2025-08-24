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
            'discounts' => $discounts
        ]);
    }

    public function create()
    {
        return inertia('Discounts/Create', [
            'users' => User::all(['id', 'company_name', 'full_name'])
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tire_type' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
        ]);

        Discount::create($data);

        return redirect()->route('discounts.index')->with('success', 'Popust kreiran.');
    }

    public function edit(Discount $discount)
    {
        return inertia('Discounts/Edit', [
            'discount' => $discount,
            'users' => User::all(['id', 'company_name', 'full_name'])
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tire_type' => 'required|string|max:255',
            'percentage' => 'required|numeric|min:0|max:100',
        ]);

        $discount->update($data);

        return redirect()->route('discounts.index')->with('success', 'Popust ažuriran.');
    }

    public function destroy(Discount $discount)
    {
        $discount->delete();

        return redirect()->route('discounts.index')->with('success', 'Popust obrisan.');
    }
}
