<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Kreait\Laravel\Firebase\Facades\Firebase;

use App\Models\Contribution;
use App\Services\OpenRouterService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class ContributionController extends Controller
{
    protected $ai;

    public function __construct(OpenRouterService $ai)
    {
        $this->ai = $ai;
    }
    /**
     * Helper to get validation rules based on type.
     */
    private function getSpecificRules($type, $isUpdate = false)
    {
        $kotaRules = [
            'cityName' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'website' => 'nullable|url',
        ];

        $budayaRules = [
            'artName' => 'required|string|max:255',
            'artCategory' => 'required|string',
            'artSubCategory' => 'nullable|string',
            'origin' => 'required|string',
            'province' => 'required|string',
            'era' => 'nullable|string',
            'shortDesc' => 'required|string|max:255',
            'description' => 'required|string',
            'imageUrl' => 'nullable|url',
            'imageFile' => $isUpdate ? 'nullable|image|max:5120' : 'required_without:imageUrl|image|max:5120',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'videoLink' => 'nullable|url',
            'moral' => 'nullable|string|required_if:artCategory,cerita',
            'characters' => 'nullable|string|required_if:artCategory,cerita',
        ];

        $wisataRules = [
            'tourismName' => 'required|string|max:255',
            'tourismDescription' => 'required|string',
            'category' => 'required|string',
            'mainImage' => 'nullable|image|max:5120',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ];

        $kulinerRules = [
            'shopName' => 'required|string|max:255',
            'city' => 'required|string',
            'address' => 'required|string',
            'mainImage' => 'nullable|image|max:5120',
            'menuCount' => 'nullable|string',
            'digitalMenu' => 'boolean',
            'localStory' => 'boolean',
            'dishes' => 'nullable|array',
            'dishes.*.name' => 'nullable|string|max:255|required_if:digitalMenu,true,1',
            'dishes.*.description' => 'nullable|string|required_if:digitalMenu,true,1',
            'dishes.*.spices' => 'nullable|string|required_if:digitalMenu,true,1',
            'dishes.*.image' => 'nullable|image|max:5120',
            'ingredientName' => 'nullable|string|required_if:localStory,true,1',
            'farmerName' => 'nullable|string|required_if:localStory,true,1',
            'harvestDate' => 'nullable|string|required_if:localStory,true,1',
            'ingredientStory' => 'nullable|string|required_if:localStory,true,1',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'ingredientImage' => 'nullable|image|max:5120',
        ];

        if ($type === 'kota') return $kotaRules;
        if ($type === 'budaya') return $budayaRules;
        if ($type === 'wisata') return $wisataRules;
        if ($type === 'kuliner') return $kulinerRules;
        if ($type === 'kota_budaya') return array_merge($kotaRules, $budayaRules);
        if ($type === 'kota_kuliner') return array_merge($kotaRules, $kulinerRules);

        return [];
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
            
            $citiesRaw = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cityName = $value['name'] ?? ($value['cityName'] ?? 'Unknown');
                    $citiesRaw[$cityName] = [
                        'id' => $key,
                        'name' => $cityName,
                        'province' => $value['province'] ?? '-'
                    ];
                }
            }
            $cities = array_values($citiesRaw);
            
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

        $specificRules = $this->getSpecificRules($type, false);

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        try {
            $data = $validated;

            // Handle Multiple Image Uploads
            if ($request->hasFile('imageFile')) {
                $data['imageUrl'] = $this->uploadToCloudinary($request->file('imageFile'));
            }
            if ($request->hasFile('mainImage')) {
                $data['mainImageUrl'] = $this->uploadToCloudinary($request->file('mainImage'));
            }
            if ($request->has('dishes') && is_array($request->input('dishes'))) {
                $dishes = $request->input('dishes');
                foreach ($dishes as $index => &$dish) {
                    if ($request->hasFile("dishes.$index.image")) {
                        $dish['imageUrl'] = $this->uploadToCloudinary($request->file("dishes.$index.image"));
                    }
                    unset($dish['image']); // Remove file object
                }
                $data['dishes'] = $dishes;
            }
            if ($request->hasFile('ingredientImage')) {
                $data['ingredientImageUrl'] = $this->uploadToCloudinary($request->file('ingredientImage'));
            }
            if ($request->hasFile('archiveFile')) {
                $data['archiveUrl'] = $this->uploadToCloudinary($request->file('archiveFile'));
            }

            // Clean up file objects from data before saving to DB
            unset($data['imageFile'], $data['ingredientImage'], $data['archiveFile']);

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

        // Prevent editing if already approved or past 24 hours
        if ($contribution->status === 'approved') {
            return redirect()->route('dashboard')->withErrors(['error' => 'Kontribusi yang sudah disetujui tidak dapat diedit.']);
        }

        if ($contribution->created_at->diffInMinutes(now()) >= 30) {
            return redirect()->route('dashboard')->withErrors(['error' => 'Waktu untuk mengedit kontribusi ini telah berakhir (Batas 30 menit).']);
        }

        try {
            $database = $this->getFirebaseDatabase();
            $reference = $database->getReference('cities');
            $snapshot = $reference->getSnapshot();
            
            $citiesRaw = [];
            if ($snapshot->hasChildren()) {
                foreach ($snapshot->getValue() as $key => $value) {
                    $cityName = $value['name'] ?? ($value['cityName'] ?? 'Unknown');
                    $citiesRaw[$cityName] = [
                        'id' => $key,
                        'name' => $cityName,
                        'province' => $value['province'] ?? '-'
                    ];
                }
            }
            $cities = array_values($citiesRaw);
            
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

        if ($contribution->created_at->diffInMinutes(now()) >= 30) {
            return back()->withErrors(['error' => 'Waktu untuk mengedit kontribusi ini telah berakhir (Batas 30 menit).']);
        }

        $type = $request->input('type', $contribution->type);
        
        $commonRules = [
            'type' => 'required|string',
        ];

        $specificRules = $this->getSpecificRules($type, true);

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
            
            if ($request->hasFile('mainImage')) {
                $data['mainImageUrl'] = $this->uploadToCloudinary($request->file('mainImage'));
            } else {
                $data['mainImageUrl'] = $oldData['mainImageUrl'] ?? null;
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

            if ($request->hasFile('archiveFile')) {
                $data['archiveUrl'] = $this->uploadToCloudinary($request->file('archiveFile'));
            } else {
                $data['archiveUrl'] = $oldData['archiveUrl'] ?? null;
            }

            unset($data['imageFile'], $data['mainImage'], $data['dishImage'], $data['ingredientImage'], $data['archiveFile']);

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

        \Illuminate\Support\Facades\Log::info('AI Generation Request', [
            'type' => $request->type,
            'name' => $request->name
        ]);

        $aiResponse = $this->ai->generateDescription(
            $request->type,
            $request->name
        );

        \Illuminate\Support\Facades\Log::info('AI Generation Response Received', [
            'type' => gettype($aiResponse),
            'response' => $aiResponse,
            'json' => is_array($aiResponse) ? json_encode($aiResponse) : $aiResponse
        ]);

        if (is_array($aiResponse)) {
            $result = $aiResponse;
            // Ensure numeric types for lat/lng
            $result['lat'] = isset($aiResponse['lat']) ? (float)$aiResponse['lat'] : 0;
            $result['lng'] = isset($aiResponse['lng']) ? (float)$aiResponse['lng'] : 0;
            
            return response()->json($result);
        }

        // If it's a string, check if it's actually a JSON string that wasn't decoded
        if (str_starts_with(trim($aiResponse), '{')) {
            $decoded = json_decode($aiResponse, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return response()->json($decoded);
            }
        }

        // If it's a string, check if it's an error message from AI Service
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
