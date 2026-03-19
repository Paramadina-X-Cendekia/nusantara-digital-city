<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

use App\Services\GeminiService;

class ContributionController extends Controller
{
    protected $gemini;

    public function __construct(GeminiService $gemini)
    {
        $this->gemini = $gemini;
    }
    /**
     * Show the unified contribution page.
     */
    public function index(Request $request)
    {
        try {
            $database = $this->getFirebaseDatabase();
            $reference = $database->getReference('cities');
            $snapshot = $reference->getSnapshot();
            
            $cities = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cities[] = [
                        'id' => $key,
                        'name' => $value['name'] ?? 'Unknown',
                        'province' => $value['province'] ?? '-'
                    ];
                }
            }
            
            return Inertia::render('Kontribusi', [
                'cities' => $cities,
                'initialType' => $request->query('type', 'kota')
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Kontribusi', [
                'cities' => [],
                'initialType' => $request->query('type', 'kota')
            ]);
        }
    }

    /**
     * Handle unified contribution submission.
     */
    public function store(Request $request)
    {
        $type = $request->input('type', 'kota');
        
        $commonRules = [
            'type' => 'required|string',
            'contactName' => 'required|string|max:255',
            'contactEmail' => 'required|email|max:255',
            'contactPhone' => 'required|string|max:20',
        ];

        $specificRules = [];
        if ($type === 'kota') {
            $specificRules = [
                'cityName' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string',
                'maps_link' => 'nullable|string', // Replaced population
                'website' => 'nullable|url',
            ];
        } elseif ($type === 'budaya') {
            $specificRules = [
                'artName' => 'required|string|max:255',
                'category' => 'required|string',
                'origin' => 'required|string',
                'province' => 'required|string',
                'description' => 'required|string',
            ];
        } elseif ($type === 'kuliner') {
            $specificRules = [
                'shopName' => 'required|string|max:255',
                'city' => 'required|string',
                'address' => 'required|string',
                'menuCount' => 'nullable|string',
                'digitalMenu' => 'boolean',
                'businessProfile' => 'boolean',
            ];
        }

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        try {
            $database = $this->getFirebaseDatabase();
            // Store all contributions in a single node for admin review
            $database->getReference('pending_contributions')->push(array_merge($validated, [
                'status' => 'pending',
                'submitted_at' => now()->toDateTimeString(),
            ]));

            return back()->with('success', 'Kontribusi Anda telah kami terima dan akan segera ditinjau oleh tim kurasi.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengirim kontribusi: ' . $e->getMessage()]);
        }
    }

    /**
     * Generate description using AI.
     */
    public function generateDescription(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'name' => 'required|string',
        ]);

        $description = $this->gemini->generateDescription(
            $request->type,
            $request->name
        );

        return response()->json(['description' => $description]);
    }
}
