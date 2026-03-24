<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    protected $apiKey;
    protected $model;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->model = env('GEMINI_MODEL', 'gemini-2.0-flash');
    }

    public function generateDescription($type, $name, $context = '')
    {
        if (empty($this->apiKey)) {
            return "Mohon maaf, API Key Gemini belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di file .env.";
        }

        $prompt = "";
        if ($type === 'kota') {
            $prompt = "Dapatkan informasi tentang kota bernama '{$name}'. 
            Berikan respon dalam format JSON murni (TANPA markdown code block, TANPA penjelasan lain) dengan kunci: 
            - description: deskripsi singkat (2-3 kalimat) tentang potensi digital, budaya, dan pariwisatanya.
            - lat: garis lintang (latitude) pusat kota tersebut (angka desimal).
            - lng: garis bujur (longitude) pusat kota tersebut (angka desimal).";
        } elseif ($type === 'budaya') {
            $prompt = "Dapatkan informasi tentang warisan budaya '{$name}'. 
            Berikan respon dalam format JSON murni (TANPA markdown code block, TANPA penjelasan lain) dengan kunci: 
            - description: deskripsi singkat (2-3 kalimat) tentang sejarah dan keunikannya.
            - era: keterangan waktu/zaman (contoh: 'Abad ke-9', 'Tahun 1888', atau 'Tradisional').
            - lat: garis lintang (latitude) lokasi tersebut (jika berupa situs fisik, jika tidak 0).
            - lng: garis bujur (longitude) lokasi tersebut (jika berupa situs fisik, jika tidak 0).";
        } elseif ($type === 'kuliner') {
            $prompt = "Buatkan deskripsi promosi singkat (2-3 kalimat) untuk usaha kuliner/wisata bernama '{$name}'. 
            Berikan respon dalam format JSON murni dengan kunci: 
            - description: deskripsi promosi yang lezat dan menarik.
            - origin_city: nama kota/kabupaten asal bahan utama tersebut (contoh: 'Aceh Tengah', 'Medan', 'Yogyakarta').
            - lat: garis lintang (latitude) asal bahan utama/lokasi usaha (angka desimal).
            - lng: garis bujur (longitude) asal bahan utama/lokasi usaha (angka desimal).";
        }

        try {
            $baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent";
            $response = Http::post($baseUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ]
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json();
                $text = $aiResponse['candidates'][0]['content']['parts'][0]['text'] ?? 'Gagal menghasilkan deskripsi.';

                // Attempt to parse JSON for 'kota', 'budaya' and 'kuliner' types
                if ($type === 'kota' || $type === 'budaya' || $type === 'kuliner' || $type === 'bahan') {
                    $jsonStart = strpos($text, '{');
                    $jsonEnd = strrpos($text, '}');
                    
                    if ($jsonStart !== false && $jsonEnd !== false) {
                        $jsonStr = substr($text, $jsonStart, $jsonEnd - $jsonStart + 1);
                        $data = json_decode($jsonStr, true);
                        
                        if (json_last_error() === JSON_ERROR_NONE) {
                            return $data; // Return parsed JSON array
                        }
                    }
                }
                return $text; // Return raw text if not JSON or parsing failed
            }

            return "Terjadi kesalahan saat menghubungi layanan AI: " . $response->body();
        } catch (\Exception $e) {
            return "Kesalahan sistem: " . $e->getMessage();
        }
    }
}
