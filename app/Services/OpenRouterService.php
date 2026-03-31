<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenRouterService
{
    protected $apiKey;
    protected $model;

    public function __construct()
    {
        $this->apiKey = env('OPENROUTER_API_KEY');
        $this->model = env('OPENROUTER_MODEL', 'google/gemini-2.0-flash-001');
    }

    public function generateDescription($type, $name)
    {
        if (empty($this->apiKey)) {
            return "Mohon maaf, OpenRouter API Key belum dikonfigurasi. Silakan tambahkan OPENROUTER_API_KEY di file .env.";
        }

        $prompt = $this->getPrompt($type, $name);

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    ['role' => 'user', 'content' => $prompt]
                ],
                'response_format' => ['type' => 'json_object']
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json();
                $text = $aiResponse['choices'][0]['message']['content'] ?? '{}';
                
                // Clean markdown JSON blocks if present
                $cleanText = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
                $decoded = json_decode($cleanText, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    if (is_array($decoded) && isset($decoded[0]) && is_array($decoded[0])) {
                        return $decoded[0];
                    }
                    return $decoded;
                }

                // If decoding fails, try one more time by stripping ANY text around the first { and last } or [ and ]
                if (preg_match('/[\{\[].*[\}\]]/s', $cleanText, $matches)) {
                    $decoded = json_decode($matches[0], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        if (is_array($decoded) && isset($decoded[0]) && is_array($decoded[0])) {
                            return $decoded[0];
                        }
                        return $decoded;
                    }
                }

                return $text;
            }

            return "Terjadi kesalahan saat menghubungi OpenRouter: " . $response->body();
        } catch (\Exception $e) {
            return "Kesalahan sistem: " . $e->getMessage();
        }
    }

    private function getPrompt($type, $name)
    {
        if ($type === 'kota') {
            return "Dapatkan informasi geografis tentang kota bernama '{$name}'. 
            Berikan respon dalam format JSON murni dengan kunci: 
            - lat: garis lintang (latitude) pusat kota tersebut (angka desimal).
            - lng: garis bujur (longitude) pusat kota tersebut (angka desimal).";
        } elseif ($type === 'bahan') {
            return "Dapatkan informasi menarik tentang bahan pangan/lokal bernama '{$name}'. 
            FOKUS UTAMA: Berikan informasi KHUSUS tentang karakteristik, asal-usul, atau keunikan bahan '{$name}' ini. Jangan berikan deskripsi umum tentang kota asalnya.
            Berikan respon dalam format JSON murni dengan kunci: 
            - description: cerita singkat (2-3 kalimat) tentang asal-usul, keunikan, atau nilai gizi bahan '{$name}'.";
        } elseif ($type === 'budaya' || $type === 'seni') {
            return "Dapatkan informasi mendalam tentang warisan budaya/seni bernama '{$name}'. 
            FOKUS UTAMA: Berikan informasi KHUSUS tentang karya/situs/cerita '{$name}' ini, jangan berikan deskripsi umum tentang kota asalnya.
            Berikan respon dalam format JSON murni dengan kunci: 
            - description: deskripsi singkat (2-3 kalimat) tentang sejarah dan keunikannya.
            - short_description: ringkasan sangat singkat (Maksimal 15 kata) yang memikat tentang karya ini.
            - makna: eksplorasi makna mendalam dan filosofi karya ini.
            - fakta_menarik: array berisi 3-4 fakta menarik tentang karya ini.
            - fakta_budaya: penjelasan tentang nilai budaya yang terkandung.
            - era: keterangan waktu/zaman (contoh: 'Abad ke-9', 'Tahun 1888', atau 'Tradisional').
            - lat: garis lintang (latitude) lokasi tersebut (jika berupa situs fisik, jika tidak 0).
            - lng: garis bujur (longitude) lokasi tersebut (jika berupa situs fisik, jika tidak 0).";
        } elseif ($type === 'wisata' || $type === 'kuliner') {
            return "Dapatkan informasi menarik tentang tempat wisata atau usaha kuliner bernama '{$name}'. 
            FOKUS UTAMA: Berikan informasi KHUSUS tentang destinasi/tempat wisata/warung bernama '{$name}' ini. Jangan berikan deskripsi tentang kota asalnya.
             Berikan respon dalam format JSON murni dengan kunci: 
            - description: deskripsi menarik (2-3 kalimat) tentang daya tarik, sejarah singkat, atau keunikan '{$name}'.
            - short_description: ringkasan sangat singkat (Maksimal 15 kata) yang memikat tentang tempat ini.
            - city: nama kota atau kabupaten lokasi tersebut.
            - address: alamat lengkap lokasi tersebut.
            - lat: garis lintang (latitude) lokasi tersebut (angka desimal).
            - lng: garis bujur (longitude) lokasi tersebut (angka desimal).";
        } elseif ($type === 'spices') {
            return "Dapatkan daftar komposisi bahan dan bumbu autentik untuk hidangan bernama '{$name}'. 
            FOKUS UTAMA: Berikan daftar bahan, rempah, dan bumbu yang biasanya digunakan dalam hidangan '{$name}' ini secara mendalam.
            Berikan respon dalam format JSON murni dengan kunci 'ingredients' yang berisi array of objects:
            - name: nama bahan/rempah.
            - desc: deskripsi singkat kegunaan atau karakteristik bahan tersebut dalam hidangan ini (maksimal 10 kata).
            Maksimal 10 bahan utama.";
        }

        return "Berikan deskripsi singkat tentang '{$name}' dalam format JSON { \"description\": \"...\" }";
    }

    public function analyzeArchive($base64Data, $mimeType)
    {
        if (empty($this->apiKey)) {
            return "Mohon maaf, OpenRouter API Key belum dikonfigurasi. Silakan tambahkan OPENROUTER_API_KEY di file .env.";
        }

        $prompt = "Tolong analisis dokumen/gambar terlampir yang berisi informasi tentang Warisan Budaya atau Seni di Indonesia. 
        Ekstrak informasi penting dan berikan respon dalam format JSON murni dengan kunci:
        - artName: Nama karya seni/budaya/cerita (string).
        - artCategory: Kategori ('seni', 'sejarah', atau 'cerita').
        - artSubCategory: Sub-kategori (contoh: 'batik', 'gamelan', 'Legenda', dll).
        - origin: Nama kota atau daerah asal (string).
        - era: Zaman atau periode waktu (string).
        - description: Deskripsi lengkap tentang karya tersebut (minimal 3 kalimat).
        - short_description: Ringkasan menarik (maksimal 15 kata).
        - makna: Filosofi atau makna mendalam dari karya tersebut.
        - moral: Nilai moral atau pesan yang terkandung (terutama jika kategori cerita).
        - characters: Tokoh-tokoh penting (array of strings, jika ada).
        - fakta_budaya: Hubungan karya ini dengan identitas budaya masyarakat setempat.
        
        PASTIKAN respon HANYA berupa objek JSON yang valid.";

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ])->timeout(60)->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'user', 
                        'content' => [
                            ['type' => 'text', 'text' => $prompt],
                            [
                                'type' => 'image_url', 
                                'image_url' => [
                                    'url' => "data:{$mimeType};base64,{$base64Data}"
                                ]
                            ]
                        ]
                    ]
                ],
                'response_format' => ['type' => 'json_object']
            ]);

            if ($response->successful()) {
                $aiResponse = $response->json();
                $text = $aiResponse['choices'][0]['message']['content'] ?? '{}';
                
                $cleanText = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
                $decoded = json_decode($cleanText, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    return $decoded;
                }

                if (preg_match('/[\{\[].*[\}\]]/s', $cleanText, $matches)) {
                    $decoded = json_decode($matches[0], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        return $decoded;
                    }
                }

                return $text;
            }

            return "Terjadi kesalahan saat menghubungi OpenRouter: " . $response->body();
        } catch (\Exception $e) {
            return "Kesalahan sistem: " . $e->getMessage();
        }
    }
}
