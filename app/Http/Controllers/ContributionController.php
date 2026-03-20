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
                'artCategory' => 'required|string',
                'artSubCategory' => 'nullable|string',
                'origin' => 'required|string',
                'province' => 'required|string',
                'era' => 'nullable|string',
                'description' => 'required|string',
                'imageUrl' => 'nullable|url',
                'imageFile' => 'required_without:imageUrl|image|max:5120',
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
                'businessProfile' => 'boolean',
            ];
        }

        $validated = $request->validate(array_merge($commonRules, $specificRules));

        try {
            $data = $validated;

            // Handle Cloudinary Upload
            if ($request->hasFile('imageFile')) {
                $data['imageUrl'] = $this->uploadToCloudinary($request->file('imageFile'));
                unset($data['imageFile']); // Clear the file object before saving to JSON
            }

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

        if ($request->type === 'budaya') {
            // Try to parse JSON from AI
            $jsonStart = strpos($aiResponse, '{');
            $jsonEnd = strrpos($aiResponse, '}');
            
            if ($jsonStart !== false && $jsonEnd !== false) {
                $jsonStr = substr($aiResponse, $jsonStart, $jsonEnd - $jsonStart + 1);
                $data = json_decode($jsonStr, true);
                
                if ($data && isset($data['description'])) {
                    return response()->json([
                        'description' => $data['description'],
                        'era' => $data['era'] ?? '',
                        'lat' => $data['lat'] ?? 0,
                        'lng' => $data['lng'] ?? 0
                    ]);
                }
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
