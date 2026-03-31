<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function getFirebaseDatabase()
    {
        return \Kreait\Laravel\Firebase\Facades\Firebase::project('app')->database();
    }

    protected function getContributorInfo($contributorId, $fallbackName = null, $fallbackProfession = null, $fallbackBadge = null)
    {
        if (!$contributorId) {
            return [
                'name' => $fallbackName,
                'profession' => $fallbackProfession,
                'badge' => $fallbackBadge,
                'badge_icon' => null,
                'badge_color' => null,
            ];
        }

        $user = \App\Models\User::withCount(['contributions' => function($query) {
            $query->where('status', 'approved');
        }])->find($contributorId);

        if (!$user) {
            return [
                'name' => $fallbackName,
                'profession' => $fallbackProfession,
                'badge' => $fallbackBadge,
                'badge_icon' => null,
                'badge_color' => null,
            ];
        }

        $badgeInfo = $user->badge_info;

        return [
            'name' => $user->name,
            'profession' => $user->profession,
            'badge' => $badgeInfo['title'],
            'badge_icon' => $badgeInfo['icon'],
            'badge_color' => $badgeInfo['color'],
        ];
    }
}
