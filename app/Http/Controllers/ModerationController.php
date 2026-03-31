<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class ModerationController extends Controller
{
    protected $database;

    public function __construct()
    {
        $this->database = Firebase::project('app')->database();
    }

    public function approve($id, Request $request)
    {
        $contribution = Contribution::findOrFail($id);
        
        $contribution->update([
            'status' => 'approved',
            'admin_rating' => $request->input('admin_rating', 0),
            'is_duplicate' => $request->boolean('is_duplicate', false),
        ]);

        // Sync to Firebase for public visibility
        $this->syncToFirebase($contribution);

        return back()->with('success', 'Kontribusi berhasil disetujui dan dipublikasikan!');
    }

    public function reject($id, Request $request)
    {
        $contribution = Contribution::findOrFail($id);
        $contribution->update([
            'status' => 'rejected',
            'rejection_note' => $request->input('rejection_note'),
        ]);

        return back()->with('success', 'Kontribusi telah ditolak dengan catatan.');
    }

    public function contributorProfiles()
    {
        $profiles = \App\Models\User::withCount([
            'contributions as total_contributions',
            'contributions as approved_contributions' => function ($query) {
                $query->where('status', 'approved');
            },
            'contributions as rejected_contributions' => function ($query) {
                $query->where('status', 'rejected');
            }
        ])
        ->withAvg('contributions as average_rating', 'admin_rating')
        ->whereHas('contributions')
        ->get();

        return \Inertia\Inertia::render('Admin/ContributorProfiles', [
            'profiles' => $profiles
        ]);
    }

    protected function syncToFirebase($contribution)
    {
        $type = $contribution->type;
        $data = $contribution->data;

        // Add metadata to the data
        $user = $contribution->user;
        $data['contributor'] = $user->name;
        $data['contributor_id'] = $user->id;
        $data['contributor_profession'] = $user->profession ?? '-';
        $data['contributor_badge'] = $user->badge;
        $data['contributor_badge_icon'] = $user->badge_info['icon'];
        $data['contributor_badge_color'] = $user->badge_info['color'];
        $data['created_at'] = now()->toDateTimeString();

        // Clean up culinary data if features are disabled
        if (str_contains($type, 'kuliner')) {
            if (!($data['digitalMenu'] ?? false)) {
                unset($data['dishes']);
            }
            if (!($data['localStory'] ?? false)) {
                unset($data['ingredientName'], $data['farmerName'], $data['harvestDate'], $data['ingredientStory'], $data['ingredientImageUrl']);
            }
        }

        // Handle composite types: split and push to both nodes
        if ($type === 'kota_budaya' || $type === 'kota_kuliner') {
            $kotaData = [
                'name' => $data['cityName'] ?? '',
                'province' => $data['province'] ?? '',
                'description' => $data['description'] ?? '',
                'category' => $data['category'] ?? '',
                'lat' => $data['lat'] ?? null,
                'lng' => $data['lng'] ?? null,
                'website' => $data['website'] ?? null,
                'mainImageUrl' => $data['mainImageUrl'] ?? null,
                'contributor' => $data['contributor'],
                'created_at' => $data['created_at'],
            ];
            // Push logic for city
            $this->database->getReference('cities')->push($kotaData);

            // Push specific sub-category data
            if ($type === 'kota_budaya') {
                if (isset($data['era'])) $data['year'] = $data['era'];
                $this->database->getReference('seni_budaya')->push($data);
            } else {
                $this->database->getReference('wisata_kuliner')->push($data);
            }
            return;
        }

        // Map types to Firebase nodes for standard/single form submissions
        $nodes = [
            'kota' => 'cities',
            'budaya' => 'seni_budaya',
            'wisata' => 'wisata_kuliner',
            'kuliner' => 'wisata_kuliner'
        ];

        $node = $nodes[$type] ?? 'misc';

        // Map era to year for compatibility with existing frontend
        if ($type === 'budaya' && isset($data['era'])) {
            $data['year'] = $data['era'];
        }

        $this->database->getReference($node)->push($data);
    }
}
