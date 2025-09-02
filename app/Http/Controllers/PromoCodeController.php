<?php

namespace App\Http\Controllers;

use App\Models\PromoCode;
use Illuminate\Http\Request;

class PromoCodeController extends Controller
{
    public function index()
    {
        $promoCodes = PromoCode::paginate(10);

        return inertia('PromoCodes/Index', [
            'promoCodes' => $promoCodes
        ]);
    }

    public function create()
    {
        return inertia('PromoCodes/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:promo_codes,code|max:255',
            'expires_at' => 'nullable|date',
        ]);

        PromoCode::create($data);

        return redirect()->route('promo-codes.index')->with('success', 'Promo kod kreiran.');
    }
    public function useCode(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
        ]);

        $promo = PromoCode::where('code', $data['code'])->first();

        if (!$promo) {
            return back()->withErrors(['code' => 'Neispravan promo kod.']);
        }

        if ($promo->isExpired()) {
            return back()->withErrors(['code' => 'Promo kod je istekao.']);
        }

        $user = $request->user();

        if ($user->promoCodes()->where('promo_code_id', $promo->id)->exists()) {
            return back()->withErrors(['code' => 'Već si iskoristio ovaj promo kod.']);
        }

        $user->promoCodes()->attach($promo->id, ['used_at' => now()]);

        return back()->with('success', 'Promo kod uspješno iskorišten!');
    }

}
