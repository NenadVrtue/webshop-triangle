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
        // Get initial tire data for the dashboard
        $tiresQuery = Tire::query();
        
        // If there's a search parameter, apply it
        if ($request->filled('sifra')) {
            $tiresQuery->where('sifra', 'like', '%' . $request->input('sifra') . '%');
        }
        
        $perPage = $request->input('per_page', 10);
        $tires = $tiresQuery->paginate($perPage);
        
        return Inertia::render('dashboard', [
            'tires' => TireResource::collection($tires),
        ]);
    }
}
