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
            $prompt = "Buatkan deskripsi singkat yang menarik dan inspiratif (sekitar 2-3 kalimat) untuk sebuah kota bernama '{$name}'. Fokus pada potensi digital, budaya, dan pariwisatanya.";
        } elseif ($type === 'budaya') {
            $prompt = "Buatkan deskripsi singkat (2-3 kalimat) tentang warisan budaya '{$name}'. Jelaskan nilai sejarah dan keunikannya bagi Indonesia.";
        } elseif ($type === 'kuliner') {
            $prompt = "Buatkan deskripsi promosi singkat (2-3 kalimat) untuk usaha kuliner/wisata bernama '{$name}'. Buatlah terdengar lezat dan menarik bagi wisatawan.";
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
                $data = $response->json();
                return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Gagal menghasilkan deskripsi.';
            }

            return "Terjadi kesalahan saat menghubungi layanan AI: " . $response->body();
        } catch (\Exception $e) {
            return "Kesalahan sistem: " . $e->getMessage();
        }
    }
}
