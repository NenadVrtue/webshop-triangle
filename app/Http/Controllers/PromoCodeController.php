<?php

namespace App\Http\Controllers;

use App\Models\PromoCode;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoCodeController extends Controller
{
    public function index()
    {
        $promoCodes = PromoCode::withCount('users')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($promoCode) {
                return [
                    'id' => $promoCode->id,
                    'code' => $promoCode->code,
                    'discount' => (float) $promoCode->discount,
                    'expires_at' => $promoCode->expires_at?->format('d.m.Y'),
                    'is_expired' => $promoCode->isExpired(),
                    'usage_count' => $promoCode->users_count,
                    'created_at' => $promoCode->created_at->format('d.m.Y H:i'),
                ];
            });

        return Inertia::render('Admin/PromoCodes', [
            'promoCodes' => $promoCodes
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/PromoCodes/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:promo_codes,code|max:50|regex:/^[A-Z0-9]+$/',
            'discount' => 'required|numeric|min:0|max:999999.99',
            'expires_at' => 'nullable|date|after:today',
        ], [
            'code.required' => 'Kod je obavezan.',
            'code.unique' => 'Ovaj kod već postoji.',
            'code.regex' => 'Kod može sadržavati samo velika slova i brojeve.',
            'discount.required' => 'Popust je obavezan.',
            'discount.numeric' => 'Popust mora biti broj.',
            'discount.min' => 'Popust ne može biti negativan.',
            'discount.max' => 'Popust je prevelik.',
            'expires_at.after' => 'Datum isteka mora biti u budućnosti.',
        ]);

        PromoCode::create($data);

        return redirect()->back()->with('success', 'Promo kod je uspješno kreiran.');
    }

    public function update(Request $request, PromoCode $promoCode)
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|regex:/^[A-Z0-9]+$/|unique:promo_codes,code,' . $promoCode->id,
            'discount' => 'required|numeric|min:0|max:999999.99',
            'expires_at' => 'nullable|date|after:today',
        ], [
            'code.required' => 'Kod je obavezan.',
            'code.unique' => 'Ovaj kod već postoji.',
            'code.regex' => 'Kod može sadržavati samo velika slova i brojeve.',
            'discount.required' => 'Popust je obavezan.',
            'discount.numeric' => 'Popust mora biti broj.',
            'discount.min' => 'Popust ne može biti negativan.',
            'discount.max' => 'Popust je prevelik.',
            'expires_at.after' => 'Datum isteka mora biti u budućnosti.',
        ]);

        $promoCode->update($data);

        return redirect()->back()->with('success', 'Promo kod je uspješno ažuriran.');
    }

    public function destroy(PromoCode $promoCode)
    {
        // Check if promo code has been used
        if ($promoCode->users()->exists()) {
            return redirect()->back()->with('error', 'Ne možete obrisati promo kod koji je već korišten.');
        }

        $promoCode->delete();

        return redirect()->back()->with('success', 'Promo kod je uspješno obrisan.');
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
