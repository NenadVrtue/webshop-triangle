<?php

namespace App\Http\Controllers\Api;
use App\Http\Resources\TireResource;


use App\Http\Controllers\Controller;
use App\Models\Tire;
use Illuminate\Http\Request;

class TireController extends Controller
{
    public function index(Request $request)
    {
        $query = Tire::query();

        if ($request->filled('sifra')) {
            $query->where('sifra', 'like', '%' . $request->input('sifra') . '%');
        }

        // Support fetching all tires for frontend pagination
        $perPage = $request->input('per_page', 1000); // Default to 1000 for frontend pagination
        
        // Allow up to 10000 items for large inventories
        if ($perPage > 10000) {
            $perPage = 10000;
        }

        return TireResource::collection($query->paginate($perPage));
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'sifra' => 'required|string|max:255',
            'naziv' => 'required|string|max:255',
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
            'is_active' => 'sometimes|boolean',
        ]);

        $tire->update($validated);
        
        // Return redirect back for Inertia.js compatibility
        return redirect()->back();
    }

    public function destroy(Tire $tire)
    {
        $tire->delete();
        return response()->json(null, 204);
    }
}
