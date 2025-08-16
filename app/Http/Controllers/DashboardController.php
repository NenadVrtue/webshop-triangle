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

        $tiresQuery = Tire::query();

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
