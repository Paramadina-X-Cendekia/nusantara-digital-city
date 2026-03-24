<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

use App\Models\Contribution;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

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
                        'name' => $value['name'] ?? $value['cityName'] ?? 'Unknown',
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
        ];

        $specificRules = [];
        if ($type === 'kota') {
            $specificRules = [
                'cityName' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'website' => 'nullable|url',
            ];
        } elseif ($type === 'budaya') {
            $specificRules = [
                'artName' => 'required|string|max:255',
                'artCategory' => 'required|string',
                'artSubCategory' => 'nullable|string',
                'origin' => 'required|string',
                'province' => 'required|string',
                'era' => 'nullable|string',
                'shortDesc' => 'required|string|max:255',
                'description' => 'required|string',
                'imageUrl' => 'nullable|url',
                'imageFile' => 'required_without:imageUrl|image|max:5120',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'videoLink' => 'nullable|url',
                'moral' => 'nullable|string|required_if:artCategory,cerita',
                'characters' => 'nullable|string|required_if:artCategory,cerita',
            ];
        } elseif ($type === 'wisata') {
            $specificRules = [
                'tourismName' => 'required|string|max:255',
                'tourismDescription' => 'required|string',
                'category' => 'required|string',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
            ];
        } elseif ($type === 'kuliner') {
            $specificRules = [
                'shopName' => 'required|string|max:255',
                'city' => 'required|string',
                'address' => 'required|string',
                'menuCount' => 'nullable|string',
                'digitalMenu' => 'boolean',
                'localStory' => 'boolean',
                // New Fields
                'dishName' => 'nullable|string|required_if:digitalMenu,true',
                'dishDescription' => 'nullable|string|required_if:digitalMenu,true',
                'spices' => 'nullable|string|required_if:digitalMenu,true',
                'dishImage' => 'nullable|image|max:5120',
                'ingredientName' => 'nullable|string|required_if:localStory,true',
                'farmerName' => 'nullable|string|required_if:localStory,true',
                'harvestDate' => 'nullable|string|required_if:localStory,true',
                'ingredientStory' => 'nullable|string|required_if:localStory,true',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'ingredientImage' => 'nullable|image|max:5120',
            ];
        }

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        try {
            $data = $validated;

            // Handle Multiple Image Uploads
            if ($request->hasFile('imageFile')) {
                $data['imageUrl'] = $this->uploadToCloudinary($request->file('imageFile'));
            }
            if ($request->hasFile('dishImage')) {
                $data['dishImageUrl'] = $this->uploadToCloudinary($request->file('dishImage'));
            }
            if ($request->hasFile('ingredientImage')) {
                $data['ingredientImageUrl'] = $this->uploadToCloudinary($request->file('ingredientImage'));
            }

            // Clean up file objects from data before saving to DB
            unset($data['imageFile'], $data['dishImage'], $data['ingredientImage']);

            // Save to database
            Contribution::create([
                'type' => $type,
                'data' => $data, // All specific fields are in data
                'status' => 'pending',
                'user_id' => Auth::id(),
            ]);

            return back()->with('success', 'Kontribusi Anda telah kami terima dan akan segera ditinjau oleh tim kurasi.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengirim kontribusi: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the edit form for a contribution.
     */
    public function edit($id)
    {
        $contribution = Contribution::where('user_id', Auth::id())->findOrFail($id);

        // Optional: Prevent editing if already approved
        if ($contribution->status === 'approved') {
            return redirect()->route('dashboard')->withErrors(['error' => 'Kontribusi yang sudah disetujui tidak dapat diedit.']);
        }

        try {
            $database = $this->getFirebaseDatabase();
            $reference = $database->getReference('cities');
            $snapshot = $reference->getSnapshot();
            
            $cities = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cities[] = [
                        'id' => $key,
                        'name' => $value['name'] ?? $value['cityName'] ?? 'Unknown',
                        'province' => $value['province'] ?? '-'
                    ];
                }
            }
            
            return Inertia::render('Kontribusi', [
                'cities' => $cities,
                'editingContribution' => $contribution,
                'initialType' => $contribution->type
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Kontribusi', [
                'cities' => [],
                'editingContribution' => $contribution,
                'initialType' => $contribution->type
            ]);
        }
    }

    /**
     * Update an existing contribution.
     */
    public function update(Request $request, $id)
    {
        $contribution = Contribution::where('user_id', Auth::id())->findOrFail($id);

        if ($contribution->status === 'approved') {
            return back()->withErrors(['error' => 'Kontribusi yang sudah disetujui tidak dapat diubah.']);
        }

        $type = $request->input('type', $contribution->type);
        
        $commonRules = [
            'type' => 'required|string',
        ];

        $specificRules = [];
        if ($type === 'kota') {
            $specificRules = [
                'cityName' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'website' => 'nullable|url',
            ];
        } elseif ($type === 'budaya') {
            $specificRules = [
                'artName' => 'required|string|max:255',
                'artCategory' => 'required|string',
                'artSubCategory' => 'nullable|string',
                'origin' => 'required|string',
                'province' => 'required|string',
                'era' => 'nullable|string',
                'shortDesc' => 'required|string|max:255',
                'description' => 'required|string',
                'imageUrl' => 'nullable|url',
                'imageFile' => 'nullable|image|max:5120',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'videoLink' => 'nullable|url',
                'moral' => 'nullable|string|required_if:artCategory,cerita',
                'characters' => 'nullable|string|required_if:artCategory,cerita',
            ];
        } elseif ($type === 'wisata') {
            $specificRules = [
                'tourismName' => 'required|string|max:255',
                'tourismDescription' => 'required|string',
                'category' => 'required|string',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
            ];
        } elseif ($type === 'kuliner') {
            $specificRules = [
                'shopName' => 'required|string|max:255',
                'city' => 'required|string',
                'address' => 'required|string',
                'menuCount' => 'nullable|string',
                'digitalMenu' => 'boolean',
                'localStory' => 'boolean',
                'dishName' => 'nullable|string|required_if:digitalMenu,true',
                'dishDescription' => 'nullable|string|required_if:digitalMenu,true',
                'spices' => 'nullable|string|required_if:digitalMenu,true',
                'dishImage' => 'nullable|image|max:5120',
                'ingredientName' => 'nullable|string|required_if:localStory,true',
                'farmerName' => 'nullable|string|required_if:localStory,true',
                'harvestDate' => 'nullable|string|required_if:localStory,true',
                'ingredientStory' => 'nullable|string|required_if:localStory,true',
                'lat' => 'nullable|numeric',
                'lng' => 'nullable|numeric',
                'ingredientImage' => 'nullable|image|max:5120',
            ];
        }

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        try {
            $data = $validated;
            $oldData = $contribution->data;

            // Handle Image Uploads (keep old ones if not replaced)
            if ($request->hasFile('imageFile')) {
                $data['imageUrl'] = $this->uploadToCloudinary($request->file('imageFile'));
            } else {
                $data['imageUrl'] = $oldData['imageUrl'] ?? null;
            }

            if ($request->hasFile('dishImage')) {
                $data['dishImageUrl'] = $this->uploadToCloudinary($request->file('dishImage'));
            } else {
                $data['dishImageUrl'] = $oldData['dishImageUrl'] ?? null;
            }

            if ($request->hasFile('ingredientImage')) {
                $data['ingredientImageUrl'] = $this->uploadToCloudinary($request->file('ingredientImage'));
            } else {
                $data['ingredientImageUrl'] = $oldData['ingredientImageUrl'] ?? null;
            }

            unset($data['imageFile'], $data['dishImage'], $data['ingredientImage']);

            $contribution->update([
                'data' => $data,
                'status' => 'pending', // Reset to pending after edit
            ]);

            return redirect()->route('dashboard')->with('success', 'Kontribusi Anda telah diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui kontribusi: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete a contribution.
     */
    public function destroy($id)
    {
        $contribution = Contribution::where('user_id', Auth::id())->findOrFail($id);
        
        if ($contribution->status === 'approved') {
             return back()->withErrors(['error' => 'Kontribusi yang sudah disetujui tidak dapat dihapus.']);
        }

        $contribution->delete();
        return back()->with('success', 'Kontribusi telah dihapus.');
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

        $aiResponse = $this->gemini->generateDescription(
            $request->type,
            $request->name
        );

        if ($request->type === 'kota' || $request->type === 'budaya' || $request->type === 'kuliner' || $request->type === 'bahan' || $request->type === 'wisata') {
            if (is_array($aiResponse) && isset($aiResponse['description'])) {
                $result = [
                    'description' => $aiResponse['description'],
                    'lat' => $aiResponse['lat'] ?? 0,
                    'lng' => $aiResponse['lng'] ?? 0,
                    'origin_city' => $aiResponse['origin_city'] ?? ''
                ];
                if ($request->type === 'budaya') {
                    $result['era'] = $aiResponse['era'] ?? '';
                }
                return response()->json($result);
            }
        }

        // If it's an error message from GeminiService
        if (str_contains($aiResponse, 'Terjadi kesalahan') || str_contains($aiResponse, 'quota')) {
            return response()->json(['error' => $aiResponse], 429);
        }

        return response()->json(['description' => $aiResponse]);
    }

    /**
     * Upload file to Cloudinary.
     */
    private function uploadToCloudinary($file)
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME');
        $apiKey = env('CLOUDINARY_API_KEY');
        $apiSecret = env('CLOUDINARY_API_SECRET');
        $timestamp = time();
        
        $params = [
            'timestamp' => $timestamp,
        ];
        
        ksort($params);
        $signatureData = "";
        foreach ($params as $key => $value) {
            $signatureData .= "{$key}={$value}&";
        }
        $signatureData = rtrim($signatureData, '&') . $apiSecret;
        $signature = sha1($signatureData);
        
        $response = Http::asMultipart()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
            'file' => fopen($file->getRealPath(), 'r'),
            'api_key' => $apiKey,
            'timestamp' => $timestamp,
            'signature' => $signature,
        ]);
        
        if ($response->successful()) {
            return $response->json()['secure_url'];
        }
        
        throw new \Exception('Cloudinary upload failed: ' . $response->body());
    }
}
