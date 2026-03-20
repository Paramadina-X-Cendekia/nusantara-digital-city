<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

class PublicBudayaController extends Controller
{
    protected $database;

    public function __construct()
    {
        $this->database = Firebase::project('app')->database();
    }

    public function index()
    {
        $snapshot = $this->database->getReference('seni_budaya')->getSnapshot();
        $budayaData = [];
        
        if ($snapshot->hasChildren()) {
            foreach ($snapshot->getValue() as $id => $data) {
                $budayaData[] = array_merge(['id' => $id], $data);
            }
        }

        return Inertia::render('Budaya', [
            'budayaData' => $budayaData
        ]);
    }

    public function peta()
    {
        // Fetch budaya for map (those with lat/lng)
        $budayaSnapshot = $this->database->getReference('seni_budaya')->getSnapshot();
        $mapSites = [];

        if ($budayaSnapshot->hasChildren()) {
            foreach ($budayaSnapshot->getValue() as $id => $data) {
                if (isset($data['lat']) && isset($data['lng'])) {
                    $mapSites[] = [
                        'id' => $id,
                        'name' => $data['artName'] ?? 'Untitled',
                        'location' => ($data['origin'] ?? '') . ', ' . ($data['province'] ?? ''),
                        'desc' => $data['description'] ?? '',
                        'category' => $data['artCategory'] ?? 'Budaya',
                        'lat' => (float)$data['lat'],
                        'lng' => (float)$data['lng'],
                        'img' => $data['imageUrl'] ?? '',
                        'year' => $data['year'] ?? $data['era'] ?? 'Tradisional',
                        'status' => 'Verified'
                    ];
                }
            }
        }

        return Inertia::render('PetaWarisan', [
            'dynamicSites' => $mapSites
        ]);
    }
}
