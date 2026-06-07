<?php

namespace App\Http\Controllers;

use App\Models\Contribution;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Services\OpenRouterService;

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

    public function destroy($id)
    {
        $contribution = Contribution::findOrFail($id);

        try {
            // Delete from Firebase if status is approved (it has been synced)
            if ($contribution->status === 'approved') {
                $type = $contribution->type;
                $data = $contribution->data;

                // 1. Try to delete using stored firebase keys
                if (isset($data['firebase_keys']) && is_array($data['firebase_keys'])) {
                    foreach ($data['firebase_keys'] as $node => $key) {
                        $this->database->getReference($node . '/' . $key)->remove();
                    }
                } else {
                    // 2. Fallback: Search and delete based on type and fields
                    $slug = null;
                    if ($type === 'budaya' || $type === 'kota_budaya') {
                        $slug = \Illuminate\Support\Str::slug($data['artName'] ?? 'untitled');
                        $this->database->getReference('seni_budaya/' . $slug)->remove();

                        $artName = $data['artName'] ?? null;
                        if ($artName) {
                            $seniRef = $this->database->getReference('seni_budaya');
                            $seniData = $seniRef->getValue();
                            if (is_array($seniData)) {
                                foreach ($seniData as $key => $itemVal) {
                                    $nameVal = $itemVal['artName'] ?? $itemVal['title'] ?? '';
                                    if (strcasecmp($nameVal, $artName) === 0) {
                                        $this->database->getReference('seni_budaya/' . $key)->remove();
                                    }
                                }
                            }
                        }
                    }

                    if ($type === 'kota' || $type === 'kota_budaya' || $type === 'kota_kuliner') {
                        $cityName = $data['cityName'] ?? '';
                        if ($cityName) {
                            $citiesRef = $this->database->getReference('cities');
                            $cities = $citiesRef->getValue();
                            if (is_array($cities)) {
                                foreach ($cities as $key => $cityVal) {
                                    $nameVal = $cityVal['name'] ?? $cityVal['cityName'] ?? '';
                                    if (strcasecmp($nameVal, $cityName) === 0) {
                                        $this->database->getReference('cities/' . $key)->remove();
                                    }
                                }
                            }
                        }
                    }

                    if ($type === 'wisata' || $type === 'kuliner' || $type === 'kota_kuliner') {
                        $targetName = $data['tourismName'] ?? $data['shopName'] ?? '';
                        if ($targetName) {
                            $wisataRef = $this->database->getReference('wisata_kuliner');
                            $wisataData = $wisataRef->getValue();
                            if (is_array($wisataData)) {
                                foreach ($wisataData as $key => $itemVal) {
                                    $nameVal = $itemVal['tourismName'] ?? $itemVal['shopName'] ?? '';
                                    if (strcasecmp($nameVal, $targetName) === 0) {
                                        $this->database->getReference('wisata_kuliner/' . $key)->remove();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error('Gagal menghapus kontribusi dari Firebase: ' . $e->getMessage());
        }

        // Delete from local database
        $contribution->delete();

        return back()->with('success', 'Kontribusi berhasil dihapus sepenuhnya!');
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

        // Auto-translate fields to English using OpenRouter AI
        try {
            $translator = new OpenRouterService();
            $fieldsToTranslate = $this->getTranslatableFields($type);
            $data = $translator->translateFields($data, $fieldsToTranslate);
        } catch (\Exception $e) {
            \Log::warning('Auto-translation failed during approval: ' . $e->getMessage());
            // Continue without translation — data will still be saved in Indonesian
        }

        // Generate slug and set attributes for budaya / kota_budaya
        $slug = null;
        if ($type === 'budaya' || $type === 'kota_budaya') {
            $slug = \Illuminate\Support\Str::slug($data['artName'] ?? 'untitled');
            $data['slug'] = $slug;
            
            if (($data['artCategory'] ?? '') === 'batik' || ($data['artSubCategory'] ?? '') === 'batik') {
                $data['hasAR'] = true;
                $data['status'] = 'UNESCO';
            } else {
                $data['status'] = 'Kontribusi';
            }
        }

        $firebaseKeys = [];

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
            $cityRef = $this->database->getReference('cities')->push($kotaData);
            $firebaseKeys['cities'] = $cityRef->getKey();

            // Push specific sub-category data
            if ($type === 'kota_budaya') {
                if (isset($data['era'])) $data['year'] = $data['era'];
                $this->database->getReference('seni_budaya/' . $slug)->set($data);
                $firebaseKeys['seni_budaya'] = $slug;
            } else {
                $wisataRef = $this->database->getReference('wisata_kuliner')->push($data);
                $firebaseKeys['wisata_kuliner'] = $wisataRef->getKey();
            }
            
            $contribution->update([
                'data' => array_merge($contribution->data, ['firebase_keys' => $firebaseKeys])
            ]);
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

        if ($type === 'budaya') {
            $this->database->getReference('seni_budaya/' . $slug)->set($data);
            $firebaseKeys['seni_budaya'] = $slug;
        } else {
            $ref = $this->database->getReference($node)->push($data);
            $firebaseKeys[$node] = $ref->getKey();
        }

        $contribution->update([
            'data' => array_merge($contribution->data, ['firebase_keys' => $firebaseKeys])
        ]);
    }

    /**
     * Get the list of fields to translate based on contribution type.
     */
    private function getTranslatableFields($type)
    {
        $common = ['description', 'shortDesc'];

        $typeFields = [
            'kota' => ['cityName'],
            'budaya' => ['artName', 'makna', 'fakta_budaya'],
            'kota_budaya' => ['artName', 'cityName', 'makna', 'fakta_budaya'],
            'wisata' => ['tourismName', 'shopName', 'tourismDescription', 'short_description'],
            'kuliner' => ['shopName', 'tourismDescription', 'short_description', 'ingredientStory', 'ingredientName'],
            'kota_kuliner' => ['shopName', 'cityName', 'tourismDescription', 'short_description', 'ingredientStory', 'ingredientName'],
        ];

        return array_merge($common, $typeFields[$type] ?? []);
    }
}
