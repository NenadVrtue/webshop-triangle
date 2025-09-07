<?php

namespace App\Http\Controllers;

use App\Http\Resources\TireResource;
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

        // Get all tires with proper data mapping for DataTable
        $tires = Tire::select('id', 'sifra', 'ime', 'vp_cijena', 'mp_cijena', 'dimenzije', 'sirina', 'visina', 'kolicina_na_stanju', 'kategorija', 'sezona', 'eprel_code', 'is_active', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tire) {
                return [
                    'id' => $tire->id,
                    'sifra' => $tire->sifra,
                    'ime' => $tire->ime,
                    'dimenzije' => $tire->dimenzije,
                    'sirina' => $tire->sirina,
                    'visina' => $tire->visina,
                    'eprel_code' => $tire->eprel_code,
                    'veleprodajna_cijena' => $tire->vp_cijena ?? 0,
                    'maloprodajna_cijena' => $tire->mp_cijena ?? 0,
                    'nabavna_cijena' => 0, // Not in model fillable yet
                    'kolicina_na_stanju' => $tire->kolicina_na_stanju ?? 0,
                    'sezona' => $tire->sezona ?? 'N/A',
                    'is_active' => $tire->is_active ?? true,
                    'created_at' => $tire->created_at,
                    'updated_at' => $tire->updated_at,
                ];
            });

        return Inertia::render('dashboard', [
            'tires' => $tires,
        ]);
    }
}
