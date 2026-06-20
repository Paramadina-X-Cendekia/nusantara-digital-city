<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Contribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
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

        return Inertia::render('Auth/Login', [
            'contributorImages' => $contributorImages,
        ]);
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->remember)) {
            $request->session()->regenerate();

            $user = Auth::user();
            if ($user->role === 'admin') {
                return redirect('/dashboard');
            }

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
