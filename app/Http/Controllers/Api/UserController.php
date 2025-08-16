<?php

namespace App\Http\Controllers\Api;

use App\Enums\Role;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Filtri (opcionalni)
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role')) {
            $role = $request->query('role');
            if ($role !== '' && $role !== null) {
                $query->where('role', (int) $role);
            }
        }

        if ($request->has('is_active')) {
            $active = filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            if ($active !== null) {
                $query->where('is_active', $active ? 1 : 0);
            }
        }

        $perPage = (int) ($request->query('per_page', 15));
        $users = $query->orderBy('id', 'desc')->paginate($perPage);

        return UserResource::collection($users);
    }

    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();

        // Kreiraj korisnika; password se hešira preko casts
        $user = User::create([
            'company_name' => $validated['company_name'],
            'email'        => $validated['email'],
            'jib'          => $validated['jib'] ?? null,
            'full_name'    => $validated['full_name'],
            'phone'        => $validated['phone'] ?? null,
            'password'     => $validated['password'],
            'role'         => $validated['role'], // Enum rule prihvata Role::*, Eloquent snima int
            'is_active'    => (bool) $validated['is_active'],
        ]);

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(User $user)
    {
        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $validated = $request->validated();

        // Zaštiti od promjene vlastitih privilegija (opcionalno)
        // if ((int) $request->user()->id === (int) $user->id && array_key_exists('role', $validated)) {
        //     return response()->json(['message' => 'Ne možete mijenjati vlastitu ulogu.'], 422);
        // }

        // Ako password nije poslan ili je prazan, ne diraj ga
        if (array_key_exists('password', $validated) && ! $validated['password']) {
            unset($validated['password']);
        }

        $user->fill($validated);
        $user->save();

        return new UserResource($user);
    }

    public function destroy(Request $request, User $user)
    {
        // Ne dozvoli brisanje samog sebe
        if ((int) $request->user()->id === (int) $user->id) {
            return response()->json(['message' => 'Ne možete obrisati vlastiti nalog.'], 422);
        }

        $user->delete();

        return response()->noContent();
    }
}
