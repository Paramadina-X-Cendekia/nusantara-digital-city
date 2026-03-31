<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

class PublicKulinerController extends Controller
{
    protected $database;

    public function __construct()
    {
        $this->database = Firebase::project('app')->database();
    }

    public function index()
    {
        $snapshot = $this->database->getReference('wisata_kuliner')->getSnapshot();
        $contributedDishes = [];
        $contributedIngredients = [];

        if ($snapshot->exists()) {
            foreach ($snapshot->getValue() as $key => $data) {
                // Extract Dishes (Menu Digital)
                if (isset($data['dishes']) && is_array($data['dishes'])) {
                    foreach ($data['dishes'] as $index => $dish) {
                        $contributedDishes[] = [
                            'id' => 'fb_dish_' . $key . '_' . $index,
                            'name' => $dish['name'],
                            'shopName' => $data['shopName'] ?? ($data['tourismName'] ?? null),
                            'shopImage' => $data['mainImageUrl'] ?? null,
                            'address' => $data['address'] ?? null,
                            'origin' => $data['cityName'] ?? ($data['city'] ?? 'Indonesia'),
                            'desc' => $dish['description'],
                            'img' => $dish['imageUrl'] ?? null,
                            'status' => 'Verified Contributor',
                            'contributor' => $data['contributor'] ?? null,
                            'contributor_id' => $data['contributor_id'] ?? null,
                            'contributor_profession' => $data['contributor_profession'] ?? null,
                            'contributor_badge' => $data['contributor_badge'] ?? null,
                            'contributor_badge_icon' => $data['contributor_badge_icon'] ?? null,
                            'contributor_badge_color' => $data['contributor_badge_color'] ?? null,
                            'ingredients' => array_map(function($ing, $idx) {
                                return [
                                    'id' => $idx,
                                    'name' => $ing['name'] ?? 'Bahan',
                                    'desc' => $ing['desc'] ?? '',
                                ];
                            }, $dish['ingredients'] ?? [], array_keys($dish['ingredients'] ?? []))
                        ];
                    }
                }

                // Extract Ingredient Stories (Kisah Bahan Lokal)
                if (isset($data['localStory']) && $data['localStory'] == true && isset($data['ingredientName'])) {
                    $contributedIngredients[] = [
                        'id' => 'fb_ing_' . $key,
                        'name' => $data['ingredientName'],
                        'shopName' => $data['shopName'] ?? ($data['tourismName'] ?? null),
                        'shopImage' => $data['mainImageUrl'] ?? null,
                        'address' => $data['address'] ?? null,
                        'origin' => $data['cityName'] ?? ($data['city'] ?? 'Indonesia'),
                        'farmer' => $data['farmerName'] ?? 'Petani Lokal',
                        'date' => $data['harvestDate'] ?? now()->format('d M Y'),
                        'dist' => 'Lokal',
                        'verified' => true,
                        'img' => $data['ingredientImageUrl'] ?? null,
                        'story' => $data['ingredientStory'] ?? '',
                        'lat' => $data['lat'] ?? 0,
                        'lng' => $data['lng'] ?? 0,
                        'contributor' => $data['contributor'] ?? null,
                        'contributor_id' => $data['contributor_id'] ?? null,
                        'contributor_profession' => $data['contributor_profession'] ?? null,
                        'contributor_badge' => $data['contributor_badge'] ?? null,
                        'contributor_badge_icon' => $data['contributor_badge_icon'] ?? null,
                        'contributor_badge_color' => $data['contributor_badge_color'] ?? null,
                    ];
                }
            }
        }

        return Inertia::render('EksplorasiKuliner', [
            'contributedDishes' => $contributedDishes,
            'contributedIngredients' => $contributedIngredients
        ]);
    }
}
