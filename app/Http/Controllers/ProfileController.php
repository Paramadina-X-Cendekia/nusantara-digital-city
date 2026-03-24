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

        // Badge Logic
        $badge = $this->getBadge($stats['approved']);

        return Inertia::render('Profil', [
            'user' => $user,
            'contributions' => $contributions,
            'stats' => $stats,
            'badge' => $badge,
        ]);
    }

    private function getBadge($approvedCount)
    {
        if ($approvedCount >= 21) {
            return [
                'title' => 'Maestro of the Digital City',
                'level' => 'Maestro',
                'icon' => 'military_tech',
                'color' => '#8B5CF6', // Purple
                'next' => null
            ];
        } elseif ($approvedCount >= 11) {
            return [
                'title' => 'Heritage Guardian',
                'level' => 'Guardian',
                'icon' => 'shield',
                'color' => '#10B981', // Emerald
                'next' => 21
            ];
        } elseif ($approvedCount >= 4) {
            return [
                'title' => 'Cultural Chronicler',
                'level' => 'Chronicler',
                'icon' => 'history_edu',
                'color' => '#3B82F6', // Blue
                'next' => 11
            ];
        } else {
            return [
                'title' => 'Nusantara Pioneer',
                'level' => 'Pioneer',
                'icon' => 'explore',
                'color' => '#F59E0B', // Amber
                'next' => 4
            ];
        }
    }
}
