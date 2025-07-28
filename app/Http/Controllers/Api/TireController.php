<?php

namespace App\Http\Controllers\Api;
use App\Http\Resources\TireResource;


use App\Http\Controllers\Controller;
use App\Models\Tire;
use Illuminate\Http\Request;

class TireController extends Controller
{
    public function index()
    {
        return Tire::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sifra' => 'required|string|max:255',
            'naziv' => 'required|string|max:255',
            // Dodaj više validacija po potrebi
        ]);

        $tire = Tire::create($validated + ['is_active' => true]);
        return response()->json($tire, 201);
    }

    public function show(Tire $tire)
    {
        return new TireResource($tire);
    }

    public function update(Request $request, Tire $tire)
    {
        $validated = $request->validate([
            'sifra' => 'sometimes|string|max:255',
            'naziv' => 'sometimes|string|max:255',
            // Dodaj više validacija po potrebi
        ]);

        $tire->update($validated);
        return response()->json($tire);
    }

    public function destroy(Tire $tire)
    {
        $tire->delete();
        return response()->json(null, 204);
    }
}
