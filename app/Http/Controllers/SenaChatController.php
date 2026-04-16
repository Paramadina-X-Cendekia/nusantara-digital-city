<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SenaChatController extends Controller
{
    public function chat(Request $request)
    {
        $messages = $request->input('messages', []);
        
        $systemPrompt = [
            'role' => 'system',
            'content' => 'Kamu adalah Sena, AI asisten cerdas untuk aplikasi web Sinergi Nusa. Dalam bahasa Sansekerta, "Sena" berarti panglima atau pemimpin yang kuat. Nama ini mencerminkan sosok pelindung dan pemandu yang memiliki kewibawaan serta kesiagaan tinggi dalam menjaga pengetahuan warisan leluhur. Tugas utamamu membantu user memahami fitur Sinergi Nusa (seperti Peta Warisan, Eksplorasi Seni, Wisata, Kontribusi Budaya, Kisah Rakyat, Leaderboard, dll). JANGAN menjawab hal di luar konteks aplikasi Sinergi Nusa. Jika ditanya hal di luar aplikasi, beralihlah dengan ramah dan arahkan ke fitur Sinergi Nusa. Jawab dengan bahasa Indonesia yang singkat, jelas, dan ramah. PENTING: JANGAN SEKALI-KALI menggunakan simbol bintang (*) atau Markdown untuk teks tebal/miring, dan jangan memformat jawaban layaknya rangkuman dengan label (seperti **User:**). Balaslah secara natural selayaknya manusia berbalas pesan teks singkat.'
        ];
        
        array_unshift($messages, $systemPrompt);

        $apiKey = env('OPENROUTER_API_KEY');
        $model = env('OPENROUTER_MODEL', 'google/gemini-2.0-flash-001');

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'HTTP-Referer' => env('APP_URL', 'http://localhost'),
                'X-Title' => env('APP_NAME', 'Sinergi Nusa')
            ])->post('https://openrouter.ai/api/v1/chat/completions', [
                'model' => $model,
                'messages' => $messages,
            ]);

            if ($response->successful()) {
                $reply = $response->json()['choices'][0]['message']['content'] ?? 'Maaf, Sena tidak dapat memproses jawaban saat ini.';
                return response()->json(['reply' => $reply]);
            }
            
            Log::error('OpenRouter API Error: ' . $response->body());
            
            return response()->json([
                'reply' => 'Maaf, koneksi Sena ke server sedang bermasalah. Coba lagi nanti ya!'
            ], 500);
            
        } catch (\Exception $e) {
            Log::error('SenaChatController Exception: ' . $e->getMessage());
            return response()->json([
                'reply' => 'Maaf, terjadi kesalahan pada sistem internal Sena.'
            ], 500);
        }
    }
}
