<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        // Ambil gambar dari kontribusi yang sudah disetujui (approved) di database
        $contributorImages = Contribution::where('status', 'approved')
            ->get()
            ->map(function ($c) {
                // Ambil URL gambar yang tersedia dari setiap kontribusi
                return $c->data['imageUrl']
                    ?? $c->data['mainImageUrl']
                    ?? $c->data['ingredientImageUrl']
                    ?? null;
            })
            ->filter()     // Buang yang null
            ->unique()     // Hindari gambar duplikat
            ->shuffle()    // Acak urutan agar selalu segar
            ->take(10)     // Ambil maksimal 10 gambar
            ->values()
            ->toArray();

        return Inertia::render('Auth/Register', [
            'contributorImages' => $contributorImages,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role
        ]);

        Auth::login($user);

        event(new Registered($user));

        return redirect('/email/verify');
    }
}
