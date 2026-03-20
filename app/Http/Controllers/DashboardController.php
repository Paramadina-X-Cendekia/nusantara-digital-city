<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            return $this->adminDashboard();
        }

        return $this->userDashboard($user);
    }

    protected function userDashboard($user)
    {
        $contributions = Contribution::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Simple badge logic for frontend
        $stats = [
            'total' => $contributions->count(),
            'approved' => $contributions->where('status', 'approved')->count(),
        ];

        return Inertia::render('Dashboard', [
            'contributions' => $contributions,
            'stats' => $stats,
        ]);
    }

    protected function adminDashboard()
    {
        $contributions = Contribution::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'allContributions' => $contributions,
            'pendingCount' => $contributions->where('status', 'pending')->count(),
        ]);
    }
}
