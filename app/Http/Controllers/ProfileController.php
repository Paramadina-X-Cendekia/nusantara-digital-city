<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $contributions = Contribution::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $contributions->count(),
            'approved' => $contributions->where('status', 'approved')->count(),
            'pending' => $contributions->where('status', 'pending')->count(),
            'rejected' => $contributions->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Profil', [
            'user' => $user,
            'contributions' => $contributions,
            'stats' => $stats,
            'badge' => $user->badge_info,
        ]);
    }
    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'profession' => 'nullable|string|max:100',
        ]);

        $request->user()->update($request->only('name', 'profession'));

        return back()->with('success', 'Profil berhasil diperbarui');
    }
}
